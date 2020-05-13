import express, {Application} from 'express';
import {indexRouter} from '../router/index.router';
import {usersRouter} from '../router/users.router';
import {authRouter} from '../router/auth.router';
import {rotatingAccessLogStream} from './logger-config';
import {AppConstant} from './constants';
import {BaseIntegratorService} from "../provider/base-integrator.service";
const jwtDecode = require('jwt-decode');
import axios from "axios";
import { Inject } from 'typescript-ioc';
const morgan =  require('morgan');
import {isSuccessHttpCode} from "../../../pana-tutor-lib/util/common-helper";
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import {AppError} from '../common/app-error';
import {AuthService} from '../service/auth.service';
import { HttpResponse } from '../../../pana-tutor-lib/model/api-response.interface';

export class ExpressConfig {

    private _app: express.Application;
    @Inject
    private authService: AuthService;

    constructor() {
        this.initApp();
    }

    public initApp(){
      this._app = express();
      this._app.use(express.json());
      this._app.use(express.urlencoded({ extended: false }));
      this.configureLogger();
      this.configureResponseHeaders();
      this.configureAxios();
      this.configureRoutes();
      this.configureErrorhandler();
    }

    private configureLogger() {
      this._app.use(morgan('combined', { stream: rotatingAccessLogStream }));
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

    private configureRoutes() {
      this._app.use('/', indexRouter);
      this._app.use('/users', this.validateToken, usersRouter);
      this._app.use('/auth', authRouter);
      // this._app.all('*', this.validateToken);
    }

    validateToken = async (req, res, next) => {
      // if ( req.path == '/') return next();
      const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : '';
      // const decoded = jwtDecode(token);
      console.log('#token validation:', token);
      const tokenResp = await this.authService.validateToken(token);
      if(!isSuccessHttpCode(tokenResp.status)) {
        res.status(401)
           .json({
             code: ErrorCode.INVALID_AUTH,
             message: tokenResp.message
           });
      }
      next();
    }

    private configureErrorhandler() {
      // catch 404 and forward to error handler
      this._app.use( (req, res, next) => {
        // next(createError(404));
        res.status(404);
        res.send( "Not Found!" );
      });
      this._app.use((err, req, res, next) => {
        err.httpStatus = err.httpStatus || 500;
        res.status(err.httpStatus)
          .json({
            code: err.code,
            message: err.message,
            detail: err.detail ? err.detail : ''
          });
      });
    }

    private configureAxios(){
      axios.defaults.baseURL = AppConstant.BASE_API_URL;
      // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
      axios.defaults.headers.post['Content-Type'] = 'application/json';
    }

    get app(){
        return this._app;
    }

}
