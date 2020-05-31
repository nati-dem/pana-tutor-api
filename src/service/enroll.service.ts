import {AppConstant} from './../config/constants';
import {CourseDAO} from './../dao/course.dao';
import { Inject } from 'typescript-ioc';
import { CourseJoinRequest } from './../../../pana-tutor-lib/model/course/course-join.interface';
import {STATUS} from "./../../../pana-tutor-lib/enum/course.enum";

export class EnrollService {

    @Inject
    private courseDAO: CourseDAO;

    join = async (req: CourseJoinRequest) => {
       const enrollment = await this.courseDAO.getEnrollement(req.course_id,req.user_id);
       let resp = enrollment;
        if(enrollment.length === 0 ) {
            req.status = STATUS.active;
            resp = this.courseDAO.join(req);
        }
        return resp;
    }

}
