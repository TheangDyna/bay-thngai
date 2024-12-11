import { config as loadEnv } from "dotenv";

loadEnv();

interface Config {
  nodeEnv: string;
  port: string;
  mongoUri: string;
}

const envMapping: Record<keyof Config, string> = {
  nodeEnv: "NODE_ENV",
  port: "PORT",
  mongoUri: "MONGO_URI"
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
