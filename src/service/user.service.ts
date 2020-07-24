import { IntegratorService } from "../provider/integrator.service";
import { Inject } from "typescript-ioc";
import {
  UserLoginRequest,
  UserSignupRequest,
  ChangePasswordRequest,
} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import { AppConstant } from "../config/constants";
import { UserDAO } from "../dao/user.dao";
import {
  ErrorCode,
  ErrorMessage,
} from "../../../pana-tutor-lib/enum/constants";
import { UserRole } from "../../../pana-tutor-lib/enum/user.enum";
import { isSuccessHttpCode } from "../../../pana-tutor-lib/util/common-helper";
import { AppError } from "../common/app-error";
import _ from "lodash";
import { HttpResponse } from "../../../pana-tutor-lib/model/api-response.interface";
import { AuthService } from "./auth.service";

export class UserService {
  @Inject
  private apiExecuter: IntegratorService;
  @Inject
  private userDAO: UserDAO;
  @Inject
  private authService: AuthService;

  private getUserById = async (id: number) => {
    const profileUrl = `${AppConstant.USER_URL}/${id}`;
    return await this.apiExecuter.doGet({ context: "edit" }, profileUrl, true);
  };

  updateUserProfile = async (id: number, reqObj: UserSignupRequest) => {
    const profileUrl = `${AppConstant.USER_URL}/${id}`;
    return await this.apiExecuter.doPost(reqObj, profileUrl, true);
  };

  updateUserInWP = async (userId: number, mappedReq: UserSignupRequest) => {
    if (!_.isEmpty(mappedReq.name) || !_.isEmpty(mappedReq.password)) {
      const resp = await this.updateUserProfile(userId, mappedReq);
      if (!isSuccessHttpCode(resp.status)) {
        throw new AppError(
          resp.status,
          resp.message,
          ErrorCode.PROFILE_UPDATE_ERROR,
          JSON.stringify(resp.data)
        );
      }
    }
  };

  changePassword = async (userId, reqObj: ChangePasswordRequest) => {
    const loginReq = {
      username: reqObj.email,
      password: reqObj.password,
    };
    console.log("@authenticate for ChangePasswordRequest API call");
    const response: HttpResponse = await this.authService.authenticate(
      loginReq
    );
    if (!isSuccessHttpCode(response.status)) {
      throw new AppError(
        response.status,
        ErrorMessage.WRONG_PASSWORD,
        ErrorCode.WRONG_PASSWORD,
        JSON.stringify(response.data)
      );
    }
    const mappedReq = {
      password: reqObj.new_password,
    } as UserSignupRequest;
    console.log("@updateUserProfile for ChangePasswordRequest API call");
    return await this.updateUserProfile(userId, mappedReq);
  };

  updateUserInDB = async (id: number, reqObj: UserSignupRequest) => {
    return await this.userDAO.updateUser(reqObj, id);
  };

  findUserFromDBOrWp = async (id: number) => {
    console.log("getting User from local DB...");
    let result = await this.userDAO.getUserById(id);
    if (result.length === 0) {
      result = await this.getUserById(id);
      console.log("user resp from wp::", result);
      if (result.data && result.data.id) {
        result.data.primary_role = result.data.roles[0];
        this.userDAO.saveUser(result.data); // save in db async
        result = this.mapWpUserResponse(result);
      } else {
        result = {};
      }
    } else if (result.length > 0) {
      result = result[0];
    }
    return result;
  };

  getUserAutherizedResources = async (id: number) => {
    console.log("getUserAutherizedResources from DB...");
    const userResult = await this.userDAO.getUserById(id);
    const response: any = {};

    if (userResult && userResult.length > 0) {
      const userInfo = userResult[0];
      response.user_role = userInfo.user_role;
      response.name = userInfo.name;
      response.email = userInfo.email;
      response.user_id = userInfo.user_id;
      const map = new Map();
      const userGroups = await this.userDAO.getUserGroups(id);
      userGroups.forEach((res) => {
        const group = {
          groupId: res.tutor_group_id,
          user_role: res.user_role,
          status: res.status,
        };
        if (!map.has(res.course_id)) {
          map.set(res.course_id, {
            course_id: res.course_id,
            groups: [group],
          });
        } else {
          map.get(res.course_id).groups.push(group);
        }
      });
      response.courses = Array.from(map.values());
    }
    return response;
  };

  findUsersFromDB = async (q: string) => {
    return await this.userDAO.findUsers(q);
  };

  mapWpUserResponse(result) {
    const r = {
      user_id: result.data.id,
      name: result.data.name,
      email: result.data.email,
      phone: Array.isArray(result.data.meta.phone_number)
        ? result.data.meta.phone_number[0]
        : "",
      address: "",
      user_role: result.data.roles[0],
      status: "active",
      create_date: result.data.registered_date,
    };
    return r;
  }

  saveWpUserResonse = async (req: UserSignupRequest) => {
    console.log("saving User in local DB From WP response...");
    let result;
    if (req.id) {
      result = await this.userDAO.getUserById(req.id);
      if (result.length === 0) {
        req.phone =
          req.meta && req.meta.phone_number && req.meta.phone_number.length > 0
            ? req.meta.phone_number[0]
            : "";
        req.primary_role =
          req.roles && req.roles.length > 0
            ? req.roles[0]
            : UserRole.SUBSCRIBER;
        result = await this.userDAO.saveUser(req);
      }
    }
    return result;
  };

  updateAvatar = async (id: number, fileName: string) => {
    return await this.userDAO.updateAvatar(id, fileName);
  };
}
