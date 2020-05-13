import express from 'express';
import {isEmpty} from 'lodash';
import {AppError} from '../common/app-error';
const asyncHandler = require('express-async-handler')
const jwtDecode = require('jwt-decode');
import {UserService} from "../service/user.service";
import {isSuccessHttpCode} from "../../../pana-tutor-lib/util/common-helper";
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
const router = express.Router();

export class UserRouter {

  defaultRouter = router.get('/', (req, res, next) => {
      res.status(200).end(JSON.stringify({ a: 1 }));
  });

  profileRouter = router.get('/profile', asyncHandler ( async (req, res, next) => {
    const userService = new UserService();
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : '';
    const decoded = jwtDecode(token);
    console.log('user id from header token: ', decoded.data.user.id);
    const userResp = await userService.getUserById(decoded.data.user.id);
    if(!isSuccessHttpCode(userResp.status)) {
      throw new AppError(userResp.status, userResp.message, ErrorCode.PROFILE_ERROR, JSON.stringify(userResp.data));
    }
    res.status(200).end(JSON.stringify(userResp.data));
  }));

}
