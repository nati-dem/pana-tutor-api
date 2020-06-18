import express from 'express';
import _ from 'lodash';
import {AppError} from './../common/app-error';
const asyncHandler = require('express-async-handler');
import {isSuccessHttpCode} from "./../../../pana-tutor-lib/util/common-helper";
import {ErrorCode, ErrorMessage} from "./../../../pana-tutor-lib/enum/constants";
import { Inject } from 'typescript-ioc';
import {EnrollService} from "./../service/enroll.service";
import {EntityType} from "./../../../pana-tutor-lib/enum/constants";
import {AppConstant} from './../config/constants';

const router = express.Router();

export class SearchRouter {

  @Inject
  private enrollService: EnrollService;

  // entity=courses&q=
  search = router.get('/', asyncHandler( async (req, res, next) => {
    const entity = req.query.entity;
    const q = req.query.q;
    console.log("## search entity:: ", entity, ' && q:', q);

    const entityUrl = this.getEntityUrl(entity);
    if( _.isEmpty(entityUrl) || _.isEmpty(q) ){
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM_SEARCH, null);
    }
    const resp = await this.enrollService.search(entityUrl, q);
    if (!isSuccessHttpCode(resp.status)) {
      throw new AppError(
        resp.status,
        resp.message,
        ErrorCode.SEARCH_ERROR,
        JSON.stringify(resp.data)
      );
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
          mapped = _.map(resp.data, _.partialRight(_.pick, ['id', 'username', 'name', 'first_name:', 'last_name:',
          'email', 'roles', 'avatar_urls', 'meta']));
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
