import express from "express";
import loaders from "./loaders";
import config from "./config";

const { application } = config;

const startServer = () => {
  const app = express();

  loaders(app);

  app
    .listen(application.port, () => console.log(`Server running on port ${application.port}`))
    .on("error", (err) => {
      console.log(err);
      process.exit(1);
    });
};

startServer();
