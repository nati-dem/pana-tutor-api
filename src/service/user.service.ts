import {IntegratorService} from "../provider/integrator.service";
import {Inject} from "typescript-ioc";
import {UserLoginRequest, UserSignupRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import {AppConstant} from '../config/constants';

export class UserService {

    @Inject
    private apiExecuter: IntegratorService;

    getUserById = async (id: number) => {
        const profileUrl = `${AppConstant.USER_URL}/${id}`
        return await this.apiExecuter.doGet({context:'edit'}, profileUrl, true);
    }

    updateUserProfile = async (id: number, reqObj: UserSignupRequest) => {
        const profileUrl = `${AppConstant.USER_URL}/${id}`
        return await this.apiExecuter.doPost(reqObj, profileUrl, true);
    }

}
