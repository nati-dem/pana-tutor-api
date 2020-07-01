import { BaseDAO } from "./base.dao";
import {UserSignupRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import _ from 'lodash';

export class UserDAO extends BaseDAO {

  getUserById = async (userId:number) => {
    const query = `SELECT * FROM users WHERE user_id = ?`;
    const params = [userId];
    const caller = "getUserById";
    return this.find(caller, query, params);
  };

  getUserGroups = async (userId:number) => {
    const query = `SELECT m.user_id, g.course_id, m.tutor_group_id,m.user_role,m.status FROM tutor_group_members m
      INNER JOIN tutor_group g ON g.id = m.tutor_group_id
      WHERE m.user_id = ? AND m.status = ? AND g.status = ? `;
    const params = [userId, 'active', 'active'];
    const caller = "getUserGroups";
    return this.find(caller, query, params);
  };

  findUsers = async (q:string) => {
    const query = `SELECT * FROM users WHERE name LIKE ? OR email LIKE ? `;
    const params = [`%${q}%`, `%${q}%`];
    const caller = "findUsers";
    return this.find(caller, query, params);
  };

  saveUser = async (req: UserSignupRequest) => {
    const query = `INSERT INTO users (user_id, name, email, phone, address, user_role)
      VALUES (?, ?, ?, ?, ?, ?) `;
    const params = [req.id, req.name, req.email, req.phone, '', req.primary_role];
    const caller = "saveUser";
    return this.insert(caller, query, params);
  };

  updateUser = async (req: UserSignupRequest, userId:number) => {
    const params: any[] = [];
    let fields = "";
    if(req.name && !_.isEmpty(req.name)){
      fields += ' name=?,'
      params.push(req.name)
    }
    if(req.nickname && !_.isEmpty(req.nickname)){
      fields += 'nickname=?,'
      params.push(req.nickname)
    }
    if(req.phone && !_.isEmpty(req.phone)){
      fields += 'phone=?,'
      params.push(req.phone)
    }
    if(req.address && !_.isEmpty(req.address)){
      fields += 'address=?,'
      params.push(req.address)
    }
    if(req.country && !_.isEmpty(req.country)){
      fields += 'country=?,'
      params.push(req.country)
    }
    if(req.bio && !_.isEmpty(req.bio)){
      fields += 'bio=?,'
      params.push(req.bio)
    }
    if(req.time_zone && !_.isEmpty(req.time_zone)){
      fields += 'time_zone=?,';
      params.push(req.time_zone)
    }
    if(params.length !== 0) {
      fields = fields.substring(0, fields.length - 1);
      const query = `UPDATE users set ${fields}  WHERE user_id = ? `;
      console.log('updateProfile d query:', query)
      params.push(userId);
      const caller = "updateUser";
      return this.update(caller, query, params, userId);
    } else {
      return {};
    }
  };

}
