import express from 'express';
import {UserLoginRequest} from "../../../pana-tutor-lib/model/user/user-auth.interface";
import {isEmpty} from 'lodash';
import {AppError} from '../common/app-error';
const asyncHandler = require('express-async-handler')

const router = express.Router();

export const usersRouter = router.get('/', (req, res, next) => {
  res.status(200);
  res.end(JSON.stringify({ a: 1 }));
});
