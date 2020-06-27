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
import { QuizSubmission } from "./../../../pana-tutor-lib/model/course/quiz-submission.interface";
import { Inject } from "typescript-ioc";
import { QuizInit } from "../../../pana-tutor-lib/model/course/quiz-init.interface";
import { QuizAnsEntry } from "../../../pana-tutor-lib/model/course/quiz-ans-entry.interface";
const asyncHandler = require("express-async-handler");
const router = express.Router();

export class QuizRouter {
  @Inject
  private quizService: QuizService;
  @Inject
  private courseService: CourseService;

  index = router.get("/", (req, res) => {
    res.send("Hello world!");
  });

  start = router.post(
    "/start",
    asyncHandler(async (req, res, next) => {
      // TODO - add quiz retry logic after first submit
      const reqObj = req.body as QuizInit;
      if (
        !_.isNumber(reqObj.quiz_id) ||
        (!_.isEmpty(reqObj.enrollment_id) && !_.isNumber(reqObj.enrollment_id))
      ) {
        throw new AppError(
          400,
          ErrorMessage.INVALID_PARAM,
          ErrorCode.INVALID_PARAM,
          null
        );
      }

      const quizResp = await this.courseService.getQuizById(reqObj.quiz_id);
      if (!isSuccessHttpCode(quizResp.status)) {
        throw new AppError(
          quizResp.status,
          quizResp.message,
          ErrorCode.QUIZ_GET_ERROR,
          JSON.stringify(quizResp.data)
        );
      }
      const resp = await this.quizService.startQuiz(reqObj);
      res.status(200).end(JSON.stringify(resp));
    })
  );

  submitAnswer = router.post(
    "/submit-answer",
    asyncHandler(async (req, res, next) => {
      const reqObj = req.body as QuizAnsEntry;
      console.log("submit-answer api req::", reqObj);
      if (
        !_.isNumber(reqObj.quiz_init_id) ||
        !_.isNumber(reqObj.que_id) ||
        _.isEmpty(reqObj.answer)
      ) {
        throw new AppError(
          400,
          ErrorMessage.INVALID_PARAM,
          ErrorCode.INVALID_PARAM,
          null
        );
      }
      const queResp = await this.getQuestionDetails(reqObj);
      const resp = await this.quizService.submitAnswer(reqObj, queResp);

      res.status(200).end(JSON.stringify(resp));
    })
  );

  getQuestionDetails = async (reqObj) => {
    const queResp = await this.courseService.getQuestionById(reqObj.que_id);
    console.log("@submitAnswer queApiResp::", queResp);
    if (!isSuccessHttpCode(queResp.status)) {
      throw new AppError(
        queResp.status,
        queResp.message,
        ErrorCode.QUE_GET_ERROR,
        JSON.stringify(queResp.data)
      );
    }
    return queResp;
  };

  submitQuiz = router.post(
    "/submit-quiz",
    asyncHandler(async (req, res, next) => {
      // save in quiz_submission db
      const reqObj = req.body as QuizSubmission;
      if (!_.isNumber(reqObj.quiz_init_id) || !_.isNumber(reqObj.que_id)) {
        throw new AppError(
          400,
          ErrorMessage.INVALID_PARAM,
          ErrorCode.INVALID_PARAM,
          null
        );
      }
      // submit last question
      if (!_.isEmpty(reqObj.answer)) {
        const queResp = await this.getQuestionDetails(reqObj);
        await this.quizService.submitAnswer(reqObj, queResp);
      }
      // submit quiz
      const resp = await this.quizService.submitQuiz(reqObj);
      res.status(200).end(JSON.stringify(resp));
    })
  );

  getUserQuizEntries = router.get(
    "/user/:quizId",
    asyncHandler(async (req, res, next) => {
      const quizId = parseInt(req.params.quizId, 10);
      const userId = global.userId;
      console.log(
        "## getUserQuizEntries quizId:: ",
        quizId,
        " & userId:",
        userId
      );
      if (!quizId || !userId) {
        throw new AppError(
          400,
          ErrorMessage.INVALID_PARAM,
          ErrorCode.INVALID_PARAM,
          null
        );
      }
      const resp = await this.quizService.findUserQuizEntries(userId, quizId);
      res.status(200).end(JSON.stringify(resp));
    })
  );
}
