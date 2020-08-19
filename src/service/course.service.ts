import {AppConstant} from './../config/constants';
import {BaseService} from './base.service';

export class CourseService extends BaseService {

    getAllCategories = async () => {
        return await this.apiExecuter.doGet({context:'edit'}, AppConstant.COURSE_CATEGORIES_URL, true);
    }

    getCoursesCategoryById = async (id: number) => {
        /// wp-json/wp/v2/courses?filter[meta_key]=course_category&filter[meta_value]=13&filter[meta_compare]=LIKE
        const categoryByIdUrl = `${AppConstant.COURSES_URL}?filter[meta_key]=course_categories&filter[meta_value]=${id}&filter[meta_compare]=LIKE`
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

    getQuestionById = async (id: number) => {
        const url = `${AppConstant.QUIZ_QUESTIONS_URL}/${id}`
        return await this.apiExecuter.doGet({context:'edit'}, url, true);
    }

    findQuestionsByQuiz = async (id: number, quizIds) => {
        // https://panalearn.com/tutor-v1/wp-json/wp/v2/question_box?filter[meta_key]=quiz_ids&filter[meta_value]=48&filter[meta_compare]=LIKE
        const filter = `filter[meta_key]=quiz_ids&filter[meta_value]=${quizIds}&filter[meta_compare]=LIKE`;
        const url = `${AppConstant.QUIZ_QUESTIONS_URL}?${filter}`
        return await this.apiExecuter.doGet({context:'edit'}, url, true);
    }

}
