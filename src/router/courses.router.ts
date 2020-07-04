import express from "express";
import _ from "lodash";
import { AppError } from "../common/app-error";
import { CourseService } from "../service/course.service";
import { isSuccessHttpCode } from "../../../pana-tutor-lib/util/common-helper";
import { ErrorCode } from "../../../pana-tutor-lib/enum/constants";
import { Inject } from "typescript-ioc";
import {
  CourseChapter,
  Course,
  CourseLesson,
  Quiz,Question} from "../../../pana-tutor-lib/model/course/";
const asyncHandler = require("express-async-handler");
const router = express.Router();

export class CoursesRouter {

  @Inject
  private courseService: CourseService;

  index = router.get("/", (req, res, next) => {
    res.send("Hello world!");
  });

  getCourseById = router.get("/:id", asyncHandler(async (req, res, next) => {
      console.log("## getCourseById:: " + req.params.id);
      const resp = await this.courseService.getCourseById(req.params.id);
      if (!isSuccessHttpCode(resp.status)) {
        throw new AppError(resp.status,resp.message,ErrorCode.COURSE_GET_ERROR,JSON.stringify(resp.data));
      }
      const mapped = this.mapCommonFields(resp) as Course;
      res.status(200).end(JSON.stringify(mapped));
    })
  );

  getChaptersById = router.get("/:courseId/chapter/:ids",asyncHandler(async (req, res, next) => {
      const courseId = req.params.courseId;
      const chapterIds = req.params.ids.split(",");
      console.log("## getChaptersByIds:: " + req.params.ids," , courseId:",courseId);
      const repsArr: any = [];
      const len = chapterIds.length;
      // TODO - use promises for parallel calls
      for (let i = 0; i < len; i++) {
        const resp = await this.courseService.getChapterById(chapterIds[i]);
        if (!isSuccessHttpCode(resp.status)) {
          throw new AppError(resp.status,resp.message,ErrorCode.CHAPTER_GET_ERROR,JSON.stringify(resp.data));
        }
        const mapped = this.mapCommonFields(resp) as CourseChapter;
        repsArr.push(mapped);
      }

      res.status(200).end(JSON.stringify(repsArr));
    })
  );

  getLessonById = router.get("/:courseId/lesson/:id",asyncHandler(async (req, res, next) => {
      const courseId = req.params.courseId;
      console.log("## getLessonById:: " + req.params.id," , courseId:",courseId);
      const resp = await this.courseService.getLessonById(req.params.id);
      if (!isSuccessHttpCode(resp.status)) {
        throw new AppError(resp.status,resp.message,ErrorCode.LESSON_GET_ERROR,JSON.stringify(resp.data));
      }
      const mapped = this.mapCommonFields(resp) as CourseLesson;
      res.status(200).end(JSON.stringify(mapped));
    })
  );

  getQuizById = router.get("/:courseId/quiz/:id",asyncHandler(async (req, res, next) => {
      const courseId = req.params.courseId;
      console.log("## getQuizById:: " + req.params.id," , courseId:",courseId);
      const resp = await this.courseService.getQuizById(req.params.id);
      if (!isSuccessHttpCode(resp.status)) {
        throw new AppError(resp.status,resp.message,ErrorCode.QUIZ_GET_ERROR,JSON.stringify(resp.data));
      }
      const mapped = this.mapCommonFields(resp) as Quiz;
      res.status(200).end(JSON.stringify(mapped));
    })
  );

  // ?courseId=XX&quizId=XX
  findQuestionsByQuiz = router.get("/que/:queId", asyncHandler(async (req, res, next) => {
      const courseId = req.query.courseId;
      const quizId = req.query.quizId;
      console.log("## getQuestionByIds:: " + req.params.queId," , courseId:", courseId);
      const queIds = req.params.queId.split(',');
      const resp = await this.courseService.findQuestionsByQuiz(queIds, quizId);
      if (!isSuccessHttpCode(resp.status)) {
        throw new AppError(resp.status,resp.message,ErrorCode.QUIZ_QUE_FIND_ERROR,JSON.stringify(resp.data));
      }
      const mapped = this.mapQuestionFields(resp) as Question[];
      res.status(200).end(JSON.stringify(mapped));
    })
  );

  mapQuestionFields(resp){
    return _.map(resp.data, _.partialRight(_.pick, ['id', 'date', 'type', 'title', 'content',
     'status', 'featured_media', 'tags', 'acf.choice_1', 'acf.choice_2', 'acf.choice_3', 'acf.choice_4',
     'acf.que_complexity', 'acf.que_point', 'acf.quiz_ids']));
  }

  mapCommonFields(resp) {
    return _.pick(resp.data, [
      "id",
      "date",
      "type",
      "title",
      "content",
      "status",
      "featured_media",
      "acf",
      "tags",
    ]);
  }
}
