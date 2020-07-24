import { BaseDAO } from "./base.dao";
import { TutorAssignRequest } from "../../../pana-tutor-lib/model/tutor/tutor-admin.interface";

export class TutorAdminDAO extends BaseDAO {

  getAllTutorsInCourse = async (courseId, userStatus) => {
    const query = `SELECT ins.user_id, ins.course_id, u.name, u.email, u.user_role, u.status
      FROM instructor_course ins
      LEFT JOIN users u on u.user_id = ins.user_id
      where ins.course_id =? AND u.status = ? `;
    const params = [courseId, userStatus];
    const caller = "getAllTutorsInCourse";
    return this.find(caller, query, params);
  }

  findCourseTutor = async (userId, courseId) => {
    const query = `SELECT * FROM instructor_course ins
      where ins.user_id = ? AND ins.course_id = ? `;
    const params = [userId, courseId];
    const caller = "findCourseTutor";
    return this.find(caller, query, params);
  };

  assignCourseTutor = async (req: TutorAssignRequest) => {
    const query = `INSERT INTO instructor_course ( user_id, course_id)
      VALUES (?, ?) `;
    const params = [req.user_id, req.course_id ];
    const caller = "assignCourseTutor";
    return this.insert(caller, query, params);
  };

  removeCourseTutor = async (userId,courseId) => {
    const query = `DELETE FROM instructor_course
      WHERE user_id = ? AND course_id = ? `;
    const params = [userId,courseId];
    const caller = "removeCourseTutor";
    return this.delete(caller, query, params);
  };

}
