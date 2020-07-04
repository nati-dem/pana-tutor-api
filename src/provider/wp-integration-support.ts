import {AppCache} from '../config/cache-config';
import {HttpResponse} from "../../../pana-tutor-lib/model/api-response.interface";
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import {AppError} from '../common/app-error';
import {AppConstant} from '../config/constants';
import {isSuccessHttpCode} from "../../../pana-tutor-lib/util/common-helper";
import axios from "axios";
import {handleApiError} from "../common/util";
import {AbstractIntegrationSupport} from "./abstract-integration-support";
const jwtDecode = require('jwt-decode');

export class WpIntegrationSupport implements AbstractIntegrationSupport {

    private appCache = AppCache.getInstance();

    generateServiceToken = async (): Promise<string> => {
        let adminToken = this.appCache.get( AppConstant.ADMIN_TOKEN_KEY );
        const currentTime = new Date().getTime();
        let tokenExpTime = -1;
        if ( adminToken !== undefined ){
            const decoded = jwtDecode(adminToken);
            tokenExpTime = decoded.exp;
        }
        console.log('adminToken in cache: ', adminToken, ' , ##currentTime::', currentTime, ' , ##tokenExpTime::', tokenExpTime);
        if ( !adminToken || adminToken === undefined || currentTime < tokenExpTime){
            console.log('#adminToken not in cache, generating token..')
            const tokenResp: HttpResponse = await this.doLoginPost({
                username: process.env.ADMIN_USER,
                password: process.env.ADMIN_PASS
              }, AppConstant.LOGIN_URL);
          if(!isSuccessHttpCode(tokenResp.status)) {
              throw new AppError(tokenResp.status, tokenResp.message, ErrorCode.APP_TOKEN_ERROR, JSON.stringify(tokenResp.data));
          }
          adminToken = tokenResp.data.token;
        }
        // save in cache
        this.appCache.set( AppConstant.ADMIN_TOKEN_KEY, adminToken, 2 * 86400 ); // ttl in sec ~ 2 days
        return adminToken;
    }

    private doLoginPost = async (requestObj: any, url: string) => {
        console.log('calling api:: ', url)
        let responseObj = {} as HttpResponse;

        await axios({
            method: 'post',
            url,
            data: requestObj,
          }).then( response => {
            responseObj.data = response.data;
            responseObj.status = response.status;
          }).catch(err =>
            responseObj = handleApiError(err)
          );

          console.log('##doLoginPost API resp:: ', responseObj);
          return responseObj;
    }

}

