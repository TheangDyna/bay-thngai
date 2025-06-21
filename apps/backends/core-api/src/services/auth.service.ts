import {
  AdminGetUserCommand,
  AdminGetUserResponse,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  GetUserCommand,
  GetUserCommandInput,
  GlobalSignOutCommand,
  GlobalSignOutCommandInput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  ResendConfirmationCodeCommand,
  ResendConfirmationCodeCommandInput,
  SignUpCommand,
  SignUpCommandInput
} from "@aws-sdk/client-cognito-identity-provider";
import axios from "axios";
import crypto from "crypto";
import { cognitoClient } from "../configs/cognito.config";
import { config } from "../configs/config";
import {
  CognitoToken,
  ConfirmRegisterInput,
  LoginInput,
  RegisterInput,
  ResendConfirmCodeUpInput
} from "../types/auth.types";
import { AppError } from "../utils/appError";
import { decodeIdToken } from "../utils/decodeIdToken";
import { CreateUserSchema } from "../validators/user.validators";
import { UserService } from "./user.service";

export class AuthService {
  private userService = new UserService();

  private generateSecretHash(username: string): string {
    const secret = config.awsCognitoClientSecret;
    return crypto
      .createHmac("SHA256", secret)
      .update(username + config.awsCognitoClientId)
      .digest("base64");
  }

  private async getUserByUsername(
    username: string
  ): Promise<AdminGetUserResponse> {
    const params = {
      Username: username,
      UserPoolId: config.awsCognitoUserPoolId
    };

    const command = new AdminGetUserCommand(params);
    const userInfo = await cognitoClient.send(command);
    return userInfo;
  }

  public async register(data: RegisterInput): Promise<void> {
    const { email, password } = data;

    const params: SignUpCommandInput = {
      ClientId: config.awsCognitoClientId,
      Username: email,
      Password: password,
      SecretHash: this.generateSecretHash(email)
    };

    const command = new SignUpCommand(params);
    await cognitoClient.send(command);
  }

  public async resendConfirmCode(
    data: ResendConfirmCodeUpInput
  ): Promise<void> {
    const { email } = data;

    const params: ResendConfirmationCodeCommandInput = {
      ClientId: config.awsCognitoClientId,
      Username: email,
      SecretHash: this.generateSecretHash(email)
    };

    const command = new ResendConfirmationCodeCommand(params);
    await cognitoClient.send(command);
  }

  public async confirmRegister(data: ConfirmRegisterInput): Promise<void> {
    const { email, code } = data;

    const params: ConfirmSignUpCommandInput = {
      ClientId: config.awsCognitoClientId,
      Username: email,
      ConfirmationCode: code,
      SecretHash: this.generateSecretHash(email)
    };

    const command = new ConfirmSignUpCommand(params);
    await cognitoClient.send(command);

    const userInfo = await this.getUserByUsername(email);
    if (!userInfo.Username) {
      throw new AppError("Authentication failed.", 401);
    }

    const userData = CreateUserSchema.parse({
      email,
      cognitoId: userInfo.Username
    });

    await this.userService.createUser(userData);
  }

  public async login(data: LoginInput): Promise<CognitoToken> {
    const { email, password } = data;

    const params: InitiateAuthCommandInput = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: config.awsCognitoClientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.generateSecretHash(email)
      }
    };

    const command = new InitiateAuthCommand(params);
    const response = await cognitoClient.send(command);

    const {
      IdToken: idToken,
      AccessToken: accessToken,
      RefreshToken: refreshToken
    } = response.AuthenticationResult || {};

    if (!idToken || !accessToken || !refreshToken) {
      throw new AppError("Authentication failed. Missing tokens.", 401);
    }

    const userInfo = decodeIdToken(idToken);
    const username = userInfo["cognito:username"];

    if (!username) {
      throw new AppError("Authentication failed.", 401);
    }

    return { idToken, accessToken, refreshToken, username };
  }

  public async googleLogin(target: string): Promise<string> {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: config.awsCognitoClientId,
      redirect_uri: config.awsRedirectUri,
      identity_provider: "Google",
      scope: "profile email openid aws.cognito.signin.user.admin",
      state: target,
      prompt: "select_account"
    });
    const cognitoOAuthURL = `${
      config.awsCognitoDomain
    }/oauth2/authorize?${params.toString()}`;

    return cognitoOAuthURL;
  }

  public async googleCallback(
    queryString: Record<string, any>
  ): Promise<CognitoToken> {
    const { code, error } = queryString;

    if (error || !code) {
      throw new AppError(error, 400);
    }

    const authorizationHeader = `Basic ${Buffer.from(
      `${config.awsCognitoClientId}:${config.awsCognitoClientSecret}`
    ).toString("base64")}`;

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      client_id: config.awsCognitoClientId,
      redirect_uri: config.awsRedirectUri
    });

    const response = await axios.post(
      `${config.awsCognitoDomain}/oauth2/token`,
      params,
      {
        headers: {
          Authorization: authorizationHeader,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const {
      id_token: idToken,
      access_token: accessToken,
      refresh_token: refreshToken
    } = response.data || {};

    if (!idToken || !accessToken || !refreshToken) {
      throw new AppError("Authentication failed. Missing tokens.", 401);
    }

    const userInfo = decodeIdToken(idToken);
    const email = userInfo.email;
    const cognitoId = userInfo.sub;
    const username = userInfo["cognito:username"];

    if (!email || !cognitoId || !username) {
      throw new AppError("Authentication failed.", 401);
    }

    await this.userService.getUserByField({ cognitoId }).catch((error) => {
      if (error instanceof AppError && error.statusCode === 404) {
        const userData = CreateUserSchema.parse({
          email,
          cognitoId
        });
        this.userService.createUser(userData);
      }
      throw error;
    });

    return {
      idToken,
      accessToken,
      refreshToken,
      username
    };
  }

  public async refreshAccessToken(
    username: string,
    oldRefreshToken: string
  ): Promise<CognitoToken> {
    const params: InitiateAuthCommandInput = {
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: config.awsCognitoClientId,
      AuthParameters: {
        REFRESH_TOKEN: oldRefreshToken,
        SECRET_HASH: this.generateSecretHash(username)
      }
    };

    const command = new InitiateAuthCommand(params);
    const response = await cognitoClient.send(command);

    const {
      IdToken: idToken,
      AccessToken: accessToken,
      RefreshToken: refreshToken
    } = response!.AuthenticationResult || {};

    if (!idToken || !accessToken) {
      throw new AppError("Authentication failed. Missing tokens.", 401);
    }

    return {
      idToken,
      accessToken,
      refreshToken: refreshToken || oldRefreshToken,
      username
    };
  }

  public async logOut(accessToken: string): Promise<void> {
    const params: GlobalSignOutCommandInput = {
      AccessToken: accessToken
    };
    const command = new GlobalSignOutCommand(params);
    await cognitoClient.send(command);
  }

  public async verifyTokenWithCognito(accessToken: string): Promise<void> {
    const params: GetUserCommandInput = {
      AccessToken: accessToken
    };
    const command = new GetUserCommand(params);
    await cognitoClient.send(command);
  }
}
