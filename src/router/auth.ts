import express from 'express';
import {UserLoginRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import {AuthHandler} from "../handler/auth.handler";
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
  const loginController = new AuthHandler();
  // do validation here
  const loginObj = req.body as UserLoginRequest;
  if( isEmpty(loginObj.password) || isEmpty(loginObj.username) ){
    throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
  }

  const response: HttpResponse = await loginController.authenticate(loginObj);
  if(!isSuccessHttpCode(response.status)) {
    throw new AppError(response.status, response.message, ErrorCode.LOGIN_ERROR, JSON.stringify(response.data));
  }
  res.status(200)
     .end(JSON.stringify(response));
}));
