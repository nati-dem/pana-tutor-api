import { BaseDAO } from "./base.dao";
import { TutorRequest } from "../../../pana-tutor-lib/model/tutor/tutor-request.interface";

export class TutorRequestDAO extends BaseDAO {

  getTutorRequest = async (studentId, course, status) => {
    const query = `SELECT * FROM tutor_request WHERE student_id = ? AND course LIKE ? AND status = ?`;
    const params = [studentId, `%${course}%`, status];
    const caller = "getTutorRequest";
    return this.find(caller, query, params);
  };

  submitTutorRequest = async (req: TutorRequest) => {
    const query = `INSERT INTO tutor_request (student_id, tutor_ids, course, grade_level, start_date,
            duration, group_allowed, status) VALUES (?, ?, ?,?,?,?,?,?) `;
    const params = [req.student_id, req.tutor_ids, req.course, req.grade_level, req.start_date,
            req.duration, req.group_allowed, req.status ];
    const caller = "submitTutorRequest";
    return this.insert(caller, query, params);
  };

  updateTutorRequest = async (req: TutorRequest, id) => {
    const query = `UPDATE tutor_request SET tutor_ids=?, course=?, grade_level=?, start_date=?,
            duration=?, group_allowed =? , status = ? WHERE id = ? `;

    const params = [ req.tutor_ids, req.course, req.grade_level, req.start_date,
            req.duration, req.group_allowed, req.status, id ];
    const caller = "submitTutorRequest";
    return this.update(caller, query, params, id);
  };

}
