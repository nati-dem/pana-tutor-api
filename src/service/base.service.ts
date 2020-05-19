import {IntegratorService} from "../provider/integrator.service";
import {Inject} from "typescript-ioc";
import {AppConstant} from '../config/constants';
import _ from 'lodash';

export class BaseService {

    @Inject
    protected apiExecuter: IntegratorService;

    getThumbImage = async (id: number) => {
        const mediaByIdUrl = `${AppConstant.MEDIA_URL}/${id}`
        return await this.apiExecuter.doGet({context:'edit'}, mediaByIdUrl, true);
    }

}
