import app from "./app";
import startServer from "./server";

(async () => {
  await app.start();
  startServer(app);
})();

// TODO: Something more robust
//process.on("SIGTERM", async () => await app.stop());
