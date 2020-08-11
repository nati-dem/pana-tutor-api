import { BaseDAO } from "./base.dao";
import { TutorBookingRequest, TutorBookingRequestStatus } from "../../../pana-tutor-lib/model/tutor/tutor-booking.interface";
import { v4 as uuidv4 } from 'uuid';

export class TutorBookingDAO extends BaseDAO {

  findActiveBookingRequests = async (userId, courseId) => {
    const query = `SELECT * FROM tutor_booking_cart t
      where t.student_id = ? AND t.course_id = ? AND t.status != ? `;
    const params = [userId, courseId, TutorBookingRequestStatus.failed];
    const caller = "findBookingRequest";
    return this.find(caller, query, params);
  };

  findBookingRequestInProgress = async (userId, courseId, status) => {
    const query = `SELECT * FROM tutor_booking_cart t
      where t.student_id = ? AND t.course_id = ? AND t.status = ? `;
    const params = [userId, courseId, status];
    const caller = "findBookingRequestInProgress";
    return this.find(caller, query, params);
  };

  findBookingRequestById = async (id) => {
    const query = `SELECT * FROM tutor_booking_cart t where t.id = ? `;
    const params = [id];
    const caller = "findBookingRequestById";
    return this.find(caller, query, params);
  };

  addBookingRequest = async (userId, req: TutorBookingRequest) => {
    const query = `INSERT INTO tutor_booking_cart (student_id, package_id, course_id, status, orderId)
      VALUES (?, ?, ?, ?, ?) `;
    const params = [userId, req.packageId, req.course_id, req.status, uuidv4() ];
    const caller = "addBookingRequest";
    return this.insert(caller, query, params);
  };

  updateBookingRequest = async (req: TutorBookingRequest, id) => {
    const query = `UPDATE tutor_booking_cart SET package_id=?, course_id=?, status=? WHERE id = ? `;
    const params = [req.packageId, req.course_id, req.status, id ];
    const caller = "updateBookingRequest";
    return this.update(caller, query, params, id);
  };

  findBookingRequestByOrderId = async (orderId) => {
    const query = `SELECT * FROM tutor_booking_cart where orderId = ?`;
    const params = [orderId];
    const caller = "findBookingRequestByOrderId";
    return this.find(caller, query, params);
  };

  findBookingRequestByStatus = async (orderId, status) => {
    const query = `SELECT * FROM tutor_booking_cart where orderId = ? AND status =? `;
    const params = [orderId, status];
    const caller = "findBookingRequestByStatus";
    return this.find(caller, query, params);
  };

  activateBookingRequest = async (userId, orderId, payAmount, tutorGroupId) => {
    const query = `UPDATE tutor_booking_cart SET status=?, pay_amount=? , tutor_group_id=? WHERE student_id = ? AND orderId = ? `;
    const params = [TutorBookingRequestStatus.active, payAmount, tutorGroupId, userId, orderId ];
    const caller = "activateBookingRequest";
    return this.update(caller, query, params, orderId);
  };

  findCourseTutors = async (courseId) => {
    const query = `SELECT * FROM instructor_course c where c.course_id = ? AND status =? `;
    const params = [courseId, 'active'];
    const caller = "findCourseTutors";
    return this.find(caller, query, params);
  };

  findActiveCourseTutorGroups = async (courseId, status, userIds) => {
    const query = `SELECT t.course_id, t.status, g.user_id, g.user_role, g.join_date FROM tutor_group t
      INNER JOIN tutor_group_members g ON t.id= g.tutor_group_id
      where t.course_id = ? AND t.status = ? AND g.user_role =? AND g.user_id IN (?) `;
    const params = [courseId, status, 'instructor', userIds];
    const caller = "findActiveCourseTutorGroups";
    return this.find(caller, query, params);
  };

}
