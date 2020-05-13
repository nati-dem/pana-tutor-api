import express from 'express';
import {UserLoginRequest, UserSignupRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import {AuthService} from "../service/auth.service";
import {isEmpty} from 'lodash';
import {AppError} from '../common/app-error';
import {HttpResponse} from "../../../pana-tutor-lib/model/api-response.interface";
import {isSuccessHttpCode} from "../../../pana-tutor-lib/util/common-helper";
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import { Inject } from 'typescript-ioc';
const asyncHandler = require('express-async-handler');
const router = express.Router();

export class AuthRouter {

  @Inject
  private authService: AuthService;

  baseRouter = router.get('/', (req, res, next) => {
    res.send( "Hello world!" );
  });

  loginRouter = router.post('/login', asyncHandler(async (req, res, next) => {

    const reqObj = req.body as UserLoginRequest;
    if( isEmpty(reqObj.password) || isEmpty(reqObj.username) ){
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }

    const response: HttpResponse = await this.authService.authenticate(reqObj);
    if(!isSuccessHttpCode(response.status)) {
      throw new AppError(response.status, response.message, ErrorCode.LOGIN_ERROR, JSON.stringify(response.data));
    }

    res.status(200).end(JSON.stringify(response.data));
  }));

  registerRouter = router.post('/register', asyncHandler(async (req, res, next) => {

    // TODO - add request payload validation
    const reqObj = req.body as UserSignupRequest;
    if( isEmpty(reqObj.password) || isEmpty(reqObj.username) ){
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }

    const response: HttpResponse = await this.authService.signup(reqObj);
    if(!isSuccessHttpCode(response.status)) {
      throw new AppError(response.status, response.message, ErrorCode.REGISTER_ERROR, JSON.stringify(response.data));
    }

    res.status(200).end(JSON.stringify(response.data));
  }));

  tokenValidationRouter = router.post('/token-validate', asyncHandler ( async (req, res, next) => {
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : '';
    if(!isEmpty(token)) {
      const resp = await this.authService.validateToken(token);
      if(!isSuccessHttpCode(resp.status)) {
        throw new AppError(resp.status, resp.message, ErrorCode.INVALID_TOKEN, JSON.stringify(resp.data));
      }
      res.status(200).end(JSON.stringify(resp.data));
    } else {
      throw new AppError(401, ErrorMessage.UNAUTHORIZED, ErrorCode.INVALID_TOKEN, null);
    }
  }));

}
