import express from 'express';
import {isEmpty} from 'lodash';
import {AppError} from '../common/app-error';
const asyncHandler = require('express-async-handler');
import {UserService} from "../service/user.service";
import {isSuccessHttpCode} from "../../../pana-tutor-lib/util/common-helper";
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import {UserSignupRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import { Inject } from 'typescript-ioc';
const router = express.Router();

export class UserRouter {

  @Inject
  private userService: UserService

  baseRouter = router.get('/', (req, res, next) => {
    res.send( "Hello world!" );
  });

  profileRouter = router.get('/profile', asyncHandler ( async (req, res, next) => {
    const userId = global.userId;
    const resp = await this.userService.getUserById(userId);
    if(!isSuccessHttpCode(resp.status)) {
      throw new AppError(resp.status, resp.message, ErrorCode.PROFILE_ERROR, JSON.stringify(resp.data));
    }
    res.status(200).end(JSON.stringify(resp.data));
  }));

  profileUpdateRouter = router.post('/profile', asyncHandler ( async (req, res, next) => {
    const userId = global.userId;
    const reqObj = req.body as UserSignupRequest;
    // TODO - add request payload validation
    const resp = await this.userService.updateUserProfile(userId, reqObj);
    if(!isSuccessHttpCode(resp.status)) {
      throw new AppError(resp.status, resp.message, ErrorCode.PROFILE_UPDATE_ERROR, JSON.stringify(resp.data));
    }
    res.status(200).end(JSON.stringify(resp.data));
  }));

}
