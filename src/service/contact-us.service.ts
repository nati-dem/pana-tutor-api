import { UserRole } from "../../../pana-tutor-lib/enum/user.enum";
import { isSuccessHttpCode } from "../../../pana-tutor-lib/util/common-helper";
import { AppError } from "../common/app-error";
import _ from "lodash";
import { ContactUsDAO } from "../dao/contact-us.dao";
import { HttpResponse } from "../../../pana-tutor-lib/model/api-response.interface";
import { Contactus } from "../../../pana-tutor-lib/model/contact-us.interface";
import { AuthService } from "./auth.service";
import { Inject } from "typescript-ioc";
export class ContactUsService {
  @Inject
  private contactusDAO: ContactUsDAO;
  saveMessage = async (req: Contactus) => {
    console.log("reqObj", req);
    return await this.contactusDAO.insertMessage(req);
  };
}
