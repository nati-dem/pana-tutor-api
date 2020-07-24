import { TutorAdminDAO } from "../dao/tutor-admin.dao";
import { Inject } from "typescript-ioc";
import {TutorAssignRequest} from "../../../pana-tutor-lib/model/tutor/tutor-admin.interface";
import {BaseService} from './base.service';

export class TutorAdminService extends BaseService {

  @Inject
  private tutorAdminDAO: TutorAdminDAO;

  getAllTutorsInCourse = async (courseId, usertatus) => {
    return await this.tutorAdminDAO.getAllTutorsInCourse(courseId, usertatus);
  }

  assignCourseTutor = async (req: TutorAssignRequest) => {
    let result = await this.tutorAdminDAO.findCourseTutor(req.user_id, req.course_id)
    if (result.length === 0) {
      result = await this.tutorAdminDAO.assignCourseTutor(req);
    }
    return result;
  };

  removeCourseTutor = async (userId,courseId) => {
    return this.tutorAdminDAO.removeCourseTutor(userId,courseId);
  };

}
