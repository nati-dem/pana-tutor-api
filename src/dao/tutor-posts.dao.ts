import { BaseDAO } from "./base.dao";
import {BoardPostCreateRequest} from "../../../pana-tutor-lib/model/tutor/tutor-board.interface";

export class TutorPostDAO extends BaseDAO {

  getAllGroupPosts = async (courseId, groupId, status) => {
    const query = `SELECT p.*, a.post_id, a.group_id FROM tutor_board_posts p
      LEFT JOIN tutor_board_post_access a ON p.id = a.post_id
      where p.course_id = ? AND a.group_id = ? AND p.status = ? `;
    const params = [courseId, groupId, status];
    const caller = "getAllGroupPosts";
    return this.find(caller, query, params);
  };

  findGroupPostById = async (postId) => {
    const query = `SELECT * FROM tutor_board_posts p
      LEFT JOIN tutor_board_post_access a ON p.id = a.post_id
      where p.id = ?`;
    const params = [postId];
    const caller = "findGroupPostById";
    return this.find(caller, query, params);
  };

  createGroupPost = async (req: BoardPostCreateRequest) => {
    const query = `INSERT INTO tutor_board_posts (course_id, post_title, post_content, post_type,
      points, due_date, status, created_by) VALUES (?, ?, ?, ? , ?, ? , ?, ?) `;
    const params = [req.course_id, req.post_title, req.post_content, req.post_type,
      req.points, req.due_date, req.status, req.created_by ];
    const caller = "createGroupPost";
    return this.insert(caller, query, params);
  };

  editGroupPost = async (req: BoardPostCreateRequest, id:number) => {
    const query = `UPDATE tutor_board_posts set post_title=?, post_content=?, post_type=?,
      points=?, due_date=?, status=? WHERE id = ? `;
    const params = [ req.post_title, req.post_content, req.post_type,
      req.points, req.due_date, req.status, id ];
    const caller = "editGroupPost";
    return this.update(caller, query, params, id);
  };

  addGroupPostAccessBatch(postId:number, groupIds: number[]){
    let qMarks = '';
    const params :number[] = [];
    let firstEntry = true;
    for(const g of groupIds){
      if(!firstEntry) {
        qMarks += ",";
      }
      qMarks += "(?,?)";
      params.push(postId);
      params.push(g);
      firstEntry = false;
    }
    const query = `INSERT INTO tutor_board_post_access (post_id,group_id) VALUES ${qMarks}`;
    const caller = "addGroupPostAccessBatch";
    return this.insert(caller, query, params);
  }

  deleteGroupPost = async (id:number) => {
    const query = `DELETE FROM tutor_board_posts WHERE id = ?`;
    const params = [ id ];
    const caller = "deleteGroupPost";
    return this.delete(caller, query, params, id);
  };

  deleteGroupPostAccess = async (postId:number, groupId:number) => {
    const query = `DELETE FROM tutor_board_post_access WHERE post_id =? AND group_id = ?`;
    const params = [ postId,groupId ];
    const caller = "deleteGroupPostAccess";
    return this.delete(caller, query, params);
  };

}
