import express from 'express';
import _ from 'lodash';
import {AppError} from '../common/app-error';
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import { Inject } from 'typescript-ioc';
import {TutorBookingService} from "../service/tutor-booking.service";
import {TutorBookingRequest} from "../../../pana-tutor-lib/model/tutor/tutor-booking.interface";
const asyncHandler = require('express-async-handler');
const router = express.Router();
const escape = require('escape-html');

export class TutorBookingRouter {

  @Inject
  private tutorBookingService: TutorBookingService;

  index = router.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
  });

  validateCourseBookingRequest = router.get('/validate-course/:courseId', asyncHandler( async (req, res, next) => {
    const courseId = req.params.courseId;
    const userId = global.userId;
    console.log("## validateCourseBookingRequest courseId:: ", courseId, " && userId:",userId);
    if( !courseId || _.isEmpty(courseId) ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    const resp = await this.tutorBookingService.checkUserEnrollmentEligiblity(userId,courseId);
    await this.tutorBookingService.findAvailableCourseTutors(userId,courseId)
    if(resp.success)
      res.status(200).end(JSON.stringify(resp));
    else
      throw new AppError(400, ErrorMessage.BOOKING_REQ_ERROR, ErrorCode.OPERATION_DENIED, null);
  }));
  /*
  getBookingPackages = router.get('/packages/:courseId', asyncHandler( async (req, res, next) => {
    const courseId = req.params.courseId;
    const userId = global.userId;
    console.log("## getBookingPackages router courseId:: ", courseId, " && userId:",userId);
    if( !courseId || _.isEmpty(courseId) ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    const resp = await this.tutorBookingService.findPackages(userId,courseId);
    res.status(200).end(JSON.stringify(resp));
  }));
  */

 upsertBookingRequest = router.put('/booking-request/:courseId', asyncHandler( async (req, res, next) => {
    const reqObj = req.body as TutorBookingRequest;
    const courseId = req.params.courseId;
    const userId = global.userId;
    console.log("## upsertBookingRequest req:: ", reqObj);

    if( !courseId || _.isEmpty(courseId) || !reqObj.packageId ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    reqObj.course_id = courseId;
    const resp = await this.tutorBookingService.upsertBookingRequest(userId, reqObj);
    res.status(200).end(JSON.stringify(resp));
  }));

}
