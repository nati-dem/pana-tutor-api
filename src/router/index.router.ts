import express from 'express';
import _ from 'lodash';
import {AppError} from '../common/app-error';
const asyncHandler = require('express-async-handler');
import {BaseService} from "../service/base.service";
import {isSuccessHttpCode} from "../../../pana-tutor-lib/util/common-helper";
import {ErrorCode} from "../../../pana-tutor-lib/enum/constants";
import {MediaModel} from "../../../pana-tutor-lib/model/cpt-model.interface";
import { Inject } from 'typescript-ioc';

const router = express.Router();

export class IndexRouter {

  @Inject
  private baseService: BaseService;

  baseRouter = router.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
  } );

  getMediaById = router.get('/media/:id', asyncHandler( async (req, res, next) => {
    console.log("## getMediaById:: " +req.params.id);
    const mediaResp = await this.baseService.getThumbImage(req.params.id);
    if(!isSuccessHttpCode(mediaResp.status)) {
      throw new AppError(mediaResp.status, mediaResp.message, ErrorCode.MEDIA_GET_ERROR, JSON.stringify(mediaResp.data));
    }
    const mapped = (_.pick (mediaResp.data, ['id', 'alt_text', 'mime_type', 'media_details'])) as unknown as MediaModel;
    res.status(200).end(JSON.stringify(mapped));
  }));

}
