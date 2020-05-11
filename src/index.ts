import http from "http";
import type { Server } from "net";

import createDebug from "debug";

import { PORT } from "./env";
import container from "./app";

const debug = createDebug(container.appName + ":server");

const server = http.createServer(container.app);

const port = parseInt(PORT || "3000", 10);
const portOrPath = isNaN(port) ? <string>PORT /* Path */ : port;

container.app.set("port", portOrPath);

(async () => {
  try {
    const addr = await listen(server, portOrPath);
    const bind =
      typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
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

function listen(server: Server, portOrPath: string | number) {
  type ServerAddress = NonNullable<ReturnType<typeof server.address>>;
  return new Promise(
    (resolve: (addr: ServerAddress) => void, reject: (err: Error) => void) => {
      server.once("error", reject);
      server.listen(portOrPath, () => {
        server.off("error", reject);
        const addr = server.address();
        if (addr === null) {
          // This should not be able to happen.
          reject(new TypeError("server.address() cannot be null"));
        } else {
          resolve(addr);
        }
      });
    }
  );
}
