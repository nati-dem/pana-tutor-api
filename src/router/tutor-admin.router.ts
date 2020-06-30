import express from 'express';
import _ from 'lodash';
import {AppError} from '../common/app-error';
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import { Inject } from 'typescript-ioc';
import {TutorAdminService} from "../service/tutor-admin.service";
import {TutorCreateRequest} from "../../../pana-tutor-lib/model/tutor/tutor-admin.interface";
const asyncHandler = require('express-async-handler');
const router = express.Router();

export class TutorAdminRouter {

  @Inject
  private tutorAdminService: TutorAdminService;

  // /tutor-admin/...
  index = router.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
  });

  getAllTutorsInCourse = router.get('/course/:courseId', asyncHandler( async (req, res, next) => {
    const userStatus = req.query.userStatus;
    const courseId = parseInt(req.params.courseId, 10);
    console.log("## getAllTutorsInCourse courseId:: ", courseId , ' &userStatus::', userStatus);
    if( _.isEmpty(userStatus) || !courseId || !_.isNumber(courseId) ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    const resp = await this.tutorAdminService.getAllTutorsInCourse(courseId,userStatus);
    res.status(200).end(JSON.stringify(resp));
  }));

  assignCourseTutor = router.post('/course/tutor/assign', asyncHandler( async (req, res, next) => {
    const reqObj = req.body as TutorCreateRequest;
    console.log("## assignCourseTutor req:: ", reqObj);
    if( !_.isNumber(reqObj.user_id) || !_.isNumber(reqObj.course_id) ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    // TODO - only admin should assign tutor
    const resp = await this.tutorAdminService.assignCourseTutor(reqObj);
    res.status(200).end(JSON.stringify(resp));
  }));

  deleteCourseTutor = router.delete('/course/:courseId/tutor/:userId', asyncHandler( async (req, res, next) => {
    const userId = parseInt(req.params.userId, 10);
    const courseId = parseInt(req.params.courseId, 10);
    console.log("## deleteCourseTutor userId:: ", userId, " && courseId:", courseId);
    if( !userId || !courseId ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    // TODO - only admin should delete tutor
    const resp = await this.tutorAdminService.removeCourseTutor(userId, courseId);
    res.status(200).end(JSON.stringify(resp));
  }));

}
