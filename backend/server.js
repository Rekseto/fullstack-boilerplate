const Koa = require("koa");
const Router = require("koa-router");
const callDir = require("call-dir");
const body = require("koa-body");
const cors = require("koa-cors");
const morgan = require("koa-morgan");
const path = require("path");
const chalk = require("chalk");
const { setupLogger } = require("./logger");

// paths

const routes = path.resolve(__dirname, "./api/routes");
const scripts = path.resolve(__dirname, "./scripts");

const models = path.resolve(__dirname, "./api/models");
const services = path.resolve(__dirname, "./api/services");

async function startServer() {
  const logger = setupLogger("test");

  // Http module configuration
  const router = new Router();
  const http = new Koa();

  http.use(
    morgan(function(tokens, req, res) {
      return [
        `[${chalk.green(tokens.method(req, res))}]`,
        tokens.url(req, res),
        tokens.status(req, res),
        `${tokens.res(req, res, "content-length")}B`,
        "-",
        chalk.yellow(tokens["response-time"](req, res)),
        chalk.yellow("ms")
      ].join(" ");
    })
  );
  http.use(body());
  http.use(cors());
  http.use(router.routes());
  http.use(router.allowedMethods());

  //

  callDir.loadAll(scripts, fpath => require(fpath)({ logger }));
  callDir.loadAll(routes, rPath => require(rPath)(router, { logger }));

  // Everything's loaded so we can start our http module
  http.listen(process.env.BACKEND_PORT);
}

startServer();
