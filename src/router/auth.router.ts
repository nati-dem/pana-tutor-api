import express from 'express';
import {UserLoginRequest, UserSignupRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import {AuthService} from "../service/auth.service";
import {isEmpty} from 'lodash';
import {AppError} from '../common/app-error';
import {HttpResponse} from "../../../pana-tutor-lib/model/api-response.interface";
import {isSuccessHttpCode} from "../../../pana-tutor-lib/util/common-helper";
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
const asyncHandler = require('express-async-handler')

const router = express.Router();

export const authRouter = router.get('/', (req, res, next) => {
  res.status(200);
  res.end(JSON.stringify({ a: 1 }));
});

export const loginRouter = router.post('/login', asyncHandler(async (req, res, next) => {
  const authService = new AuthService();

  const reqObj = req.body as UserLoginRequest;
  if( isEmpty(reqObj.password) || isEmpty(reqObj.username) ){
    throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
  }

  const response: HttpResponse = await authService.authenticate(reqObj);
  if(!isSuccessHttpCode(response.status)) {
    throw new AppError(response.status, response.message, ErrorCode.LOGIN_ERROR, JSON.stringify(response.data));
  }

  res.status(200)
     .end(JSON.stringify(response.data));
}));

export const registerRouter = router.post('/register', asyncHandler(async (req, res, next) => {
  const authService = new AuthService();
  // TODO - validate here
  const reqObj = req.body as UserSignupRequest;
  if( isEmpty(reqObj.password) || isEmpty(reqObj.username) ){
    throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
  }

  const response: HttpResponse = await authService.signup(reqObj);
  if(!isSuccessHttpCode(response.status)) {
    throw new AppError(response.status, response.message, ErrorCode.REGISTER_ERROR, JSON.stringify(response.data));
  }

  res.status(200)
     .end(JSON.stringify(response.data));
}));
