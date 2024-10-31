import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

type Config = {
  env: string;
  port: number;
  // client url
  clientUrl: string;
  // service urls
  authServiceUrl: string;
  userServiceUrl: string;
  productServiceUrl: string;
  // aws cloudwatch
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsCloudwatchLogsRegion: string;
  awsCloudwatchLogsGroupName: string;
  // aws cognito
  awsCognitoUserPoolId: string;
  awsCognitoClientId: string;
};

// Function to load and validate environment variables
function loadConfig(): Config {
  // Determine the environment and set the appropriate .env file
  const env = process.env.NODE_ENV || "development";
  const envPath = path.resolve(__dirname, `./configs/.env.${env}`);
  dotenv.config({ path: envPath });

  // Define a schema for the environment variables
  const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().required(),
    PORT: Joi.number().default(4000),
    // client url
    CLIENT_URL: Joi.string().required(),
    // service urls
    AUTH_SERVICE_URL: Joi.string().required(),
    USER_SERVICE_URL: Joi.string().required(),
    PRODUCT_SERVICE_URL: Joi.string().required(),
    // aws cloudwatch
    AWS_CLOUDWATCH_LOGS_REGION: Joi.string().required(),
    AWS_CLOUDWATCH_LOGS_GROUP_NAME: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    // aws cognito
    AWS_COGNITO_USER_POOL_ID: Joi.string().required(),
    AWS_COGNITO_CLIENT_ID: Joi.string().required()
  })
    .unknown()
    .required();

  // Validate the environment variables
  const { value: envVars, error } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    // client url
    clientUrl: envVars.CLIENT_URL,
    // service urls
    authServiceUrl: envVars.AUTH_SERVICE_URL,
    userServiceUrl: envVars.USER_SERVICE_URL,
    productServiceUrl: envVars.PRODUCT_SERVICE_URL,
    // aws cloudwatch
    awsAccessKeyId: envVars.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    awsCloudwatchLogsRegion: envVars.AWS_CLOUDWATCH_LOGS_REGION,
    awsCloudwatchLogsGroupName: envVars.AWS_CLOUDWATCH_LOGS_GROUP_NAME,
    // aws cognito
    awsCognitoUserPoolId: envVars.AWS_COGNITO_USER_POOL_ID,
    awsCognitoClientId: envVars.AWS_COGNITO_CLIENT_ID
  };
}

// Export the loaded configuration
const configs = loadConfig();
export default configs;
