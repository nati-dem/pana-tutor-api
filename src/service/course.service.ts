import {AppConstant} from '../config/constants';
import {BaseService} from './base.service';

export class CourseService extends BaseService {

    getAllCategories = async () => {
        return await this.apiExecuter.doGet({context:'edit'}, AppConstant.COURSE_CATEGORIES_URL, true);
    }

    getCoursesCategoryById = async (id: number) => {
        /// wp-json/wp/v2/courses?filter[meta_key]=course_category&filter[meta_value]=13&filter[meta_compare]=LIKE
        const categoryByIdUrl = `${AppConstant.COURSES_URL}?filter[meta_key]=course_category&filter[meta_value]=${id}&filter[meta_compare]=LIKE`
        return await this.apiExecuter.doGet({context:'edit'}, categoryByIdUrl, true);
    }

    getCourseById = async (id: number) => {
        const url = `${AppConstant.COURSES_URL}/${id}`
        return await this.apiExecuter.doGet({context:'edit'}, url, true);
    }

    getChapterById = async (id: number) => {
        const url = `${AppConstant.COURSE_CHAPTERS_URL}/${id}`
        return await this.apiExecuter.doGet({context:'edit'}, url, true);
    }

    getLessonById = async (id: number) => {
        const url = `${AppConstant.COURSE_LESSONS_URL}/${id}`
        return await this.apiExecuter.doGet({context:'edit'}, url, true);
    }

    getQuizById = async (id: number) => {
        const url = `${AppConstant.QUIZZES_URL}/${id}`
        return await this.apiExecuter.doGet({context:'edit'}, url, true);
    }

}
