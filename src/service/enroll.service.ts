import { AppConstant } from "./../config/constants";
import { CourseDAO } from "./../dao/course.dao";
import { TutorRequestDAO } from "../dao/tutor-request.dao";
import { Inject } from "typescript-ioc";
import { CourseJoinRequest } from "./../../../pana-tutor-lib/model/course/course-join.interface";
import { TutorRequest } from "./../../../pana-tutor-lib/model/tutor/tutor-request.interface";
import { STATUS } from "./../../../pana-tutor-lib/enum/course.enum";

import { RequestStatus } from "./../../../pana-tutor-lib/enum/tutor.enum";
import { BaseService } from "./base.service";

export class EnrollService extends BaseService {
  @Inject
  private courseDAO: CourseDAO;
  @Inject
  private tutorReqDAO: TutorRequestDAO;

  join = async (req: CourseJoinRequest) => {
    const enrollment = await this.courseDAO.getEnrollement(
      req.course_id,
      req.user_id
    );
    let resp = enrollment;
    if (enrollment.length === 0) {
      req.status = STATUS.active;
      resp = this.courseDAO.join(req);
    } else {
    }
    return resp;
  };

  requestTutor = async (req: TutorRequest) => {
    req.status = RequestStatus.pending;
    let result = await this.tutorReqDAO.getTutorRequest(
      req.student_id,
      req.course,
      req.status
    );
    if (result.length === 0) {
      result = this.tutorReqDAO.submitTutorRequest(req);
    } else if (Array.isArray(result)) {
      result = this.tutorReqDAO.updateTutorRequest(req, result[0].id);
    }

    return result;
  };
}
