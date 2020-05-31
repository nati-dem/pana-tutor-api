import {IntegratorService} from "./../provider/integrator.service";
import {Inject} from "typescript-ioc";
import {UserLoginRequest, UserSignupRequest} from "./../../../pana-tutor-lib/model/user/user-auth.interface";
import {isSuccessHttpCode} from "./../../../pana-tutor-lib/util/common-helper";
import {HttpResponse} from "./../../../pana-tutor-lib/model/api-response.interface";
import {ErrorCode, ErrorMessage} from "./../../../pana-tutor-lib/enum/constants";
import {AppError} from './../common/app-error';
import {AppCache} from './../config/cache-config';
import {AppConstant} from './../config/constants';


export class AuthService {

    @Inject
    private apiExecuter: IntegratorService;

    authenticate = async (loginRequest: UserLoginRequest) => {
        return await this.apiExecuter.doPost(loginRequest, AppConstant.LOGIN_URL, false);
    }

    signup = async (signupRequest: UserSignupRequest) => {
        return await this.apiExecuter.doPost(signupRequest, AppConstant.REGISTER_URL, true);
    }

    validateToken = async (token: string) : Promise<HttpResponse> => {
        return await this.apiExecuter.doPost({}, AppConstant.TOKEN_VALIDATION_URL, false, token);
    }

}
