/* Removed in favor of having external tooling (ie. Docker) handle environment.
import dotenv from "dotenv";
dotenv.config();
*/

/*
 * This module is for setting up the application environment, loading
 * polyfills, etc.
 *
 * We can also do some validation and provide some documentation on environment
 * variables here.
 */

// Expose npm_package_name even when not launched from npm.
export const npm_package_name: string | undefined =
  process.env.npm_package_name || require("../package.json").name;

export const {
  /* Built-in env vars */
  NODE_DEBUG, // Debug internal node modules (e.g., NODE_DEBUG=fs).

  /* "Standard" env vars */
  DEBUG, // https://github.com/visionmedia/debug (e.g., NODE=*)
  NODE_ENV, // Used by Express. NODE_ENV=(development|production)
  PORT, // TCP port or pipe this server binds to. (e.g., PORT=3000)

  /* App env vars */
  APP_NAME, // Name of application. (Override npm_package_name.)
} = process.env;
