import express from "express";
import { IndexRouter } from "../router/index.router";
import { UserRouter } from "../router/users.router";
import { CategoriesRouter } from "../router/categories.router";
import { CoursesRouter } from "../router/courses.router";
import { AuthRouter } from "../router/auth.router";
import { QuizRouter } from "../router/quiz.router";
import { rotatingAccessLogStream } from "./logger-config";
import { AppConstant } from "./constants";
import axios from "axios";
import { Inject } from "typescript-ioc";
import { isSuccessHttpCode } from "../../../pana-tutor-lib/util/common-helper";
import {
  ErrorCode,
  ErrorMessage,
} from "../../../pana-tutor-lib/enum/constants";
import { AuthService } from "../service/auth.service";
import { DS } from "../dao/data-source";
import { isEmpty } from "lodash";
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");

export class ExpressConfig {
  private _app: express.Application;
  @Inject
  private authService: AuthService;
  @Inject
  private userRouter: UserRouter;
  @Inject
  private authRouter: AuthRouter;
  @Inject
  private coursesRouter: CoursesRouter;
  @Inject
  private categoriesRouter: CategoriesRouter;
  @Inject
  private indexRouter: IndexRouter;
  @Inject
  private quizRouter: QuizRouter;

  constructor() {
    this.initApp();
  }

  public initApp() {
    this._app = express();
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: false }));
    this._app.use(compression()); // Compress all routes
    this._app.use(helmet());
    this.configureLogger();
    this.configureResponseHeaders();
    this.configureAxios();
    DS.initConPool();
    this.configureRoutes();
    this.configureErrorhandler();
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

  private configureRoutes() {
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/`,
      this.indexRouter.baseRouter
    );
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/users`,
      this.validateToken,
      this.userRouter.baseRouter
    );
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/categories`,
      this.categoriesRouter.getCategories
    );
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/courses`,
      this.validateToken,
      this.coursesRouter.baseRouter
    );
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/quiz`,
      this.quizRouter.baseRouter
    );
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/auth`,
      this.authRouter.baseRouter
    );
    // this._app.all('*', this.validateToken);
  }

  validateToken = async (req, res, next) => {
    // if ( req.path == '/') return next();
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : "";
    console.log("#token validation:", token);
    if (!isEmpty(token)) {
      const tokenResp = await this.authService.validateToken(token);
      if (!isSuccessHttpCode(tokenResp.status)) {
        res.status(401).json({
          code: ErrorCode.INVALID_AUTH,
          message: tokenResp.message,
        });
      } else {
        next();
      }
    } else {
      res.status(401).json({
        code: ErrorCode.INVALID_AUTH,
        message: ErrorMessage.UNAUTHORIZED,
      });
    }
  };

  private configureErrorhandler() {
    // catch 404 and forward to error handler
    this._app.use((req, res, next) => {
      // next(createError(404));
      res.status(404);
      res.send("Not Found!");
    });
    this._app.use((err, req, res, next) => {
      err.httpStatus = err.httpStatus || 500;
      res.status(err.httpStatus).json({
        code: err.code,
        message: err.message,
        detail: err.detail ? err.detail : "",
      });
    });
  }

  get app() {
    return this._app;
  }
}
