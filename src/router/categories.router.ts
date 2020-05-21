import express from 'express';
import _ from 'lodash';
import {AppError} from '../common/app-error';
import {CourseService} from "../service/course.service";
import {isSuccessHttpCode} from "../../../pana-tutor-lib/util/common-helper";
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import {CourseCategory, Course} from "../../../pana-tutor-lib/model/course/";
const asyncHandler = require('express-async-handler');
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
    const mapped =  this.mapCategoryFields(resp) as CourseCategory[];
    res.status(200).end(JSON.stringify(mapped));
  }));

  mapCategoryFields(resp){
    return _.map(resp.data, _.partialRight(_.pick, ['id', 'date', 'type', 'title', 'content', 'featured_media', 'status']))
  }

  getCoursesByCategoryId = router.get('/courses/:id', asyncHandler( async (req, res, next) => {
    console.log("## getCoursesByCategoryId:: " +req.params.id);
    const resp = await this.courseService.getCoursesCategoryById(req.params.id);
    if(!isSuccessHttpCode(resp.status)) {
      throw new AppError(resp.status, resp.message, ErrorCode.COURSE_BY_CATEGORY_GET_ERROR, JSON.stringify(resp.data));
    }
    const mapped = this.mapCourseFields(resp) as Course[];
    res.status(200).end(JSON.stringify(mapped));
  }));

  mapCourseFields(resp){
    return _.map(resp.data, _.partialRight(_.pick, ['id', 'date', 'type', 'title', 'content', 'status', 'featured_media', 'acf', 'tags']));
  }

}
