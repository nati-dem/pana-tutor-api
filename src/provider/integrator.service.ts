import axios from "axios";
import {HttpResponse} from "../../../pana-tutor-lib/model/api-response.interface";
import {handleApiError} from "../common/util";
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import {AppError} from '../common/app-error';
import {AppCache} from '../config/cache-config';
import {AppConstant} from '../config/constants';
import {isSuccessHttpCode} from "../../../pana-tutor-lib/util/common-helper";
const jwtDecode = require('jwt-decode');

export class IntegratorService {

    private appCache = AppCache.getInstance();

    doPost = async (requestObj: any, url: string, useAdminToken: boolean, token?:string) => {
      console.log('calling api:: ', url)
      console.log('useAdminToken@API integrator:::', useAdminToken);
      const headers = await this.getHeaders(useAdminToken, token);
      let responseObj = {} as HttpResponse;

      await axios({
          method: 'post',
          url,
          data: requestObj,
          headers: headers ? headers: ''
        }).then( response => {
          responseObj.data = response.data;
          responseObj.status = response.status;
        }).catch(err =>
          responseObj = handleApiError(err)
        );

        console.log('##doPost API resp:: ', responseObj);
        return responseObj;
    }

    doGet = async (context: any, url: string, useAdminToken: boolean, token?:string) => {
      console.log('calling api:: ', url)
      console.log('useAdminToken@API integrator:::', useAdminToken)
      const headers = await this.getHeaders(useAdminToken, token);
      let responseObj = {} as HttpResponse;

      await axios({
          method: 'get',
          url,
          data: context,
          headers: headers ? headers: ''
        }).then( response => {
          responseObj.data = response.data;
          responseObj.status = response.status;
        }).catch(err =>
          responseObj = handleApiError(err)
        );

        console.log('##doGet api resp:: ', responseObj);
        return responseObj;
    }

    getHeaders = async (useAdminToken, token) => {
      let headers:any;
      if(useAdminToken) {
        const adminToken = await this.generateAppToken();
        headers = { Authorization: `Bearer ${adminToken}` };
      } else if (token) {
        headers = { Authorization: `Bearer ${token}` };
      }
      return headers;
    }

    generateAppToken = async () => {
      let adminToken = this.appCache.get( AppConstant.ADMIN_TOKEN_KEY );
      const currentTime = new Date().getTime();
      let tokenExpTime = -1;
      if ( adminToken !== undefined ){
          const decoded = jwtDecode(adminToken);
          tokenExpTime = decoded.exp;
      }
      console.log('adminToken in cache: ', adminToken, ' , ##currentTime::', currentTime, ' , ##tokenExpTime::', tokenExpTime);
      if ( adminToken === undefined || currentTime < tokenExpTime){
          console.log('#adminToken not in cache, generating token..')
          const tokenResp: HttpResponse = await this.doPost({
              username: process.env.ADMIN_USER,
              password: process.env.ADMIN_PASS
            }, AppConstant.LOGIN_URL, false);
        if(!isSuccessHttpCode(tokenResp.status)) {
            throw new AppError(tokenResp.status, tokenResp.message, ErrorCode.APP_TOKEN_ERROR, JSON.stringify(tokenResp.data));
        }
        adminToken = tokenResp.data.token;
      }
      // save in cache
      this.appCache.set( AppConstant.ADMIN_TOKEN_KEY, adminToken, 86400 ); // ttl in sec
      return adminToken;
  }

}
