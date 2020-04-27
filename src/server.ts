import http from "http";
import type net from "net";
import createDebug from "debug";
import type { Express } from "express";

type Parameters = {
  app: Express;
  appName?: string;
  serverFactory?: ServerFactory;
  port?: number | string | false;
};

interface RequestListener {
  (req: any, res: any): any;
}

interface ServerFactory {
  (requestListener: RequestListener): net.Server;
}

export default ({
  app,
  appName = process.env.npm_package_name || "",
  serverFactory = http.createServer,
  port = normalizePort(process.env.PORT || "3000"),
}: Parameters) => {
  const debug = createDebug(appName + ":server");

  /*
   * Get port from environment and store in Express.
   */
  app.set("port", port);

  /*
   * Create HTTP server.
   */
  const server = serverFactory(app);

  /*
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);

  return server;

  /**
   * Event listener for HTTP server "error" event.
   */
  function onError(error: any) {
    if (error.syscall !== "listen") {
      throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
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

  /**
   * Event listener for HTTP server "listening" event.
   */
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
    debug("Listening on " + bind);
  }
};

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
