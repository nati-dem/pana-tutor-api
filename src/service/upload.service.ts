import _ from 'lodash';
import { AppError } from '../common/app-error';
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
const multer = require('multer');

const imageFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    console.error("Invalid File format, supproted: PNG,JPG,JPEG");
    cb(new AppError(400, ErrorMessage.UNSUPPORTED_IMAGE, ErrorCode.UNSUPPORTED_IMAGE, null));
  }
};

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${process.env.PUBLIC_UPLOAD_DIR}${process.env.AVATAR_UPLOAD_SUBDIR}`);
    },
    filename: (req, file, cb) => {
      const original = file.originalname.split(".");
      cb(null, global.userId + "-"+ Date.now() + '.' + original[original.length - 1] )
    }
});

export const uploadAvatar = multer({
    storage: avatarStorage,
    fileFilter: imageFilter
});
