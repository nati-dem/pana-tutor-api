import { TutorBookingDAO } from "../dao/tutor-booking.dao";
import { Inject } from "typescript-ioc";
import {BaseService} from './base.service';
import { TutorBookingRequest, TutorBookingRequestStatus } from "../../../pana-tutor-lib/model/tutor/tutor-booking.interface";

export class TutorBookingService extends BaseService {

  @Inject
  private tutorBookingDAO: TutorBookingDAO;

  // restrict users from enrolling in same course again
  checkUserEnrollmentEligiblity = async (userId, courseId) => {
    const result = await this.tutorBookingDAO.findActiveBookingRequests(userId,courseId);
    if (result.length > 0) {
      if(result[0].status === TutorBookingRequestStatus.active || result[0].status === TutorBookingRequestStatus.pay_pending ){
        return {
          success: false,
          existingStatus:result[0].status
        };
      }
    }
    return  {
      success: true
    }
  }

  upsertBookingRequest = async (userId, req: TutorBookingRequest) => {
    let result = await this.tutorBookingDAO.findBookingRequestInProgress(userId,req.course_id,TutorBookingRequestStatus.init)
    if(!req.status) req.status = TutorBookingRequestStatus.init;
    if (result.length <1 ) {
      result = await this.tutorBookingDAO.addBookingRequest(userId,req);
    } else if(Array.isArray(result) && result[0].id) {
      result = await this.tutorBookingDAO.updateBookingRequest(req, result[0].id);
    }
    result = await this.tutorBookingDAO.findBookingRequestById(result[0].id)
    return {
      id:result[0].id,
      orderId:result[0].orderId,
      course_id:result[0].course_id,
      student_id:result[0].student_id,
    };
  }

  activateBookingRequest = async (userId, orderId, totalAmount) => {
    // TODO - add user in group and insert to tutor_booking_request db table
    const tutorGroupId = null
    return await this.tutorBookingDAO.activateBookingRequest(userId, orderId, totalAmount, tutorGroupId)
  }

}
