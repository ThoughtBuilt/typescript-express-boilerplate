import { APP_NAME, npm_package_name, MONGODB_URL, MONGODB_NAME } from "./env";

import path from "path";
import express from "express";
import hbs from "hbs";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { MongoClient } from "mongodb";

import {
  inherit,
  replace as put,
  replaceSafe as putSafe,
} from "./lib/object-utils";
import { defaultRoute, errorHandler } from "./lib/express-utils";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import { UserService, DbUserService } from "./services/user-service";

const appRoot = path.resolve(__dirname, "..");
const appName = APP_NAME || npm_package_name || path.basename(appRoot);

enum ViewEngines {
  handlebars = "hbs",
}

// Below is a simple application container.
// https://en.wikipedia.org/wiki/Dependency_injection
const container = {
  appName,
  appRoot,
  appDocRoot: path.join(appRoot, "public"),
  appViewRoot: path.join(appRoot, "views"),
  appViewEngine: ViewEngines.handlebars,

  appFactory: express,
  routerFactory: express.Router,

  mongodbUrl: MONGODB_URL || "mongodb://localhost:27017/" + appName,
  mongoClientOptions: {
    appname: appName,
    useUnifiedTopology: true, // http://mongodb.github.io/node-mongodb-native/3.5/reference/unified-topology/
  },

  async start() {
    await this.mongoClient.connect();
    return this;
  },

  async stop() {
    await this.mongoClient.close();
    return this;
  },

  get app() {
    const app = put(container, "app", this.appFactory());

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
    return put(container, "hbs", hbs.create());
  },

  get middleware() {
    return put(container, "middleware", [
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
    return put(container, "routes", routes);
  },

  defaultRoute,

  errorHandler,

  get usersRouter() {
    const deps = inherit(this, { router: this.routerFactory() });
    return put(container, "usersRouter", usersRouter(deps));
  },

  get mongoClient() {
    const client = new MongoClient(this.mongodbUrl, this.mongoClientOptions);
    return put(container, "mongoClient", client);
  },

  get db() {
    return this.mongoClient.db(MONGODB_NAME);
  },

  get userService(): UserService {
    return putSafe(container, "userService", new DbUserService(this));
  },
};

export default container;
