import express from 'express';
import _ from 'lodash';
import {AppError} from './../common/app-error';
const asyncHandler = require('express-async-handler');
import {BaseService} from "./../service/base.service";
import {isSuccessHttpCode} from "./../../../pana-tutor-lib/util/common-helper";
import {ErrorCode, ErrorMessage} from "./../../../pana-tutor-lib/enum/constants";
import {MediaModel} from "./../../../pana-tutor-lib/model/media-model.interface";
import { Inject } from 'typescript-ioc';
import {EnrollService} from "./../service/enroll.service";
import {CourseJoinRequest} from "./../../../pana-tutor-lib/model/course/course-join.interface";

const router = express.Router();

export class IndexRouter {

  @Inject
  private baseService: BaseService;
  @Inject
  private enrollService: EnrollService;

  baseRouter = router.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
  } );

  getMediaById = router.get('/media/:id', asyncHandler( async (req, res, next) => {
    console.log("## getMediaById:: " +req.params.id);
    const mediaResp = await this.baseService.getThumbImage(req.params.id);
    if(!isSuccessHttpCode(mediaResp.status)) {
      throw new AppError(mediaResp.status, mediaResp.message, ErrorCode.MEDIA_GET_ERROR, JSON.stringify(mediaResp.data));
    }
    const mapped = (_.pick (mediaResp.data, ['id', 'alt_text', 'mime_type', 'media_details'])) as unknown as MediaModel;
    res.status(200).end(JSON.stringify(mapped));
  }));

  joinCourse = router.post('/join-course', asyncHandler( async (req, res, next) => {
    const reqObj = req.body as CourseJoinRequest;
    console.log("## joinCourse req:: ", reqObj);
    if( !_.isNumber(reqObj.course_id) || !_.isNumber(reqObj.user_id) ){
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    // TODO - check if both User and Course exist and are active
    // add trail and payment logics if required
    const resp = await this.enrollService.join(reqObj);
    res.status(200).end(JSON.stringify(resp));
  }));

}
