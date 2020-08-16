import { BaseDAO } from "./base.dao";
import { Contactus } from "../../../pana-tutor-lib/model/contact-us.interface";
import _ from "lodash";

export class ContactUsDAO extends BaseDAO {
  insertMessage = async (req: Contactus) => {
    const query = `INSERT INTO contact_us (full_name, email, phone, message)
      VALUES (?, ?, ?, ?) `;
    const params = [req.full_name, req.email, req.phone, req.message];
    const caller = "insertMessage";
    return this.insert(caller, query, params);
  };
}
