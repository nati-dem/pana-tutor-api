import express from 'express';
import _ from 'lodash';
import {AppError} from '../common/app-error';
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import { Inject } from 'typescript-ioc';
import {TutorGroupService} from "../service/tutor-group.service";
import {TutorGroupRequest, GroupMemberRequest} from "../../../pana-tutor-lib/model/tutor/tutor-group.interface";
import { GroupStatus, GroupMemberStatus } from "../../../pana-tutor-lib/enum/tutor.enum";
import { TutorGroupRole} from "../../../pana-tutor-lib/enum/user.enum";
const asyncHandler = require('express-async-handler');
const router = express.Router();

export class TutorGroupRouter {

  @Inject
  private groupService: TutorGroupService;

  index = router.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
  });

  getAllGroupsInCourse = router.get('/course/:courseId', asyncHandler( async (req, res, next) => {
    const groupStatus = req.query.groupStatus;
    const courseId = parseInt(req.params.courseId, 10);
    console.log("## getAllGroupsInCourse courseId:: ", courseId , ' &groupStatus::', groupStatus);
    if( !(groupStatus in GroupStatus) || !courseId || !_.isNumber(courseId) ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    const resp = await this.groupService.getAllGroupsInCourse(courseId,groupStatus);
    res.status(200).end(JSON.stringify(resp));
  }));

  findAllGroupsOfUser = router.get('/user/all', asyncHandler( async (req, res, next) => {
    const userId = global.userId;
    const groupStatus = req.query.groupStatus;
    const userStatus = req.query.userStatus;
    console.log("## findAllGroupsOfUser userId:: ", userId , ' &groupStatus::', groupStatus, ' &userStatus::', userStatus);
    if( !(groupStatus in GroupStatus) || !(userStatus in GroupMemberStatus) ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    const resp = await this.groupService.getAllUserGroups(userId,groupStatus,userStatus );
    res.status(200).end(JSON.stringify(resp));
  }));

  findGroupsInCourseOfUser = router.get('/user/course', asyncHandler( async (req, res, next) => {
    const courseId = parseInt(req.query.courseId, 10);
    const groupStatus = req.query.groupStatus;
    const userId = global.userId;
    console.log("## findGroupsInCourseOfUser courseId:: ", courseId , ' & groupStatus::', groupStatus, ' & userId::', userId);
    if( !_.isNumber(courseId) || !(groupStatus in GroupStatus) ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    const resp = await this.groupService.findUserGroupsInCourse(courseId,groupStatus, userId);
    res.status(200).end(JSON.stringify(resp));
  }));

  getGroupMembers = router.get('/members', asyncHandler( async (req, res, next) => {
    const courseId = parseInt(req.query.courseId, 10);
    const groupId = parseInt(req.query.group_id, 10);
    const groupStatus = req.query.groupStatus;
    console.log("## getGroupMembers courseId:: ", courseId , ' & groupStatus::', groupStatus, ' & group_id::', groupId);
    if( !_.isNumber(courseId) || !(groupStatus in GroupStatus) || !_.isNumber(groupId) ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    const resp = await this.groupService.getGroupMembers(courseId,groupStatus,groupId);
    res.status(200).end(JSON.stringify(resp));
  }));

  createGroup = router.post('/create', asyncHandler( async (req, res, next) => {
    const reqObj = req.body as TutorGroupRequest;
    console.log("## createGroup req:: ", reqObj);
    if( !_.isNumber(reqObj.course_id) || _.isEmpty(reqObj.start_date) || _.isEmpty(reqObj.owner) ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    // TODO - ? admin should be the only one creating group
    // TODO - check if course exists and is published
    const resp = await this.groupService.createGroup(reqObj);
    res.status(200).end(JSON.stringify(resp));
  }));

  upsertGroupMember = router.put('/members', asyncHandler( async (req, res, next) => {
    const reqObj = req.body as GroupMemberRequest;
    console.log("## upsertTutorGroupMember req:: ", reqObj);
    if( !_.isNumber(reqObj.user_id) || !_.isNumber(reqObj.course_id)
        || !_.isNumber(reqObj.tutor_group_id) || !(reqObj.user_role in TutorGroupRole) ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    // TODO - only admin / instructor of the group can add members
    // TODO - check if course is valid and user is entitled
    const resp = await this.groupService.addOrUpdateGroupMember(reqObj);
    res.status(200).end(JSON.stringify(resp));
  }));

}
