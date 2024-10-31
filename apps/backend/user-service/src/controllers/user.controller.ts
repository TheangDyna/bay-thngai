import {
  Controller,
  Get,
  Post,
  Path,
  Route,
  SuccessResponse,
  Body,
  Put,
  Delete,
  Queries,
  Middlewares,
  Request,
} from "tsoa";
import UserService from "@/src/services/user.service";
import validateRequest from "@/src/middlewares/validate-input";
import userJoiSchema from "@/src/schemas/user.schema";
import {
  UserCreationRequestParams,
  UserGetAllControllerParams,
  UserProfileResponse,
  UsersPaginatedResponse,
  UserUpdateRequestParams,
} from "@/src/controllers/types/user-controller.type";
import { Request as ExpressRequest } from "express";

@Route("v1/users")
export class UsersController extends Controller {
  @Get("/health")
  public async getHealth(): Promise<{ message: string }> {
    try {
      return { message: "OK" };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  public async getAllUsers(
    @Queries() queries: UserGetAllControllerParams
  ): Promise<UsersPaginatedResponse> {
    try {
      const response = await UserService.getAllUsers(queries);

      return { message: "success", data: response };
    } catch (error) {
      console.error(`UsersController - getAllUsers() method error: ${error}`);
      throw error;
    }
  }

  @SuccessResponse("201", "Created")
  @Post()
  @Middlewares(validateRequest(userJoiSchema))
  public async createUser(
    @Body() requestBody: UserCreationRequestParams
  ): Promise<UserProfileResponse> {
    try {
      // Create New User
      const response = await UserService.createNewUser(requestBody);

      // Schedule Notification Job 1 Minute Later
      // await agenda.schedule(
      //   "in 1 minutes",
      //   SCHEDULE_JOBS.NOTIFICATION_NEW_REGISTRATION,
      //   { userId: response._id }
      // );

      this.setStatus(201); // set return status 201
      return { message: "success", data: response };
    } catch (error) {
      console.error(`UsersController - createUser() method error: ${error}`);
      throw error;
    }
  }

  @Get("/me")
  public async getMe(
    @Request() request: ExpressRequest
  ): Promise<UserProfileResponse> {
    try {
      const sub = request.cookies["username"]; // user_id

      const response = await UserService.getUserBySub(sub);

      return { message: "success", data: response };
    } catch (error) {
      console.error(`UsersController - getMe() method error: ${error}`);
      throw error;
    }
  }

  @Post("/me/favorites")
  public async addFavorite(
    @Request() request: ExpressRequest,
    @Body() body: { productId: string }
  ): Promise<UserProfileResponse> {
    try {
      const userId = request.cookies["user_id"];
      const { productId } = body;

      const response = await UserService.addFavorite(userId, productId);

      return {
        message: "Favorite added successfully",
        data: response,
      };
    } catch (error) {
      console.error(`UsersController - addFavorite() method error: ${error}`);
      throw error;
    }
  }

  @Get("/me/favorites")
  public async getFavorites(
    @Request() request: ExpressRequest
  ): Promise<{ message: string; data: string[] }> {
    try {
      const userId = request.cookies["user_id"];

      const favorites = await UserService.getUserFavorites(userId);

      return { message: "success", data: favorites };
    } catch (error) {
      console.error(`UsersController - getFavorites() method error: ${error}`);
      throw error;
    }
  }

  @Delete("/me/favorites/{productId}")
  public async removeFavorite(
    @Request() request: ExpressRequest,
    @Path() productId: string
  ): Promise<UserProfileResponse> {
    try {
      const userId = request.cookies["user_id"];

      const response = await UserService.removeFavorite(userId, productId);

      return {
        message: "Favorite removed successfully",
        data: response,
      };
    } catch (error) {
      console.error(
        `UsersController - removeFavorite() method error: ${error}`
      );
      throw error;
    }
  }

  @Get("/{userId}")
  public async getUserProfile(
    @Path() userId: string
  ): Promise<UserProfileResponse> {
    try {
      const response = await UserService.getUserById(userId);

      return { message: "success", data: response };
    } catch (error) {
      console.error(
        `UsersController - getUserProfile() method error: ${error}`
      );
      throw error;
    }
  }

  @Put("/{userId}")
  public async updateUserById(
    @Path() userId: string,
    @Body() updateUserInfo: UserUpdateRequestParams
  ): Promise<UserProfileResponse> {
    try {
      const newUpdateUserInfo = { id: userId, ...updateUserInfo };
      const response = await UserService.updateUserById(newUpdateUserInfo);

      return { message: "success", data: response };
    } catch (error) {
      console.error(
        `UsersController - updateUserById() method error: ${error}`
      );
      throw error;
    }
  }

  @SuccessResponse("204", "Delete Successful")
  @Delete("{userId}")
  public async deleteUserById(@Path() userId: string): Promise<void> {
    try {
      await UserService.deleteUserById(userId);
    } catch (error) {
      console.error(
        `UsersController - deleteUserById() method error: ${error}`
      );
      throw error;
    }
  }
}
