
import axios from "axios";
import {UserLoginRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";

export class AuthService {

    authenticate = async (loginRequest: UserLoginRequest) => {
        console.log('hello from service')
    }
}
