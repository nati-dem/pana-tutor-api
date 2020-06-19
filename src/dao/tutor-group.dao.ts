import { BaseDAO } from "./base.dao";
import { TutorRequest } from "../../../pana-tutor-lib/model/tutor/tutor-request.interface";
import { TutorGroupRequest, GroupMemberRequest } from "../../../pana-tutor-lib/model/tutor/tutor-group.interface";

export class TutorGroupDAO extends BaseDAO {

  createGroup = async (req: TutorGroupRequest) => {
    const query = `INSERT INTO tutor_group (course_id, status, start_date, created_by)
      VALUES (?, ?, ?,?) `;
    const params = [req.course_id, req.status, req.start_date, req.created_by ];
    const caller = "createTutorGroup";
    return this.insert(caller, query, params);
  };

  addUserInGroup = async (req: GroupMemberRequest) => {
    const query = `INSERT INTO tutor_group_members (tutor_group_id, user_id, user_role, status)
      VALUES (?, ?, ?, ?) `;
    const params = [req.tutor_group_id, req.user_id, req.user_role, req.status ];
    const caller = "addUserInGroup";
    return this.insert(caller, query, params);
  };

  updateGroupMember = async (req: GroupMemberRequest, id) => {
    const query = `UPDATE tutor_group_members SET user_role=?, status=? WHERE id = ? `;
    const params = [req.user_role, req.status, id ];
    const caller = "updateGroupMember";
    return this.update(caller, query, params, id);
  };

  findUserInGroup = async (userId, groupId) => {
    const query = `SELECT * FROM tutor_group_members m
      where m.user_id = ? AND m.tutor_group_id = ? `;
    const params = [userId, groupId];
    const caller = "findUserInGroup";
    return this.find(caller, query, params);
  };

  getGroupMembers = async (courseId, groupStatus, groupId) => {
    const query = `SELECT m.id, g.status,g.course_id,m.user_id, m.user_role, m.join_date FROM tutor_group g
      LEFT JOIN tutor_group_members m on m.tutor_group_id = g.id
      where g.course_id =? AND g.status = ? AND g.id = ? `;
    const params = [courseId, groupStatus, groupId];
    const caller = "getGroupMembers";
    return this.find(caller, query, params);
  };

  findUserGroupsInCourse = async (courseId, groupStatus, userId) => {
    const query = `SELECT m.* , g.start_date , g.status FROM tutor_group g
      INNER JOIN tutor_group_members m on m.tutor_group_id = g.id
      where g.course_id =? AND g.status = ? AND m.user_id = ? `;
    const params = [courseId, groupStatus, userId];
    const caller = "findUserGroups";
    return this.find(caller, query, params);
  };

  getAllUserGroups = async (userId, groupStatus, userStatus) => {
    const query = `SELECT m.* , g.start_date , g.status FROM tutor_group g
      INNER JOIN tutor_group_members m on m.tutor_group_id = g.id
      where m.user_id = ? AND g.status = ? AND m.status = ? `;
    const params = [userId, groupStatus, userStatus];
    const caller = "getAllUserGroups";
    return this.find(caller, query, params);
  }


}
