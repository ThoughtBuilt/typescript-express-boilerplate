import path from "path";
import express from "express";
import hbs from "hbs";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { inherit, replace } from "./lib/object-utils";
import { defaultRoute, errorHandler } from "./lib/express-utils";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import { TestUserService } from "./services/user-service";

enum ViewEngines {
  handlebars = "hbs",
}

// Below is a simple application container.
// https://en.wikipedia.org/wiki/Dependency_injection
const container = {
  appFactory: express,

  appDocRoot: path.join(__dirname, "..", "public"),

  appViewRoot: path.join(__dirname, "..", "views"),
  appViewEngine: ViewEngines.handlebars,

  routerFactory: express.Router,

  get app() {
    const app = replace(cache, "app", this.appFactory());

    // Setup View engine
    app.engine(this.appViewEngine, this[this.appViewEngine].__express);
    app.set("views", this.appViewRoot);
    app.set("view engine", this.appViewEngine);

    // Install middleware
    this.middleware.forEach((middleware) => app.use(middleware));

    // Install routes
    this.routes.forEach((route, path) => app.use(path, route));
    app.use(this.defaultRoute);

    // Install error handler
    app.use(this.errorHandler);

    return app;
  },

  get hbs() {
    return replace(cache, "hbs", hbs.create());
  },

  get middleware() {
    return replace(cache, "middleware", [
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
    return replace(cache, "routes", routes);
  },

  defaultRoute,

  errorHandler,

  get usersRouter() {
    const deps = inherit(this, { router: this.routerFactory() });
    return replace(cache, "usersRouter", usersRouter(deps));
  },

  get userService() {
    return replace(cache, "userService", new TestUserService());
  },
};

// Construct and export read-through cache of container.
const cache = inherit(container);
export default cache;
