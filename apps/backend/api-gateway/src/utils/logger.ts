import winston from "winston";
// import configs from "../config";
// import WinstonCloudwatch from "winston-cloudwatch";

// const cloudWatchTransport = new WinstonCloudwatch({
//   logGroupName: configs.awsCloudwatchLogsGroupName,
//   logStreamName: `api-gateway-${new Date().toISOString().split("T")[0]}`,
//   awsRegion: configs.awsCloudwatchLogsRegion,
//   awsAccessKeyId: configs.awsAccessKeyId,
//   awsSecretKey: configs.awsSecretAccessKey,
//   level: "info",
//   jsonMessage: true,
// });

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    // cloudWatchTransport,
  ],
});
