import path from "path";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { inherit, keep } from "./lib/object-utils";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import { TestUserService } from "./services/user-service";

// Below is a simple application container.
// https://en.wikipedia.org/wiki/Dependency_injection
const container = {
  appFactory: express,

  routerFactory: express.Router,

  appDocRoot: path.join(__dirname, "..", "public"),

  get app() {
    const app = this.appFactory();
    this.middleware.forEach((middleware) => app.use(middleware));
    this.routes.forEach((route, path) => app.use(path, route));
    return keep(cache, "app", app);
  },

  get middleware() {
    return keep(cache, "middleware", [
      // HTTP request logger middleware for node.js
      // https://github.com/expressjs/morgan#dev
      // dev: Concise output colored by response status for development use.
      morgan("dev"),

      // This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
      // A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body).
      // https://expressjs.com/en/4x/api.html#express.json
      express.json(),

      // This is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
      // A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body).
      // https://expressjs.com/en/4x/api.html#express.urlencoded
      express.urlencoded({ extended: false }),

      // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
      // https://github.com/expressjs/cookie-parser
      cookieParser(),

      // This is a built-in middleware function in Express. It serves static files and is based on serve-static.
      // https://expressjs.com/en/4x/api.html#express.static
      express.static(this.appDocRoot),
    ]);
  },

  get routes() {
    const routes = new Map([
      ["/", indexRouter()],
      ["/users", this.usersRouter],
    ]);
    return keep(cache, "routes", routes);
  },

  get usersRouter() {
    const deps = inherit(this, { router: this.routerFactory() });
    return keep(cache, "usersRouter", usersRouter(deps));
  },

  get userService() {
    return keep(cache, "userService", new TestUserService());
  },
};

// Construct and export read-through cache of container.
const cache = inherit(container);
export default cache;
