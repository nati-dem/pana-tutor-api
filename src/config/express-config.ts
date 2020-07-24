import express from "express";
import { rotatingAccessLogStream } from "./logger-config";
import { AppConstant } from "./constants";
import axios from "axios";
import { DS } from "../dao/data-source";
import { TransporterFactory } from "../mail-config/transporter-factory";
import { Inject } from "typescript-ioc";
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");

export class ExpressConfig {
  protected _app: express.Application;
  @Inject
  transporterFactory: TransporterFactory

  constructor() {}

  public initApp() {
    this._app = express();
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: false }));
    this._app.use(compression()); // Compress all routes
    this._app.use(helmet());
    this._app.use(cors());
    this.configureLogger();
    this.configureResponseHeaders();
    this.configureAxios();
    DS.initConPool();
    this.configureMailTransporter();
  }

  private configureLogger() {
    this._app.use(morgan("combined", { stream: rotatingAccessLogStream }));
  }

  private configureResponseHeaders() {
    this._app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.setHeader("Content-Type", "application/json");
      next();
    });
  }

  private configureAxios() {
    axios.defaults.baseURL = AppConstant.BASE_WP_URL;
    // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    axios.defaults.headers.post["Content-Type"] = "application/json";
  }

  private configureMailTransporter(){
    this.transporterFactory.initTransporter("panalearn");
  }

  get app() {
    return this._app;
  }
}
