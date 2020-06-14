import express from "express";
import _ from "lodash";
import { AppError } from "./../common/app-error";
import { QuizService } from "../service/quiz.service";
import { CourseService } from "../service/course.service";
import { isSuccessHttpCode } from "./../../../pana-tutor-lib/util/common-helper";
import {
  ErrorCode,
  ErrorMessage,
} from "./../../../pana-tutor-lib/enum/constants";
import {
  CourseCategory,
  Course,
  Question,
} from "./../../../pana-tutor-lib/model/course";
import { QuizSubmission } from "./../../../pana-tutor-lib/model/course/quiz-submission.interface";
import { Inject } from "typescript-ioc";
import { QuizInit } from "../../../pana-tutor-lib/model/course/quiz-init.interface";
import { QuizAnsEntry } from "../../../pana-tutor-lib/model/course/quiz-ans-entry.interface";
const asyncHandler = require("express-async-handler");
const router = express.Router();

export class QuizRouter {
  @Inject
  private quizService: QuizService;
  private courseService: CourseService;

  baseRouter = router.get("/", (req, res) => {
    res.send("Hello world!");
  });

  start = router.post(
    "/start",
    asyncHandler(async (req, res, next) => {
      // save in quiz_init db
      // we should set SET FOREIGN_KEY_CHECKS=0 in the db to add enrollment
      const reqObj = req.body as QuizInit;
      if (
        !_.isNumber(reqObj.quiz_id) ||
        !_.isNumber(reqObj.student_id || !_.isNumber(reqObj.enrollment_id))
      ) {
        throw new AppError(
          400,
          ErrorMessage.INVALID_PARAM,
          ErrorCode.INVALID_PARAM,
          null
        );
      }
      const resp = await this.quizService.startQuiz(reqObj);
      res.status(200).end(JSON.stringify(resp));
    })
  );

  submitAnswer = router.post(
    "/submit-answer",
    asyncHandler(async (req, res, next) => {
      // save in quiz_ans_entry db
      const reqObj = req.body as QuizAnsEntry;
      if (
        !_.isNumber(reqObj.quiz_id) ||
        !_.isNumber(reqObj.student_id || !_.isNumber(reqObj.que_id))
      ) {
        throw new AppError(
          400,
          ErrorMessage.INVALID_PARAM,
          ErrorCode.INVALID_PARAM,
          null
        );
      }
      const resp = await this.quizService.submitAns(reqObj);
      res.status(200).end(JSON.stringify(resp));
    })
  );

  submitQuiz = router.post(
    "/submit-quiz",
    asyncHandler(async (req, res, next) => {
      // save in quiz_submission db
      const reqObj = req.body as QuizSubmission;
      if (
        !_.isNumber(reqObj.quiz_id) ||
        !_.isNumber(reqObj.student_id || !_.isNumber(reqObj.instructor_id))
      ) {
        throw new AppError(
          400,
          ErrorMessage.INVALID_PARAM,
          ErrorCode.INVALID_PARAM,
          null
        );
      }
      const answer: any = this.quizService.submitAns(req.params.id); // QuizAnsEntry
      const correctAns: any = this.courseService.getQuestionById(req.params.id); // Question
      const i = 0;
      // for (let i = 0; i < correctAns.acf.correct_answer.length; i++) {
      if (correctAns.acf.correct_answer[i] === answer.answer) {
        reqObj.total_score += correctAns.acf.que_point;
      }
      // }
      const resp = await this.quizService.submitQuiz(reqObj);
      res.status(200).end(JSON.stringify(resp));
    })
  );
}
