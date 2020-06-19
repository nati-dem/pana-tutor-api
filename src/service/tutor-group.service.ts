import { AppConstant } from "../config/constants";
import { CourseDAO } from "../dao/course.dao";
import { TutorGroupDAO } from "../dao/tutor-group.dao";
import { Inject } from "typescript-ioc";
import { TutorGroupRequest, GroupMemberRequest } from "../../../pana-tutor-lib/model/tutor/tutor-group.interface";
import { GroupStatus, GroupMemberStatus } from "../../../pana-tutor-lib/enum/tutor.enum";
import { TutorGroupRole } from "../../../pana-tutor-lib/enum/user.enum";
import {BaseService} from './base.service';

export class TutorGroupService extends BaseService {

  @Inject
  private groupDAO: TutorGroupDAO;

  createGroup = async (req: TutorGroupRequest) => {
    req.status = GroupStatus.active;
    req.created_by = global.userId;
    const result = await this.groupDAO.createGroup(req);
    if(Array.isArray(result)){
      req.owner.tutor_group_id = result[0].id;
      req.owner.user_role = TutorGroupRole.admin;
      req.owner.course_id = req.course_id;
      await this.addOrUpdateGroupMember(req.owner);
    }
    return result;
  };

  addOrUpdateGroupMember = async (req: GroupMemberRequest) => {
    // req.status = GroupMemberStatus.active;
    // req.user_role = TutorGroupRole.SUBSCRIBER;
    let result = await this.groupDAO.findUserInGroup(req.user_id, req.tutor_group_id)
    if (result.length === 0) {
      result = await this.groupDAO.addUserInGroup(req);
    } else if(Array.isArray(result) && result.length > 0) {
      result = this.groupDAO.updateGroupMember(req, result[0].id);
    }
    return result;
  };

  getGroupMembers = async (courseId, groupStatus, tutor_group_id) => {
    return await this.groupDAO.getGroupMembers(courseId, groupStatus, tutor_group_id);
  }

  findUserGroupsInCourse = async (courseId, groupStatus) => {
    return await this.groupDAO.findUserGroupsInCourse(courseId, groupStatus, global.userId);
  }

}