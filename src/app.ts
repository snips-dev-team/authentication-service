import express from "express";
import config from "./config";
import loaders from "./loaders";

const startServer = (port: string) => {
  const app = express();

  loaders(app);

  app
    .listen(port, () => console.log(`Server running on port ${port}`))
    .on("error", (err) => {
      console.log(err);
      process.exit(1);
    });
};

startServer(config.port || "8000");
