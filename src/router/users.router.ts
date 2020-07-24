import express from "express";
import _ from "lodash";
import { AppError } from "../common/app-error";
import { UserService } from "../service/user.service";
import { isSuccessHttpCode } from "../../../pana-tutor-lib/util/common-helper";
import {
  ErrorCode,
  ErrorMessage,
} from "../../../pana-tutor-lib/enum/constants";
import { UserSignupRequest } from "../../../pana-tutor-lib/model/user/user-auth.interface";
import { Inject } from "typescript-ioc";
const asyncHandler = require("express-async-handler");
const router = express.Router();

export class UserRouter {
  @Inject
  private userService: UserService;

  index = router.get("/", (req, res, next) => {
    res.send("Hello world!");
  });

  getMyProfileRouter = router.get(
    "/profile/:id",
    asyncHandler(async (req, res, next) => {
      const userId = req.params.id;
      console.log(
        "getProfile API call, userId:",
        userId,
        "global.userId::",
        global.userId
      );
      if (userId !== global.userId) {
        throw new AppError(
          403,
          ErrorMessage.FORBIDDEN,
          ErrorCode.FORBIDDEN_ACCESS,
          null
        );
      }

      const resp = await this.userService.findUserFromDBOrWp(userId);
      if (!resp || _.isEmpty(resp) || resp.length === 0) {
        throw new AppError(
          404,
          ErrorMessage.PROFILE_ERROR,
          ErrorCode.PROFILE_ERROR,
          null
        );
      }
      res.status(200).end(JSON.stringify(resp));
    })
  );

  userAuthInfo = router.get(
    "/auth-info",
    asyncHandler(async (req, res, next) => {
      const userId = global.userId;
      console.log("userAuthInfo API call, userId:", userId);
      const resp = await this.userService.getUserAutherizedResources(userId);
      if (!resp || _.isEmpty(resp) || resp.length === 0) {
        throw new AppError(
          404,
          ErrorMessage.GET_AUTH_INFO_ERROR,
          ErrorCode.GET_AUTH_INFO_ERROR,
          null
        );
      }
      res.status(200).end(JSON.stringify(resp));
    })
  );
}
