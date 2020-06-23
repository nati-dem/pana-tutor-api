import { BaseDAO } from "./base.dao";
import {UserSignupRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";

export class UserDAO extends BaseDAO {

  getUserById = async (userId:number) => {
    const query = `SELECT * FROM users WHERE user_id = ?`;
    const params = [userId];
    const caller = "getUserById";
    return this.find(caller, query, params);
  };

  findUsers = async (q:string) => {
    const query = `SELECT * FROM users WHERE name LIKE ? OR email LIKE ? `;
    const params = [`%${q}%`, `%${q}%`];
    const caller = "findUsers";
    return this.find(caller, query, params);
  };

  saveUser = async (req: UserSignupRequest) => {
    const phone = req.meta && req.meta.phone_number && req.meta.phone_number.length > 0 ? req.meta.phone_number[0] : '';
    const role = req.roles && req.roles.length > 0 ? req.roles[0] : 'subscriber';
    const query = `INSERT INTO users (user_id, name, email, phone, address, user_role)
      VALUES (?, ?, ?, ?, ?, ?) `;
    const params = [req.id, req.name, req.email, phone, '', role];
    const caller = "saveUser";
    return this.insert(caller, query, params);
  };

}
