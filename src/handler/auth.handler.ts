import {APIHandlerService} from "../service/api-handler.service";
import {Inject} from "typescript-ioc";
import {UserLoginRequest, UserSignupRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import {isSuccessHttpCode} from "../../../pana-tutor-lib/util/common-helper";
import {HttpResponse} from "../../../pana-tutor-lib/model/api-response.interface";
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import {AppError} from '../common/app-error';
import {AppCache} from '../config/cache-config';
import {AppConstant} from '../config/constants';

export class AuthHandler {

    @Inject
    private apiHandlerService:APIHandlerService;
    private appCache = AppCache.getInstance();

    authenticate = async (loginRequest: UserLoginRequest) => {
        return await this.apiHandlerService.doPost(loginRequest, AppConstant.LOGIN_URL);
    }

    signup = async (signupRequest: UserSignupRequest) => {

        let adminToken = this.appCache.get( AppConstant.ADMIN_TOKEN_KEY );
        console.log('adminToken in cache:', adminToken);
        if ( adminToken === undefined ){
            adminToken = await this.getAdminToken();
        }
        return await this.apiHandlerService.doPost(signupRequest, AppConstant.REGISTER_URL, adminToken);
    }

    private getAdminToken = async () => {
        const tokenResp: HttpResponse = await this.authenticate({
              username: process.env.ADMIN_USER,
              password: process.env.ADMIN_PASS
            });
        if(!isSuccessHttpCode(tokenResp.status)) {
            throw new AppError(tokenResp.status, tokenResp.message, ErrorCode.LOGIN_ERROR, JSON.stringify(tokenResp.data));
        }
        // save in cache
        this.appCache.set( AppConstant.ADMIN_TOKEN_KEY, tokenResp.data.token, 86400 ); // ttl in sec
        return tokenResp.data.token;
    }

}
