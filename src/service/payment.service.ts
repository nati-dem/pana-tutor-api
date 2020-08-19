import {IntegratorService} from "./../provider/integrator.service";
import {Inject} from "typescript-ioc";
import {AppConstant} from './../config/constants';

export class PaymentService {

    @Inject
    private apiExecuter: IntegratorService;

    ypayVerify = async (loginRequest: any) => {
        const url = process.env.YENE_PAY_SANDBOX ? AppConstant.YPAY_PDT_SANDBOX : AppConstant.YPAY_PDT
        return await this.apiExecuter.doPost(loginRequest, url, false);
    }

}
