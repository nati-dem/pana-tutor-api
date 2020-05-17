import express from 'express';
import {isEmpty} from 'lodash';
import {AppError} from '../common/app-error';
const asyncHandler = require('express-async-handler');
import {CourseService} from "../service/course.service";
import {isSuccessHttpCode} from "../../../pana-tutor-lib/util/common-helper";
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import {UserSignupRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import { Inject } from 'typescript-ioc';
const router = express.Router();

export class CoursesRouter {

  @Inject
  private courseService: CourseService;

  baseRouter = router.get('/', (req, res, next) => {
    res.send( "Hello world!" );
  });

}
