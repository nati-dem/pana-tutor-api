import express from 'express';
import {isEmpty} from 'lodash';
import {AppError} from '../common/app-error';
const asyncHandler = require('express-async-handler');
const jwtDecode = require('jwt-decode');
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
    const userId = this.getUserIdFromToken(req);
    const resp = await this.userService.getUserById(userId);
    if(!isSuccessHttpCode(resp.status)) {
      throw new AppError(resp.status, resp.message, ErrorCode.PROFILE_ERROR, JSON.stringify(resp.data));
    }
    res.status(200).end(JSON.stringify(resp.data));
  }));

  profileUpdateRouter = router.post('/profile', asyncHandler ( async (req, res, next) => {
    const userId = this.getUserIdFromToken(req);
    const reqObj = req.body as UserSignupRequest;
    // TODO - add request payload validation
    const resp = await this.userService.updateUserProfile(userId, reqObj);
    if(!isSuccessHttpCode(resp.status)) {
      throw new AppError(resp.status, resp.message, ErrorCode.PROFILE_UPDATE_ERROR, JSON.stringify(resp.data));
    }
    res.status(200).end(JSON.stringify(resp.data));
  }));

  getUserIdFromToken(req){
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : '';
    const decoded = jwtDecode(token);
    console.log('user id from header token: ', decoded.data.user.id);
    return decoded.data.user.id;
  }

}
