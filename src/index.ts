import http from "http";

import createDebug from "debug";

import { PORT } from "./env";
import container from "./app";

const debug = createDebug(container.appName + ":server");

const server = http.createServer(container.app);

const port = parseInt(PORT || "3000", 10);
const portOrPath = isNaN(port) ? <string>PORT /* Path */ : port;

const listen = (resolve: () => void, reject: (err: Error) => void) => {
  server.once("error", reject);
  server.listen(portOrPath, () => {
    server.off("error", reject);
    resolve();
  });
};

container.app.set("port", portOrPath);

(async () => {
  try {
    await new Promise<void>(listen);

    const addr = server.address();
    const bind =
      typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
    debug("Listening on " + bind);
  } catch (error) {
    // handle specific listen errors with friendly messages
    const bind =
      typeof portOrPath === "string"
        ? "Pipe " + portOrPath
        : "Port " + portOrPath;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
})();
