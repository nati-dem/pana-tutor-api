import { UserSignupRequest } from "../../../pana-tutor-lib/model/user/user-auth.interface";
import _ from "lodash";

export const mapUpdateProfileRequest = (reqObj) => {
  return {
    ...(reqObj.name ? { name: escape(reqObj.name) } : {}),
    ...(reqObj.nickname ? { nickname: escape(reqObj.nickname) } : {}),
    // ...(reqObj.first_name ? {first_name: escape(reqObj.first_name) } : {} ),
    // ...(reqObj.password ? {password:reqObj.password} : {} ),
    // ...(reqObj.meta ? {meta: reqObj.meta} : {} ),
    ...(reqObj.phone ? { phone: escape(reqObj.phone) } : {}),
    ...(reqObj.address ? { address: escape(reqObj.address) } : {}),
    ...(reqObj.country ? { country: escape(reqObj.country) } : {}),
    ...(reqObj.bio ? { bio: escape(reqObj.bio) } : {}),
    ...(reqObj.time_zone ? { time_zone: escape(reqObj.time_zone) } : {}),
  } as UserSignupRequest;
};

export const mapUserWpUserResponse = (resp) => {
  return _.pick(resp.data, [
    "id",
    "username",
    "name",
    "first_name",
    "last_name",
    "email",
    "roles",
    "meta",
  ]);
};
