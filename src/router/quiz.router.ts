import express from 'express';
import _ from 'lodash';
import {AppError} from './../common/app-error';
import {QuizService} from "../service/quiz.service";
import {isSuccessHttpCode} from "./../../../pana-tutor-lib/util/common-helper";
import {ErrorCode, ErrorMessage} from "./../../../pana-tutor-lib/enum/constants";
import {CourseCategory, Course} from "./../../../pana-tutor-lib/model/course";
import { Inject } from 'typescript-ioc';
const asyncHandler = require('express-async-handler');
const router = express.Router();

export class QuizRouter {

  @Inject
  private quizService: QuizService

  baseRouter = router.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
  } );

  start = router.post('/start', asyncHandler( async (req, res, next) => {
    // save in quiz_init db
    res.status(200).end(JSON.stringify({}));
  }));

  submitAnswer = router.post('/submit-answer', asyncHandler( async (req, res, next) => {
    // save in quiz_ans_entry db
    res.status(200).end(JSON.stringify({}));
  }));

  submitQuiz = router.post('/submit-quiz', asyncHandler( async (req, res, next) => {
    // save in quiz_submission db
    res.status(200).end(JSON.stringify({}));
  }));

}
