import {BaseDAO} from './base.dao';
import { CourseJoinRequest } from './../../../pana-tutor-lib/model/course/course-join.interface';

export class CourseDAO extends BaseDAO {

    getEnrollementById = async (id) => {
      const query = `SELECT * FROM course_enrollment WHERE id = ? `;
      const params = [id];
      const caller = 'getEnrollementById';
      return this.find(caller, query, params);
    }

    getEnrollement = async (courseId, userId) => {
      const query = `SELECT * FROM course_enrollment WHERE course_id = ? AND user_id = ?`;
      const params = [courseId, userId];
      const caller = 'getEnrollement';
      return this.find(caller, query, params);
  }

  join = async (req: CourseJoinRequest) => {
    const query = `INSERT INTO course_enrollment (course_id, user_id, status) VALUES (?, ?, ?) `;
    const params = [req.course_id, req.user_id, req.status];
    const caller = 'courseJoin';
    return this.insert(caller, query, params);
  }

}
