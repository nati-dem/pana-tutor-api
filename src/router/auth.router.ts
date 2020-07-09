import express from 'express';
import {UserLoginRequest, UserSignupRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import {AuthService} from "../service/auth.service";
import {UserService} from "../service/user.service";
import {isEmpty} from 'lodash';
import {AppError} from '../common/app-error';
import {HttpResponse} from "../../../pana-tutor-lib/model/api-response.interface";
import {isSuccessHttpCode} from "../../../pana-tutor-lib/util/common-helper";
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import { Inject } from 'typescript-ioc';
import _ from 'lodash';
const asyncHandler = require('express-async-handler');
const router = express.Router();

export class AuthRouter {

  @Inject
  private authService: AuthService;
  @Inject
  private userService: UserService;

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
    this.authService.saveAuthTokenInCache(response.data);
    res.status(200).end(JSON.stringify(response.data));
  }));

  registerRouter = router.post('/register', asyncHandler(async (req, res, next) => {

    // TODO - add request payload validation
    const reqObj = req.body as UserSignupRequest;
    if( isEmpty(reqObj.password) || isEmpty(reqObj.username)
      || isEmpty(reqObj.email) || isEmpty(reqObj.name) ){
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }

    const response: HttpResponse = await this.authService.signup(reqObj);
    if(!isSuccessHttpCode(response.status)) {
      throw new AppError(response.status, response.message, ErrorCode.REGISTER_ERROR, JSON.stringify(response.data));
    }
    // save in local DB
    this.userService.saveWpUserResonse(response.data);
    const mapped = this.mapUserWpUserRespomse(response.data);
    res.status(200).end(JSON.stringify(mapped));
  }));

  mapUserWpUserRespomse(resp) {
    return _.pick(resp.data, ["id", "username", "name", "first_name", "last_name", "email", "roles", "meta", "registered_date"]);
  }

  tokenValidationRouter = router.post('/token-validate', asyncHandler ( async (req, res, next) => {
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : '';
    console.log('tokenValidation API call...')
    if(!isEmpty(token)) {
      const userId = await this.authService.getUserIdFromToken(token);
      const isTokenValid = await this.authService.isTokenValid(token, userId);
      if(!isTokenValid) {
        throw new AppError(401, ErrorMessage.INVALID_AUTH_TOKEN, ErrorCode.INVALID_TOKEN, null);
      }
      res.status(200).end();
    } else {
      throw new AppError(401, ErrorMessage.UNAUTHORIZED, ErrorCode.INVALID_TOKEN, null);
    }
  }));

}
