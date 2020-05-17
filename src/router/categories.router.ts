import express from 'express';
import * as _ from 'lodash';
import {AppError} from '../common/app-error';
const asyncHandler = require('express-async-handler');
import {CourseService} from "../service/course.service";
import {isSuccessHttpCode} from "../../../pana-tutor-lib/util/common-helper";
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import {UserSignupRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import { Inject } from 'typescript-ioc';
const router = express.Router();

export class CategoriesRouter {

  @Inject
  private courseService: CourseService

  getCategories = router.get('/', asyncHandler( async (req, res, next) => {
    const resp = await this.courseService.getAllCategories();
    if(!isSuccessHttpCode(resp.status)) {
      throw new AppError(resp.status, resp.message, ErrorCode.CATEGORY_GET_ERROR, JSON.stringify(resp.data));
    }
    const mapped = _.map(resp.data, _.partialRight(_.pick, ['id', 'date', 'type', 'title', 'content', 'featured_media']));
    res.status(200).end(JSON.stringify(mapped));
  }));

  getCoursesByCategoryId = router.get('/courses/:id', asyncHandler( async (req, res, next) => {
    console.log("## getCoursesByCategoryId:: " +req.params.id);
    const resp = await this.courseService.getCoursesCategoryById(req.params.id);
    if(!isSuccessHttpCode(resp.status)) {
      throw new AppError(resp.status, resp.message, ErrorCode.COURSE_BY_CATEGORY_GET_ERROR, JSON.stringify(resp.data));
    }
    const mapped = _.map(resp.data, _.partialRight(_.pick, ['id', 'date', 'type', 'title', 'content', 'status', 'featured_media', 'acf', 'tags']));
    res.status(200).end(JSON.stringify(mapped));
  }));

}
