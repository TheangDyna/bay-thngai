import routePaths from "@/src/route-defs";
import express, { Response } from "express";
import { IncomingMessage } from "http";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import corsOptions from "@/src/middlewares/cors";
import { logger } from "../utils/logger";

interface ProxyConfig {
  [context: string]: Options<IncomingMessage, Response>;
}

const proxyConfigs: ProxyConfig = {
  [routePaths.authService.path]: {
    target: routePaths.authService.target,
    pathRewrite: (path, _req) => `${routePaths.authService.path}${path}`,
    on: {
      proxyReq: (_proxyReq, req, _res) => {
        logger.info({
          message: "Proxy request initiated",
          target: routePaths.authService.target,
          method: req.method,
          url: req.url,
        });
      },
      proxyRes: (proxyRes, req, res) => {
        logger.info({
          message: "Proxy response received",
          statusCode: proxyRes.statusCode,
          method: req.method,
          url: req.url,
          target: routePaths.authService.target,
        });

        // Set CORS headers on the response
        res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Methods",
          corsOptions.methods.join(", ")
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
      },

      error: (err, req, res) => {
        logger.error({
          message: "Proxy error occurred",
          error: err.message,
          method: req.method,
          url: req.url,
          target: routePaths.productService.target,
        });

        // Handle proxy error, send a custom response to the client
        // res.writeHead(502, { "Content-Type": "text/plain" });
        // res.end("Error occurred while communicating with the service.");
        if (res instanceof express.response.constructor) {
          (res as Response).writeHead(502, {
            "Content-Type": "text/plain",
          });
          (res as Response).end(
            "Error occurred while communicating with the service."
          );
        } else {
          // Handle case where res is not a standard HTTP response
          res.end();
        }
      },
    },
  },
  [routePaths.userService.path]: {
    target: routePaths.userService.target,
    pathRewrite: (path, _req) => `${routePaths.userService.path}${path}`,
    on: {
      proxyReq: (_proxyReq, req, _res) => {
        logger.info({
          message: "Proxy request initiated",
          target: routePaths.userService.target,
          method: req.method,
          url: req.url,
        });
      },
      proxyRes: (proxyRes, req, res) => {
        logger.info({
          message: "Proxy response received",
          statusCode: proxyRes.statusCode,
          method: req.method,
          url: req.url,
          target: routePaths.userService.target,
        });

        // Set CORS headers on the response
        res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Methods",
          corsOptions.methods.join(", ")
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
      },

      error: (err, req, res) => {
        logger.error({
          message: "Proxy error occurred",
          error: err.message,
          method: req.method,
          url: req.url,
          target: routePaths.userService.target,
        });

        // Handle proxy error, send a custom response to the client
        // res.writeHead(502, { "Content-Type": "text/plain" });
        // res.end("Error occurred while communicating with the service.");
        if (res instanceof express.response.constructor) {
          (res as Response).writeHead(502, {
            "Content-Type": "text/plain",
          });
          (res as Response).end(
            "Error occurred while communicating with the service."
          );
        } else {
          // Handle case where res is not a standard HTTP response
          res.end();
        }
      },
    },
  },
  [routePaths.productService.path]: {
    target: routePaths.productService.target,
    pathRewrite: (path, _req) => `${routePaths.productService.path}${path}`,
    on: {
      proxyReq: (_proxyReq, req, _res) => {
        logger.info({
          message: "Proxy request initiated",
          target: routePaths.productService.target,
          method: req.method,
          url: req.url,
        });
      },
      proxyRes: (proxyRes, req, res) => {
        logger.info({
          message: "Proxy response received",
          statusCode: proxyRes.statusCode,
          method: req.method,
          url: req.url,
          target: routePaths.productService.target,
        });

        // Set CORS headers on the response
        res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Methods",
          corsOptions.methods.join(", ")
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
      },

      error: (err, req, res) => {
        logger.error({
          message: "Proxy error occurred",
          error: err.message,
          method: req.method,
          url: req.url,
          target: routePaths.productService.target,
        });

        // Handle proxy error, send a custom response to the client
        // res.writeHead(502, { "Content-Type": "text/plain" });
        // res.end("Error occurred while communicating with the service.");
        if (res instanceof express.response.constructor) {
          (res as Response).writeHead(502, {
            "Content-Type": "text/plain",
          });
          (res as Response).end(
            "Error occurred while communicating with the service."
          );
        } else {
          // Handle case where res is not a standard HTTP response
          res.end();
        }
      },
    },
  },
};

const applyProxy = (app: express.Application) => {
  Object.keys(proxyConfigs).forEach((context: string) => {
    // Apply the proxy middleware
    app.use(context, createProxyMiddleware(proxyConfigs[context]));
  });
};

export default applyProxy;
