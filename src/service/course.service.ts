import {IntegratorService} from "../provider/integrator.service";
import {Inject} from "typescript-ioc";
import {UserLoginRequest, UserSignupRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import {AppConstant} from '../config/constants';

export class CourseService {

    @Inject
    private apiExecuter: IntegratorService;

    getAllCategories = async () => {
        return await this.apiExecuter.doGet({context:'edit'}, AppConstant.COURSE_CATEGORIES_URL, true);
    }

    getCoursesCategoryById = async (id: number) => {
        /// wp-json/wp/v2/courses?filter[meta_key]=course_category&filter[meta_value]=13&filter[meta_compare]=LIKE
        const categoryByIdUrl = `${AppConstant.COURSES_URL}?filter[meta_key]=course_category&filter[meta_value]=${id}&filter[meta_compare]=LIKE`
        return await this.apiExecuter.doGet({context:'edit'}, categoryByIdUrl, true);
    }

}
