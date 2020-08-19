import { TutorBookingDAO } from "../dao/tutor-booking.dao";
import { Inject } from "typescript-ioc";
import {BaseService} from './base.service';
import { TutorBookingRequest, TutorBookingRequestStatus, YenePayVerifyRequest } from "../../../pana-tutor-lib/model/tutor/tutor-booking.interface";
// import { TutorGroupDAO } from "../dao/tutor-group.dao";
import { GroupStatus, GroupMemberStatus } from "../../../pana-tutor-lib/enum/tutor.enum";
import { TutorGroupService } from "./tutor-group.service";
import { TutorGroupRole } from "../../../pana-tutor-lib/enum/user.enum";
import { format, I18nSettings } from 'fecha';
import { AppError } from "../common/app-error";
import { ErrorMessage, ErrorCode } from "../../../pana-tutor-lib/enum/constants";

export class TutorBookingService extends BaseService {

  @Inject
  private tutorBookingDAO: TutorBookingDAO;
  @Inject
  private tutorGroupService: TutorGroupService;

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

  isBookingRequestActivated = async ( reqObj: YenePayVerifyRequest) => {
    // const bookingResult = await this.tutorBookingDAO.findBookingRequestByStatus(reqObj.MerchantOrderId, TutorBookingRequestStatus.active)
    const bookingResult = await this.tutorBookingDAO.findBookingRequestByOrderId(reqObj.MerchantOrderId);
    let activated = false;
    console.log('@bookingResult', bookingResult)
    if (bookingResult.length > 0 ) {
      bookingResult.forEach(res => {
        if(res.status === TutorBookingRequestStatus.active && res.tutor_group_id && res.tutor_group_id != null && res.tutor_group_id !== "null"){
          activated = true;
          return;
        }
      })
    } else if(!bookingResult || bookingResult.length === 0){
      throw new AppError(422, "Booking Request not found", ErrorCode.BOOKING_PROCESSING_ERROR, null);
    }
    return activated;
  }

  findAvailableCourseTutors = async (userId, courseId) => {
    const availableCourseTutors = await this.tutorBookingDAO.findCourseTutors(courseId)
    console.log('availableCourseTutors found:', availableCourseTutors)
    const logDetail = `courseId: ${courseId} , userId: ${userId}`
    if (!availableCourseTutors || availableCourseTutors.length < 1 )
      throw new AppError(422, "Unable to find course Tutors", ErrorCode.BOOKING_PROCESSING_ERROR, logDetail);
    return availableCourseTutors;
  }

  activateBookingRequest = async (userId, reqObj: YenePayVerifyRequest) => {

    const availableCourseTutors = await this.findAvailableCourseTutors(userId, reqObj.courseId)
    const logDetail = `courseId: ${reqObj.courseId} , userId: ${userId}`
    const tutorUserId = await this.pickTutor(availableCourseTutors, reqObj.courseId)
    if(!tutorUserId)
      throw new AppError(422, "Unable to pick Tutor", ErrorCode.BOOKING_PROCESSING_ERROR, logDetail);

    // create tutor group
    const tutorGroupId = await this.createGroup(reqObj.courseId, tutorUserId)
    if(!tutorGroupId)
      throw new AppError(422, "Error creating tutor Group", ErrorCode.BOOKING_PROCESSING_ERROR, logDetail);

    const addStudentInGroupResult = this.addStudentInGroup(reqObj.courseId, tutorGroupId,userId)
    if(!addStudentInGroupResult)
      throw new AppError(422, "Error adding student in tutor Group", ErrorCode.BOOKING_PROCESSING_ERROR, logDetail);

    const activateBooking = await this.tutorBookingDAO.activateBookingRequest(userId, reqObj.MerchantOrderId, reqObj.TotalAmount, tutorGroupId)
    if(!activateBooking || activateBooking.length < 1)
      throw new AppError(422, "Error Activating Booking request", ErrorCode.BOOKING_PROCESSING_ERROR, logDetail);

    return {
      courseId: reqObj.courseId
    }

  }

  pickTutor = async (availableCourseTutors, courseId) => {
    const tutorMap = new Map()
    availableCourseTutors.forEach(tutor => {
      tutorMap.set(tutor.user_id, 0);
    });
    // filter available tutors and pick one!!
    const currentTutorGroups = await this.tutorBookingDAO
        .findActiveCourseTutorGroups(courseId, 'active', [ ...tutorMap.keys()] )

    console.log('@currentTutorGroups:', currentTutorGroups)

    if (currentTutorGroups.length > 0 ) {
      currentTutorGroups.forEach(tutorInGroup => {
          tutorMap.set(tutorInGroup.user_id, (tutorMap.get(tutorInGroup.user_id) + 1) )
      });
    }
    console.log('@tutorMap :', tutorMap)
    const sorted = new Map([...tutorMap.entries()].sort((a,b) => b[1] - a[1]))
    // pick the first for tutor
    const pickedUserId = sorted.keys().next().value
    console.log('@sorted tutorMap :', sorted, ' & pickedUserId:', pickedUserId)
    return pickedUserId;
  }

  createGroup = async (courseId, tutorUserId) => {
    const tutorGroupRequest = {
      course_id: courseId,
      start_date: format(new Date(), 'YYYY-MM-DD hh:mm:ss.SSS'),
      owner: {
        course_id: courseId,
        user_id: tutorUserId,
        user_role: TutorGroupRole.instructor,
        status: GroupMemberStatus.active
      }
    }
    const tutorGroupResult = await this.tutorGroupService.createGroup(tutorGroupRequest, tutorUserId);
    console.log('@@tutorGroupResult :', tutorGroupResult)
    return tutorGroupResult[0].id
  }

  addStudentInGroup = async (courseId, tutorGroupId, userId) => {
    const groupMemberRequest = {
      course_id: courseId,
      tutor_group_id: tutorGroupId,
      user_id: userId,
      user_role: TutorGroupRole.subscriber,
      status: GroupMemberStatus.active
    }
    const addStudentInGroupresult = await this.tutorGroupService.addOrUpdateGroupMember(groupMemberRequest);
    console.log('@addStudentInGroupresult :', addStudentInGroupresult)
    return addStudentInGroupresult;
  }

}
