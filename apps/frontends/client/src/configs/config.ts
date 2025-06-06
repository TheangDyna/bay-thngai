interface Config {
  nodeEnv: string;
  apiUrl: string;
  vapidPublicKey: string;
}

const envMapping: Record<keyof Config, string> = {
  nodeEnv: "VITE_NODE_ENV",
  apiUrl: "VITE_API_URL",
  vapidPublicKey: "VITE_VAPID_PUBLIC_KEY"
};

const ensureEnv = (envMapping: Record<keyof Config, string>): Config => {
  const config = {} as Config;

  for (const [key, envVar] of Object.entries(envMapping)) {
    const value = import.meta.env[envVar];
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
