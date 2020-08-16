import express from "express";
import _ from "lodash";
import { AppError } from "./../common/app-error";
import { ContactUsService } from "../service/contact-us.service";
import { Contactus } from "../../../pana-tutor-lib/model/contact-us.interface";
import { isSuccessHttpCode } from "./../../../pana-tutor-lib/util/common-helper";
import {
  ErrorCode,
  ErrorMessage,
} from "./../../../pana-tutor-lib/enum/constants";

import { Inject } from "typescript-ioc";
const asyncHandler = require("express-async-handler");
const router = express.Router();
export class ContactusRouter {
  @Inject
  private contactusService: ContactUsService;

  saveMessage = router.post(
    "/savemessage",
    asyncHandler(async (req, res, next) => {
      const reqObj = req.body as Contactus;
      console.log("reqObj:::", reqObj);
      if (
        _.isEmpty(reqObj.full_name) ||
        _.isEmpty(reqObj.email) ||
        _.isEmpty(reqObj.message) ||
        _.isEmpty(reqObj.phone)
      ) {
        throw new AppError(
          400,
          ErrorMessage.INVALID_PARAM,
          ErrorCode.INVALID_PARAM,
          null
        );
      }
      const resp = await this.contactusService.saveMessage(reqObj);
      console.log("resp", resp);
      res.status(200).end(JSON.stringify(resp));
    })
  );
}
