import {IntegratorService} from "./../provider/integrator.service";
import {Inject} from "typescript-ioc";
import {AppConstant} from './../config/constants';
import _ from 'lodash';
import {EntityType} from "./../../../pana-tutor-lib/enum/constants";

export class BaseService {

    @Inject
    protected apiExecuter: IntegratorService;

    getThumbImage = async (id: number) => {
        const mediaByIdUrl = `${AppConstant.MEDIA_URL}/${id}`
        return await this.apiExecuter.doGet({context:'edit'}, mediaByIdUrl, true);
    }

    search = async (entity, query) => {
        let url: string = '';
        switch(entity) {
            case EntityType.courses:
                url = AppConstant.COURSES_URL
                break;
            case EntityType.users:
                url = AppConstant.USER_URL
                break;
        }
        url = `${url}?search=${query}`
        return await this.apiExecuter.doGet({context:'edit'}, url, true);
    }

}
