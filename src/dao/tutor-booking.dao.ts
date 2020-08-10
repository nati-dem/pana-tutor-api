import { BaseDAO } from "./base.dao";
import { TutorBookingRequest, TutorBookingRequestStatus } from "../../../pana-tutor-lib/model/tutor/tutor-booking.interface";
import { v4 as uuidv4 } from 'uuid';

export class TutorBookingDAO extends BaseDAO {

  findActiveBookingRequests = async (userId, courseId) => {
    const query = `SELECT * FROM tutor_booking_request t
      where t.student_id = ? AND t.course_id = ? AND t.status != ? `;
    const params = [userId, courseId, TutorBookingRequestStatus.failed];
    const caller = "findBookingRequest";
    return this.find(caller, query, params);
  };

  findBookingRequestInProgress = async (userId, courseId, status) => {
    const query = `SELECT * FROM tutor_booking_request t
      where t.student_id = ? AND t.course_id = ? AND t.status = ? `;
    const params = [userId, courseId, status];
    const caller = "findBookingRequestInProgress";
    return this.find(caller, query, params);
  };

  findBookingRequestById = async (id) => {
    const query = `SELECT * FROM tutor_booking_request t where t.id = ? `;
    const params = [id];
    const caller = "findBookingRequestById";
    return this.find(caller, query, params);
  };

  addBookingRequest = async (userId, req: TutorBookingRequest) => {
    const query = `INSERT INTO tutor_booking_request (student_id, package_id, course_id, status, orderId)
      VALUES (?, ?, ?, ?, ?) `;
    const params = [userId, req.packageId, req.course_id, req.status, uuidv4() ];
    const caller = "addBookingRequest";
    return this.insert(caller, query, params);
  };

  updateBookingRequest = async (req: TutorBookingRequest, id) => {
    const query = `UPDATE tutor_booking_request SET package_id=?, course_id=?, status=? WHERE id = ? `;
    const params = [req.packageId, req.course_id, req.status, id ];
    const caller = "updateBookingRequest";
    return this.update(caller, query, params, id);
  };

  activateBookingRequest = async (userId, orderId, payAmount, tutorGroupId) => {
    const query = `UPDATE tutor_booking_request SET status=?, pay_amount=? WHERE student_id = ? AND orderId = ? `;
    const params = [TutorBookingRequestStatus.active, payAmount, userId, orderId ];
    const caller = "activateBookingRequest";
    return this.update(caller, query, params, orderId);
  };

}
