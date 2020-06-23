import { TutorPostDAO } from "../dao/tutor-posts.dao";
import { TutorGroupDAO } from "../dao/tutor-group.dao";
import { Inject } from "typescript-ioc";
import {BaseService} from './base.service';
import {BoardPostCreateRequest, BoardPostStatus} from "../../../pana-tutor-lib/model/tutor/tutor-board.interface";

export class TutorPostService extends BaseService {

  @Inject
  private postDAO: TutorPostDAO;
  @Inject
  private tutorGroupDAO: TutorGroupDAO;

  getUserDetailsInTutorGroup = async (groupId, groupStatus, userId) => {
    return await this.tutorGroupDAO.findUserDetailsInTutorGroup(groupId, groupStatus, userId);
  }

  createGroupPost = async (req: BoardPostCreateRequest) => {
    const result = await this.postDAO.createGroupPost(req);
    if(Array.isArray(result)){
      const postId = result[0].id;
      await this.postDAO.addGroupPostAccessBatch(postId, req.group_ids);
    }
    return result;
  };

  updateGroupPost = async (req: BoardPostCreateRequest) => {
    let result = await this.postDAO.findGroupPostById(req.id)
    if (result.length > 0 && req.id) {
      result = await this.postDAO.editGroupPost(req, req.id);
    }
    return result;
  };

  getAllGroupPosts = async (courseId, tutorGroupId, postStatus ) => {
    return await this.postDAO.getAllGroupPosts(courseId, tutorGroupId,postStatus );
  }

  deleteGroupPost = async (postId, tutorGroupId, courseId) => {
    // TODO check if user is admin/tutor of the group before delete
    return await this.postDAO.deleteGroupPost(postId);
  }

}
