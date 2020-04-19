import type { RequestHandler, ErrorRequestHandler } from "express";
import createError from "http-errors";

export const defaultRoute: RequestHandler = function (req, res, next) {
  // catch 404 and forward to error handler
  next(createError(404));
};

type ErrorHandler = ErrorRequestHandler;
export const errorHandler: ErrorHandler = function (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
};
