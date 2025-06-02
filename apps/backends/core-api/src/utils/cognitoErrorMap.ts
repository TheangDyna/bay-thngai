export const cognitoErrorMap: Record<
  string,
  {
    message: string;
    statusCode: number;
    specificMessages?: Record<string, string>;
  }
> = {
  UserNotFoundException: { message: "User not found.", statusCode: 404 },
  UsernameExistsException: {
    message: "This email is already registered.",
    statusCode: 409
  },
  InvalidPasswordException: {
    message: "Your password does not meet the requirements.",
    statusCode: 400
  },
  CodeMismatchException: {
    message: "The verification code is incorrect.",
    statusCode: 400
  },
  ExpiredCodeException: {
    message: "The verification code has expired.",
    statusCode: 400
  },
  NotAuthorizedException: {
    message: "Invalid username or password.",
    statusCode: 401,
    specificMessages: {
      "Incorrect username or password.":
        "The username or password is incorrect.",
      "Access Token has been revoked":
        "Your session has expired or is invalid. Please log in again."
      // "User is disabled.":
      //   "The user account is disabled. Please contact support.",
      // "Password attempts exceeded.":
      //   "You have exceeded the maximum number of login attempts. Please reset your password.",
      // "Password reset required":
      //   "A password reset is required for your account."
    }
  }
};
