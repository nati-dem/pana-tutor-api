import express from 'express';
import _ from 'lodash';
import {AppError} from '../common/app-error';
import {UserService} from "../service/user.service";
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import {UserSignupRequest, ChangePasswordRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import { Inject } from 'typescript-ioc';
import { isSuccessHttpCode } from '../../../pana-tutor-lib/util/common-helper';
const escape = require('escape-html');
const asyncHandler = require('express-async-handler');
const router = express.Router();

export class UserRouter {

  @Inject
  private userService: UserService;

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
    const mappedReq = this.mapUpdateProfileRequest(reqObj);
    console.log("profileUpdate API call:", mappedReq);
    // only update WP if password / name changed
    await this.userService.updateUserInWP(userId,mappedReq);
    this.userService.updateUserInDB(userId,mappedReq);
    res.status(200).end(JSON.stringify(reqObj));
  }));

  changePassword = router.post('/change-password', asyncHandler ( async (req, res, next) => {
    const userId = global.userId;
    const reqObj = req.body as ChangePasswordRequest;
    console.log("ChangePasswordRequest API call:", reqObj.email);
    if (_.isEmpty(reqObj.email) || _.isEmpty(reqObj.password) || _.isEmpty(reqObj.new_password) ) {
      throw new AppError(400,ErrorMessage.INVALID_PARAM,ErrorCode.INVALID_PARAM,null);
    }
    const resp = await this.userService.changePassword(userId, reqObj);
    if(!isSuccessHttpCode(resp.status)) {
      throw new AppError(resp.status, resp.message, ErrorCode.PASSWORD_CHANGE_ERROR, JSON.stringify(resp.data));
    }
    const mapped = this.mapUserWpUserRespomse(resp);
    res.status(200).end(JSON.stringify(mapped));
  }));

  mapUpdateProfileRequest(reqObj) {
    return {
      ...(reqObj.name ? {name: escape(reqObj.name) } : {} ),
      ...(reqObj.nickname ? {nickname: escape(reqObj.nickname) } : {} ),
      // ...(reqObj.first_name ? {first_name: escape(reqObj.first_name) } : {} ),
      // ...(reqObj.password ? {password:reqObj.password} : {} ),
      // ...(reqObj.meta ? {meta: reqObj.meta} : {} ),
      ...(reqObj.phone ? {phone: escape(reqObj.phone)} : {} ),
      ...(reqObj.address ? {address: escape(reqObj.address)} : {} ),
      ...(reqObj.country ? {country: escape(reqObj.country)} : {} ),
      ...(reqObj.bio ? {bio: escape(reqObj.bio)} : {} ),
      ...(reqObj.time_zone ? {time_zone: escape(reqObj.time_zone)} : {} ),
      } as UserSignupRequest;
  }

  mapUserWpUserRespomse(resp) {
    return _.pick(resp.data, ["id", "username", "name", "first_name", "last_name", "email", "roles", "meta"]);
  }

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
