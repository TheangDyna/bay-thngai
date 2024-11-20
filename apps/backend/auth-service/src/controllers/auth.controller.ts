import configs from "@/src/config";
import {
  CreateUserRequest,
  GoogleCallbackRequest,
  RefreshTokenRequest,
  ResendVerifyCodeRequest,
  LoginRequest,
  RegisterRequest,
  VerifyUserRequest
} from "@/src/controllers/types/auth-request.type";
import AuthService from "@/src/services/auth.service";
import setCookie from "@/src/utils/cookie";
import {
  Request as ExpressRequest,
  Response as ExpressResponse
} from "express";
import { Body, Controller, Get, Post, Queries, Request, Route } from "tsoa";
import { GoogleResponse, Response } from "./types/auth-response.type";

@Route("v1/auth")
export class AuthController extends Controller {
  @Get("/health")
  async getHealth(): Promise<Response> {
    try {
      return { message: "OK" };
    } catch (error) {
      throw error;
    }
  }

  @Post("/create-user")
  async createUser(@Body() body: CreateUserRequest): Promise<Response> {
    try {
      const message = await AuthService.createUser(body);

      return { message };
    } catch (error) {
      console.error(`AuthController - createUser() method error: ${error}`);
      throw error;
    }
  }

  @Post("/register")
  async register(@Body() body: RegisterRequest): Promise<Response> {
    try {
      const message = await AuthService.createUser(body);

      return { message };
    } catch (error) {
      console.error(`AuthController - register() method error: ${error}`);
      throw error;
    }
  }

  @Post("/verify")
  async verifyUser(@Body() body: VerifyUserRequest) {
    try {
      const message = await AuthService.verifyUser(body);

      return { message };
    } catch (error) {
      console.error(`AuthController - verifyUser() method error: ${error}`);
      throw error;
    }
  }

  @Post("/resend-verify-code")
  async resendVerifyCode(
    @Body() body: ResendVerifyCodeRequest
  ): Promise<Response> {
    try {
      const message = await AuthService.resendVerifyCode(body);

      return { message };
    } catch (error) {
      console.error(
        `AuthController - resendVerifyCode() method error: ${error}`
      );
      throw error;
    }
  }

  @Post("/login")
  async login(
    @Request() request: ExpressRequest,
    @Body() body: LoginRequest
  ): Promise<Response> {
    try {
      const response = request.res as ExpressResponse;
      const token = await AuthService.login(body);

      setCookie(response, "id_token", token.idToken);
      setCookie(response, "access_token", token.accessToken);
      setCookie(response, "refresh_token", token.refreshToken, {
        maxAge: 30 * 24 * 3600 * 1000
      });
      setCookie(response, "sub", token.sub, {
        maxAge: 30 * 24 * 3600 * 1000
      });

      return { message: "Login successfully" };
    } catch (error) {
      console.error(`AuthController - login() method error: ${error}`);
      throw error;
    }
  }

  @Get("/google")
  loginWithGoogle(): GoogleResponse {
    const cognitoOAuthURL = AuthService.loginWithGoogle();

    return {
      message: "Login with Google successfully",
      data: cognitoOAuthURL
    };
  }

  @Get("/oauth/callback")
  async oauthCallback(
    @Request() request: ExpressRequest,
    @Queries() query: GoogleCallbackRequest
  ) {
    try {
      const response = request.res as ExpressResponse;
      const tokens = await AuthService.getOAuthToken(query);

      setCookie(response, "id_token", tokens.idToken);
      setCookie(response, "access_token", tokens.accessToken);
      setCookie(response, "refresh_token", tokens.refreshToken, {
        maxAge: 30 * 24 * 3600 * 1000
      });
      setCookie(response, "sub", tokens.sub, {
        maxAge: 30 * 24 * 3600 * 1000
      });

      response.redirect(configs.clientUrl);
    } catch (error) {
      console.error(`AuthController - oauthCallback() method error: ${error}`);
      throw error;
    }
  }

  @Post("/refresh-token")
  async refreshToken(
    @Request() request: ExpressRequest,
    @Body() body: RefreshTokenRequest
  ) {
    try {
      const response = request.res as ExpressResponse;
      const refreshToken = request.cookies["refresh_token"];
      const sub = request.cookies["sub"];

      const result = await AuthService.refreshToken({
        refreshToken: body.refreshToken || refreshToken,
        sub: body.sub || sub
      });

      setCookie(response, "id_token", result.idToken);
      setCookie(response, "access_token", result.accessToken);

      return { message: "Token refreshed successfully" };
    } catch (error) {
      console.error(`AuthController - refreshToken() method error: ${error}`);
      throw error;
    }
  }
}
