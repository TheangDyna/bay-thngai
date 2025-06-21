module.exports = {
  apps: [
    {
      name: "core-api",
      script: "dist/server.js",
      cwd: "/home/ec2-user/app/apps/backends/core-api",
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        MONGO_URI: process.env.MONGO_URI,
        AWS_REGION: process.env.AWS_REGION,
        AWS_COGNITO_USER_POOL_ID: process.env.AWS_COGNITO_USER_POOL_ID,
        AWS_COGNITO_DOMAIN: process.env.AWS_COGNITO_DOMAIN,
        AWS_COGNITO_CLIENT_ID: process.env.AWS_COGNITO_CLIENT_ID,
        AWS_COGNITO_CLIENT_SECRET: process.env.AWS_COGNITO_CLIENT_SECRET,
        AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        CLIENT_URL: process.env.CLIENT_URL,
        ADMIN_URL: process.env.ADMIN_URL,
        MQTT_HOST: process.env.MQTT_HOST,
        MQTT_PORT: process.env.MQTT_PORT,
        MQTT_USERNAME: process.env.MQTT_USERNAME,
        MQTT_PASSWORD: process.env.MQTT_PASSWORD
      },
      watch: false,
      instances: 1,
      autorestart: true
    }
  ]
};
