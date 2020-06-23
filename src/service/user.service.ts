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

    private getUserById = async (id: number) => {
        const profileUrl = `${AppConstant.USER_URL}/${id}`
        return await this.apiExecuter.doGet({context:'edit'}, profileUrl, true);
    }

    updateUserProfile = async (id: number, reqObj: UserSignupRequest) => {
        const profileUrl = `${AppConstant.USER_URL}/${id}`
        return await this.apiExecuter.doPost(reqObj, profileUrl, true);
    }

    findUserFromDB = async (id: number) => {
        console.log('getting User from local DB...')
        let result = await this.userDAO.getUserById(id);
        if(result.length === 0){
            result = await this.getUserById(id);
            console.log('user resp from wp::',result)
            if(result.data && result.data.id){
                result = this.mapWpUserResponse(result);
            } else {
                result = {};
            }
        } else if(result.length > 0){
            result = result[0];
        }
        return result;
    }

    findUsersFromDB = async (q: string) => {
        return await this.userDAO.findUsers(q);
    }

    mapWpUserResponse(result){
        this.userDAO.saveUser(result.data); // save in db async
        result = {
            user_id: result.data.id,
            name: result.data.name,
            email: result.data.email,
            phone: Array.isArray(result.data.meta.phone_number) ? result.data.meta.phone_number[0] : '',
            address: '',
            user_role: result.data.roles[0],
            status: 'active',
            create_date: result.data.registered_date
        };
        return result;
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
