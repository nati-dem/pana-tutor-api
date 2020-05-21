import express from 'express';
import _ from 'lodash';
import {AppError} from '../common/app-error';
import {CourseService} from "../service/course.service";
import {isSuccessHttpCode} from "../../../pana-tutor-lib/util/common-helper";
import {ErrorCode} from "../../../pana-tutor-lib/enum/constants";
import { Inject } from 'typescript-ioc';
import {CourseChapter, Course, CourseLesson, Quiz} from "../../../pana-tutor-lib/model/course/";
const asyncHandler = require('express-async-handler');
const router = express.Router();

export class CoursesRouter {

  @Inject
  private courseService: CourseService;

  baseRouter = router.get('/', (req, res, next) => {
    res.send( "Hello world!" );
  });

  getCourseById = router.get('/:id', asyncHandler( async (req, res, next) => {
    console.log("## getCourseById:: " +req.params.id);
    const resp = await this.courseService.getCourseById(req.params.id);
    if(!isSuccessHttpCode(resp.status)) {
      throw new AppError(resp.status, resp.message, ErrorCode.COURSE_GET_ERROR, JSON.stringify(resp.data));
    }
    const mapped = this.mapCommonFields(resp) as Course;
    res.status(200).end(JSON.stringify(mapped));
  }));

  getChapterById = router.get('/:courseId/chapter/:id', asyncHandler( async (req, res, next) => {
    const courseId = req.params.courseId;
    console.log("## getChapterById:: " +req.params.id, " , courseId:", courseId);
    const resp = await this.courseService.getChapterById(req.params.id);
    if(!isSuccessHttpCode(resp.status)) {
      throw new AppError(resp.status, resp.message, ErrorCode.CHAPTER_GET_ERROR, JSON.stringify(resp.data));
    }
    const mapped = this.mapCommonFields(resp) as CourseChapter;
    res.status(200).end(JSON.stringify(mapped));
  }));

  getLessonById = router.get('/:courseId/lesson/:id', asyncHandler( async (req, res, next) => {
    const courseId = req.params.courseId;
    console.log("## getLessonById:: " +req.params.id, " , courseId:", courseId);
    const resp = await this.courseService.getLessonById(req.params.id);
    if(!isSuccessHttpCode(resp.status)) {
      throw new AppError(resp.status, resp.message, ErrorCode.LESSON_GET_ERROR, JSON.stringify(resp.data));
    }
    const mapped = this.mapCommonFields(resp) as CourseLesson;
    res.status(200).end(JSON.stringify(mapped));
  }));

  getQuizById = router.get('/:courseId/quiz/:id', asyncHandler( async (req, res, next) => {
    const courseId = req.params.courseId;
    console.log("## getQuizById:: " +req.params.id, " , courseId:", courseId);
    const resp = await this.courseService.getQuizById(req.params.id);
    if(!isSuccessHttpCode(resp.status)) {
      throw new AppError(resp.status, resp.message, ErrorCode.QUIZ_GET_ERROR, JSON.stringify(resp.data));
    }
    const mapped = this.mapCommonFields(resp) as Quiz;
    res.status(200).end(JSON.stringify(mapped));
  }));

  mapCommonFields(resp){
    return _.pick(resp.data, ['id', 'date', 'type', 'title', 'content', 'status', 'featured_media', 'acf', 'tags']);
  }

}
