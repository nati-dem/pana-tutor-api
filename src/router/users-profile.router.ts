import express from 'express';
import _ from 'lodash';
import {AppError} from '../common/app-error';
import {UserService} from "../service/user.service";
import {uploadAvatar} from "../service/upload.service";
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import {UserSignupRequest, ChangePasswordRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import { Inject } from 'typescript-ioc';
import { isSuccessHttpCode } from '../../../pana-tutor-lib/util/common-helper';
import { TestSubject } from '../notification/test-subject';
import {mapUpdateProfileRequest, mapUserWpUserResponse} from '../common/user-mapper';
const escape = require('escape-html');
const asyncHandler = require('express-async-handler');
const router = express.Router();

export class UsersProfileRouter {

  @Inject
  private userService: UserService;
  @Inject
  private testSubject: TestSubject;

  index = router.get('/', (req, res, next) => {
    res.send( "Hello world!" );
  });

  getMyProfile = router.get('/profile/:id', asyncHandler ( async (req, res, next) => {
    const userId = req.params.id;
    console.log('getProfile API call, userId:', userId, 'global.userId::', global.userId);
    if (userId !== global.userId) {
      throw new AppError(403,ErrorMessage.FORBIDDEN,ErrorCode.FORBIDDEN_ACCESS,null);
    }
    const resp = await this.userService.findUserFromDB(userId);
    if(!resp || _.isEmpty(resp) || resp.length === 0 ) {
      throw new AppError(404, ErrorMessage.PROFILE_ERROR, ErrorCode.PROFILE_ERROR, null);
    }
    res.status(200).end(JSON.stringify(resp));
  }));

  profileUpdate = router.post('/profile', asyncHandler ( async (req, res, next) => {
    const userId = global.userId;
    const reqObj = req.body as UserSignupRequest;
    // TODO - add request payload validation
    const mappedReq = mapUpdateProfileRequest(reqObj);
    console.log("profileUpdate API call:", mappedReq);
    // only update WP if password / name changed
    await this.userService.updateUserInWP(userId,mappedReq);
    this.userService.updateUserInDB(userId,mappedReq);
    res.status(200).end(JSON.stringify(reqObj));
  }));

  avatarUpdate = router.post('/avatar', uploadAvatar.single('avatar'), (req, res, next) => {

    // @ts-ignore
    const file = req.file; // req.file is the `avatar` file, req.body will hold the text fields, if there were any
    if (!file) {
      console.log("@avatarUpdate API call - No file is available: ", file);
      throw new AppError(400, ErrorMessage.INVALID_FILE, ErrorCode.INVALID_FILE, null);
    } else {
      console.log('avatar upload success:', file);
      const userId = global.userId;
      this.userService.updateAvatar(userId, file.filename)
      // this.testSubject.testMethod();
      return res.send({
        // path: file.path,
        filename: file.filename,
        mimetype: file.mimetype,
        success: true
      })
    }
  })

  changePassword = router.post('/change-password', asyncHandler ( async (req, res, next) => {
    const userId = global.userId;
    const reqObj = req.body as ChangePasswordRequest;
    console.log("ChangePasswordRequest API call:", reqObj.email);
    if (_.isEmpty(reqObj.email) || _.isEmpty(reqObj.password) || _.isEmpty(reqObj.new_password)
          || (reqObj.password.trim() === reqObj.new_password.trim()) ) {
      throw new AppError(400,ErrorMessage.INVALID_PARAM,ErrorCode.INVALID_PARAM,null);
    }
    const resp = await this.userService.changePassword(userId, reqObj);
    if(!isSuccessHttpCode(resp.status)) {
      throw new AppError(resp.status, resp.message, ErrorCode.PASSWORD_CHANGE_ERROR, JSON.stringify(resp.data));
    }
    const mapped = mapUserWpUserResponse(resp);
    res.status(200).end(JSON.stringify(mapped));
  }));

  userAuthInfo = router.get('/auth-info', asyncHandler ( async (req, res, next) => {
    const userId = global.userId;
    console.log('userAuthInfo API call, userId:', userId);
    const resp = await this.userService.getUserAutherizedResources(userId);
    if(!resp || _.isEmpty(resp) ) {
      throw new AppError(404, ErrorMessage.GET_AUTH_INFO_ERROR, ErrorCode.GET_AUTH_INFO_ERROR, null);
    }
    res.status(200).end(JSON.stringify(resp));
  }));

}
