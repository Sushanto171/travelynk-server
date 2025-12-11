/* eslint-disable no-console */
import { Server } from "http";
import { app } from "./app";
import config from "./app/config";
import { redisClient } from "./app/helpers/redis";
import { seedAdmin } from "./app/utils/seedAdmin";

const startServer = async () => {
  let server: Server;
  try {
    // Start the server
    server = app.listen(config.port, () => {
      console.log(`⚡ Server is running on port ${config.port}`);
    });

    await redisClient.connect();
    console.log("Redis client connect");


    // Function to gracefully shut down the server
    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log("Server closed gracefully.");
          process.exit(1); // Exit with a failure code
        });
      } else {
        process.exit(1);
      }
    };
    // seed admin
    await seedAdmin()

    // Handle termination signals
    process.on("SIGINT", exitHandler);
    process.on("SIGTERM", exitHandler);
    process.on("uncaughtException", exitHandler)

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (error) => {
      console.log(
        "Unhandled Rejection is detected, we are closing our server...", error
      );
      if (server) {
        server.close(() => {
          console.log(error);
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1);
  }
};

startServer();