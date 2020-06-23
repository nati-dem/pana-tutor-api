import express from 'express';
import _ from 'lodash';
import {AppError} from '../common/app-error';
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import { Inject } from 'typescript-ioc';
import {TutorPostService} from "../service/tutor-post.service";
import {BoardPostCreateRequest, BoardPostStatus, BoardPostType} from "../../../pana-tutor-lib/model/tutor/tutor-board.interface";
import { GroupStatus, GroupMemberStatus } from "../../../pana-tutor-lib/enum/tutor.enum";
const asyncHandler = require('express-async-handler');
const router = express.Router();

export class TutorPostRouter {

  @Inject
  private postService: TutorPostService;

  index = router.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
  });

  getAllPostsInGroup = router.get('/groups/:groupId/posts', asyncHandler( async (req, res, next) => {
    const postStatus = req.query.postStatus;
    const courseId = parseInt(req.query.courseId, 10);
    const tutorGroupId = parseInt(req.params.groupId, 10);
    console.log("## getAllPostsInGroup tutorGroupId:: ", tutorGroupId , ' &postStatus::', postStatus);
    if( !(postStatus in BoardPostStatus) || !courseId || !tutorGroupId ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    const resp = await this.postService.getAllGroupPosts(courseId,tutorGroupId,postStatus);
    res.status(200).end(JSON.stringify(resp));
  }));

  upsertGroupPost = router.put('/groups/post', asyncHandler( async (req, res, next) => {
    const reqObj = req.body as BoardPostCreateRequest;
    console.log("## upsertGroupPost req:: ", reqObj);
    if( !_.isNumber(reqObj.course_id) || reqObj.group_ids.length < 1 || !(reqObj.status in BoardPostStatus)
        || !(reqObj.post_type in BoardPostType) || _.isEmpty(reqObj.post_title) || _.isEmpty(reqObj.post_content) ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    reqObj.created_by = global.userId;

    // TODO - only group instructor/admin can create/edit post
    let resp = {};
    if(reqObj.id) {
      resp = await this.postService.updateGroupPost(reqObj);
    } else {
      resp = await this.postService.createGroupPost(reqObj);
    }
    res.status(200).end(JSON.stringify(resp));
  }));

  deleteGroupPost = router.delete('/groups/:groupId/posts/:postId', asyncHandler( async (req, res, next) => {
    const courseId = parseInt(req.query.courseId, 10);
    const tutorGroupId = parseInt(req.params.groupId, 10);
    const postId = parseInt(req.params.postId, 10);
    console.log("## deleteGroupPost tutorGroupId:: ", tutorGroupId , ' &postId::', postId);
    if( !postId|| !courseId || !tutorGroupId ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    const resp = await this.postService.deleteGroupPost(postId,tutorGroupId,courseId);
    res.status(200).end(JSON.stringify(resp));
  }));

}
