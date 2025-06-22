module.exports = {
  apps: [
    {
      name: "core-api",
      script: "dist/server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      cwd: "/home/ec2-user/app/apps/backends/core-api",
      env: {
        NODE_ENV: process.env.NODE_ENV || "production",
        PORT: process.env.PORT || "3000",
        MONGO_URI: process.env.MONGO_URI,
        AWS_REGION: "ap-southeast-2",
        AWS_COGNITO_USER_POOL_ID: process.env.AWS_COGNITO_USER_POOL_ID,
        AWS_COGNITO_CLIENT_ID: process.env.AWS_COGNITO_CLIENT_ID,
        AWS_COGNITO_CLIENT_SECRET: process.env.AWS_COGNITO_CLIENT_SECRET,
        AWS_COGNITO_DOMAIN: process.env.AWS_COGNITO_DOMAIN,
        AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        CLIENT_URL: process.env.CLIENT_URL,
        ADMIN_URL: process.env.ADMIN_URL,
        AWS_REDIRECT_URI: process.env.AWS_REDIRECT_URI,
        AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
        ABA_MERCHANT_ID: process.env.ABA_MERCHANT_ID,
        ABA_PUBLIC_KEY: process.env.ABA_PUBLIC_KEY,
        ABA_ENDPOINT: process.env.ABA_ENDPOINT,
        BACKEND_CALLBACK_URL: process.env.BACKEND_CALLBACK_URL,
        FRONTEND_RETURN_SUCCESS_URL: process.env.FRONTEND_RETURN_SUCCESS_URL,
        FRONTEND_RETURN_CANCEL_URL: process.env.FRONTEND_RETURN_CANCEL_URL,
        VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY
      }
    }
  ]
};
