import {IntegratorService} from "./../provider/integrator.service";
import {Inject} from "typescript-ioc";
import {UserLoginRequest, UserSignupRequest} from "./../../../pana-tutor-lib/model/user/user-auth.interface";
import {isSuccessHttpCode} from "./../../../pana-tutor-lib/util/common-helper";
import {HttpResponse} from "./../../../pana-tutor-lib/model/api-response.interface";
import {ErrorCode, ErrorMessage} from "./../../../pana-tutor-lib/enum/constants";
import {AppError} from './../common/app-error';
import {AppCache} from './../config/cache-config';
import {AppConstant} from './../config/constants';
const jwtDecode = require('jwt-decode');

export class AuthService {

    @Inject
    private apiExecuter: IntegratorService;
    private appCache = AppCache.getInstance();

    authenticate = async (loginRequest: UserLoginRequest) => {
        return await this.apiExecuter.doPost(loginRequest, AppConstant.LOGIN_URL, false);
    }

    signup = async (signupRequest: UserSignupRequest) => {
        return await this.apiExecuter.doPost(signupRequest, AppConstant.REGISTER_URL, true);
    }

    saveAuthTokenInCache = async (data) => {
        const userId = this.getUserIdFromToken(data.token);
        console.log('@saveAuthTokenInCache... userId:', userId)
        this.appCache.set( AppConstant.USER_TOKEN_KEY+'_'+userId, data.token, 2 * 86400 ); // ttl in sec ~ 2 days
    }

    isTokenValid = async (token: string, userId) : Promise<boolean> => {
        const tokenInCache = this.appCache.get( AppConstant.USER_TOKEN_KEY+'_'+userId );
        if(tokenInCache && token === tokenInCache) {
            return this.isTokenUnexpired(tokenInCache);
        } else {
            const tokenResp= await this.apiExecuter.doPost({}, AppConstant.TOKEN_VALIDATION_URL, false, token);
            if (isSuccessHttpCode(tokenResp.status)) {
                return true;
            }
        }
        return false;
    }

    getUserIdFromToken(token){
        // const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : '';
        const decoded = jwtDecode(token);
        console.log('user id from header token: ', decoded.data.user.id);
        return decoded.data.user.id;
    }

    isTokenUnexpired(token){
        const decoded = jwtDecode(token);
        const now = Date.now();
        const tokenExpTime = decoded.exp * 1000;
        console.log('@isTokenUnexpired...currentTime:', now, '&tokenExpTime::', tokenExpTime)
        if(tokenExpTime > now){
            console.log('@isTokenUnexpired found valid in cache')
            return true;
        }
        return false;
    }

}
