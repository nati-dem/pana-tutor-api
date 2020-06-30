import express from 'express';
import _ from 'lodash';
import {AppError} from '../common/app-error';
import {UserService} from "../service/user.service";
import {isSuccessHttpCode} from "../../../pana-tutor-lib/util/common-helper";
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import {UserSignupRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import { Inject } from 'typescript-ioc';
const asyncHandler = require('express-async-handler');
const router = express.Router();

export class UserRouter {

  @Inject
  private userService: UserService

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
    await this.userService.updateUserInWP(userId,reqObj);
    this.userService.updateUserInDB(userId,reqObj);
    res.status(200).end(JSON.stringify(reqObj));
  }));

  mapUpdateProfileRequest(reqObj) {
    return {
      ...(reqObj.name ? {name:reqObj.name} : {} ),
      ...(reqObj.nickname ? {nickname:reqObj.nickname} : {} ),
      ...(reqObj.first_name ? {first_name:reqObj.first_name} : {} ),
      ...(reqObj.password ? {password:reqObj.password} : {} ),
      ...(reqObj.meta ? {meta:reqObj.meta} : {} ),
      ...(reqObj.phone ? {phone:reqObj.phone} : {} ),
      ...(reqObj.address ? {address:reqObj.address} : {} ),
      ...(reqObj.country ? {country:reqObj.country} : {} ),
      ...(reqObj.bio ? {bio:reqObj.bio} : {} ),
      ...(reqObj.time_zone ? {time_zone:reqObj.time_zone} : {} ),
      } as UserSignupRequest;
  }

  mapUserWpUserFields(resp) {
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
