import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { config } from "./config";

export const cognitoClient = new CognitoIdentityProviderClient({
  region: config.awsRegion,
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey
  }
});
