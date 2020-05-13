import {BaseIntegratorService} from "../provider/base-integrator.service";
import {Inject} from "typescript-ioc";
import {UserLoginRequest, UserSignupRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import {AppConstant} from '../config/constants';

export class UserService {

    @Inject
    private apiExecuter: BaseIntegratorService;

    getUserById = async (id: number) => {
        const profileUrl = `${AppConstant.USER_URL}/${id}`
        return await this.apiExecuter.doGet({context:'edit'}, profileUrl, true);
    }

}
