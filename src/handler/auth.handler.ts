import {AuthService} from "../service/auth.service";
import {Inject} from "typescript-ioc";
import {UserLoginRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";

export class AuthHandler {

    @Inject
    private authService:AuthService;

     authenticate = async (loginRequest: UserLoginRequest) => {
        return await this.authService.authenticate(loginRequest);
    }

}
