import {
  AdminGetUserCommand,
  AdminGetUserResponse,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  ResendConfirmationCodeCommand,
  ResendConfirmationCodeCommandInput,
  SignUpCommand,
  SignUpCommandInput
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "../configs/cognito.config";
import { config } from "../configs/config";
import {
  CognitoToken,
  ConfirmSignUpInput,
  ForgotPasswordInput,
  ResendConfirmCodeUpInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput
} from "../types/auth.types";
import { UserService } from "./user.service";
import { AppError } from "../utils/appError";
import { decodeIdToken } from "../utils/decodeIdToken";
import crypto from "crypto";

export class AuthService {
  public static async signUp(data: SignUpInput): Promise<void> {
    const { email, password } = data;

    const userData = {
      "custom:role": "user",
      email
    };

    const allowedAttributes = ["email", "custom:role"];

    const attributes = Object.keys(userData)
      .filter((key) => allowedAttributes.includes(key))
      .map((key) => ({
        Name: key,
        Value: userData[key as keyof typeof userData]
      }));

    const params: SignUpCommandInput = {
      ClientId: config.awsCognitoClientId,
      Username: email,
      Password: password,
      SecretHash: this.generateSecretHash(email),
      UserAttributes: attributes
    };

    const command = new SignUpCommand(params);
    await cognitoClient.send(command);
  }

  public static async resendConfirmCode(
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

  public static async confirmSignUp(data: ConfirmSignUpInput): Promise<void> {
    const { email, code } = data;

    const params: ConfirmSignUpCommandInput = {
      ClientId: config.awsCognitoClientId,
      Username: email,
      ConfirmationCode: code,
      SecretHash: this.generateSecretHash(email)
    };

    const command = new ConfirmSignUpCommand(params);
    await cognitoClient.send(command);
    const userInfo: AdminGetUserResponse = await this.getUserByUsername(email);

    await UserService.createUser({
      email,
      cognitoId: userInfo.Username!
    });
  }

  public static async signIn(data: SignInInput): Promise<CognitoToken> {
    const { email, password } = data; // current username only email

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

    return { idToken, accessToken, refreshToken, username: userInfo.sub };
  }

  public static async refreshAccessToken(
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

  public static async forgotPassword(data: ForgotPasswordInput): Promise<void> {
    const { email } = data;

    const params = {
      ClientId: config.awsCognitoClientId,
      Username: email
    };

    try {
      const command = new ForgotPasswordCommand(params);
      await cognitoClient.send(command);
    } catch (error: any) {
      throw error;
    }
  } // not yet

  public static async resetPassword(data: ResetPasswordInput): Promise<void> {
    const { email, code, newPassword } = data;

    const params = {
      ClientId: config.awsCognitoClientId,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword
    };

    const command = new ConfirmForgotPasswordCommand(params);
    await cognitoClient.send(command);
  } // not yet

  private static generateSecretHash(username: string): string {
    const secret = config.awsCognitoClientSecret;
    return crypto
      .createHmac("SHA256", secret)
      .update(username + config.awsCognitoClientId)
      .digest("base64");
  }

  private static async getUserByUsername(
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
}
