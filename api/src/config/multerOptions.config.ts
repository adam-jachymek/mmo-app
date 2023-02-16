import { ftpConnection } from './ftpConnection.config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';
import {
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

var FTPStorage = require('multer-ftp');
var FTP = require('ftp');

export const multerOptions: MulterOptions = {
  limits: {
    fileSize: 1024 * 1024 * 50, // 50MB
  },
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    done: (
      error: Error,
      acceptFile: boolean,
    ) => void,
  ) {
    if (
      file.mimetype.match(
        /\/(jpg|jpeg|png|gif|svg)$/,
      )
    ) {
      done(null, true);
    } else {
      done(
        new HttpException(
          `Unsupported file type ${extname(
            file.originalname,
          )}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: new FTPStorage({
    basepath: '/',
    ftp: ftpConnection,
    destination: function (
      req,
      file,
      options,
      callback,
    ) {
      const category =
        req.body.category.toLowerCase();

      const name = req.body.name.toLowerCase();

      const uploadPath = `sprites/map/${category}`;

      callback(
        null,
        `${uploadPath}/${generateFileName(
          file.originalname,
          name,
        )}`,
      );
    },
  }),
};

function generateFileName(
  originalname: string,
  name: string,
) {
  const fileExtension = extname(originalname);
  return `${name
    .replace(fileExtension, '')
    .toLowerCase()
    .replace(/ /g, '-')}${fileExtension}`;
}
