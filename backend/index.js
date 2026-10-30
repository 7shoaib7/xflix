const config = require("./config/config");
const mongoose = require("mongoose");
const app = require("./app");
const logger = require("./config/logger");


let server;

// app.listen(config.backend_port, () =>
//   console.log(`App listening on port 8082!`)
// );

mongoose.connect(config.mongoose.url, config.mongoose.option).then(() => {
  logger.info("Connected to MongoDB");
  server = app.listen(config.backend_port, () =>{
    logger.info(`Listening to port ${config.backend_port}`);
  });
});
 
// ------------- Don't Modify  -------------
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
// ------------- Don't Modify  -------------