import express from 'express';
import _ from 'lodash';
import {AppError} from './../common/app-error';
import {isSuccessHttpCode} from "./../../../pana-tutor-lib/util/common-helper";
import {ErrorCode, ErrorMessage} from "./../../../pana-tutor-lib/enum/constants";
import { Inject } from 'typescript-ioc';
import {BaseService} from "./../service/base.service";
import {EntityType} from "./../../../pana-tutor-lib/enum/constants";
import {AppConstant} from './../config/constants';
import {UserService} from "../service/user.service";
const asyncHandler = require('express-async-handler');
const router = express.Router();

export class SearchRouter {

  @Inject
  private baseService: BaseService;
  @Inject
  private userService: UserService;

  // ?q=
  searchUser = router.get('/users', asyncHandler( async (req, res, next) => {
    const q = req.query.q;
    console.log("## search user q:", q);
    if( _.isEmpty(q) || q.length < 4  ){
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM_SEARCH, null);
    }
    let resp = await this.userService.findUsersFromDB(q);

    // Temp code to search user from WP - should be removed
    if(!resp || _.isEmpty(resp) || resp.length === 0){
      const entity = 'users'
      const entityUrl = this.getEntityUrl(entity);
      const wpResp = await this.baseService.search(entityUrl, q);
      resp = this.mapFieldsFromArray(wpResp, entity);
      for(const d of wpResp.data){
        this.userService.saveWpUserResonse(d);
      }
    }

    res.status(200).end(JSON.stringify(resp));
  }));

  // entity=courses&q=
  index = router.get('/', asyncHandler( async (req, res, next) => {
    const entity = req.query.entity;
    const q = req.query.q;
    console.log("## search entity:: ", entity, ' && q:', q);

    const entityUrl = this.getEntityUrl(entity);
    if( _.isEmpty(entityUrl) || _.isEmpty(q) ){
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM_SEARCH, null);
    }
    const resp = await this.baseService.search(entityUrl, q);
    if (!isSuccessHttpCode(resp.status)) {
      throw new AppError(resp.status,resp.message,ErrorCode.SEARCH_ERROR,JSON.stringify(resp.data));
    }

    // TODO - Remove... TEMP code to save users in local DB
    if(entity === EntityType.users && resp.data.length > 0) {
      for(const d of resp.data){
        this.userService.saveWpUserResonse(d);
      }
    }

    const mapped = this.mapFieldsFromArray(resp, entity);
    res.status(200).end(JSON.stringify(mapped));
  }));

  private mapFieldsFromArray(resp, entity){
    let mapped;
    switch(entity) {
      case EntityType.courses:
          mapped = _.map(resp.data, _.partialRight(_.pick, ['id', 'date', 'type', 'title', 'content',
          'status', 'featured_media', 'tags', 'acf']));
          break;
      case EntityType.users:
          mapped = _.map(resp.data, _.partialRight(_.pick, ['id', 'username', 'name', 'first_name',
          'last_name', 'email', 'roles', 'avatar_urls', 'meta']));
          break;
      }
    return mapped;
  }

  private getEntityUrl(entity){
    let entityUrl = '';
    switch(entity) {
      case EntityType.courses:
          entityUrl = AppConstant.COURSES_URL
          break;
      case EntityType.users:
          entityUrl = AppConstant.USER_URL
          break;
      }
    return entityUrl;
  }

}
