import { Application } from "express";
import { RouteConfig } from "./config/route-config";
// const passport = require("./config/passport");
require("./config/passport");
require("dotenv").config();

const app: Application = new RouteConfig().app;

app.listen(5000, () => {
  console.log("server runnning");
});
