import {IntegratorService} from "../provider/integrator.service";
import {Inject} from "typescript-ioc";
import {UserLoginRequest, UserSignupRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import {AppConstant} from '../config/constants';
import { UserDAO } from "../dao/user.dao";

export class UserService {

    @Inject
    private apiExecuter: IntegratorService;
    @Inject
    private userDAO: UserDAO;

    getUserById = async (id: number) => {
        const profileUrl = `${AppConstant.USER_URL}/${id}`
        return await this.apiExecuter.doGet({context:'edit'}, profileUrl, true);
    }

    updateUserProfile = async (id: number, reqObj: UserSignupRequest) => {
        const profileUrl = `${AppConstant.USER_URL}/${id}`
        return await this.apiExecuter.doPost(reqObj, profileUrl, true);
    }

    saveUser = async (req: UserSignupRequest) => {
        console.log('saving User in local DB...')
        let result;
        if(req.id){
            result = await this.userDAO.getUserById(req.id);
            if(result.length === 0){
                result = await this.userDAO.saveUser(req);
            }
        }
        return result;
    }

}
