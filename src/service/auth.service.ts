import axios from "axios";
import {UserLoginRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import {HttpResponse} from "../../../pana-tutor-lib/model/api-response.interface";
import {handleApiError} from "../common/util";


export class AuthService {

    authenticate = async (loginRequest: UserLoginRequest) => {

      let responseObj = {} as HttpResponse;
      await axios({
          method: 'post',
          url: '/wp-json/jwt-auth/v1/token',
          data: loginRequest
        })
        .then( response => {
          responseObj.data = response.data;
          responseObj.status = response.status;
        })
        .catch(err =>
          responseObj = handleApiError(err)
        );

        console.log(responseObj);
        return responseObj;
    }
}
