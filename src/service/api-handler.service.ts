import axios from "axios";
import {UserLoginRequest, UserSignupRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import {HttpResponse} from "../../../pana-tutor-lib/model/api-response.interface";
import {handleApiError} from "../common/util";

export class APIHandlerService {

    doPost = async (requestObj: any, url: string, token?: string) => {
      console.log('calling api:: ', url)
      console.log('token@API handler:::', token)
      const headers = token ? { Authorization: `Bearer ${token}` } : '';
      let responseObj = {} as HttpResponse;

      await axios({
          method: 'post',
          url,
          data: requestObj,
          headers
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
