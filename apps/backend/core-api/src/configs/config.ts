interface Config {
  nodeEnv: string;
  port: string;
  mongoUri: string;
  awsRegion: string;
  awsCognitoUserPoolId: string;
  awsCognitoDomain: string;
  awsCognitoClientId: string;
  awsCognitoClientSecret: string;
  awsRedirectUri: string;
  awsAccessKey: string;
  awsS3BucketName: string;
  awsSecretAccessKey: string;
  adminUrl: string;
  clientUrl: string;
}

const envMapping: Record<keyof Config, string> = {
  nodeEnv: "NODE_ENV",
  port: "PORT",
  mongoUri: "MONGO_URI",
  awsRegion: "AWS_REGION",
  awsCognitoUserPoolId: "AWS_COGNITO_USER_POOL_ID",
  awsCognitoDomain: "AWS_COGNITO_DOMAIN",
  awsCognitoClientId: "AWS_COGNITO_CLIENT_ID",
  awsCognitoClientSecret: "AWS_COGNITO_CLIENT_SECRET",
  awsRedirectUri: "AWS_REDIRECT_URI",
  awsS3BucketName: "AWS_S3_BUCKET_NAME",
  awsAccessKey: "AWS_ACCESS_KEY",
  awsSecretAccessKey: "AWS_SECRET_ACCESS_KEY",
  adminUrl: "ADMIN_URL",
  clientUrl: "CLIENT_URL"
};

const ensureEnv = (envMapping: Record<keyof Config, string>): Config => {
  const config = {} as Config;

  for (const [key, envVar] of Object.entries(envMapping)) {
    const value = process.env[envVar];
    if (!value) {
      throw new Error(
        `Environment variable ${envVar} is required but not set.`
      );
    }

    config[key as keyof Config] = value;
  }

  return config;
};

export const config = ensureEnv(envMapping);
