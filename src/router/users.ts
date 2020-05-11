import express = require('express');
import {UserLoginRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import {LoginHandler} from "../handler/auth.handler";
import {isEmpty} from 'lodash';
import {AppError} from '../handler/error-handler';
const asyncHandler = require('express-async-handler')

const router = express.Router();

export const usersRouter = router.get('/', (req, res, next) => {
  res.status(200);
  res.end(JSON.stringify({ a: 1 }));
});

export const loginRouter = router.post('/login', asyncHandler(async (req, res, next) => {
  const loginController = new LoginHandler();
  // do validation here
  const loginObj = req.body as UserLoginRequest;
  if( isEmpty(loginObj.password) || isEmpty(loginObj.username) ){
    throw new AppError("Invalid user parameter(s)", 400, "invalid_param");
  }
  console.log(loginObj);

  await  loginController.authenticate(loginObj);

  res.status(200);
  res.end(JSON.stringify(loginObj));
}));
