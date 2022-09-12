import * as multer from 'multer';

import * as path from 'path';

import * as fs from 'fs';

import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const createFolder = (folder: string) => {
  try {
    console.log('💾 Create a root uploads folder...');
    fs.mkdirSync(path.join(__dirname, '..', `uploads`)); //폴더를 만드는 명령어
  } catch (error) {
    console.log('The folder already exists...');
  }

  try {
    console.log(`💾 Create a ${folder} uploads folder...`);

    fs.mkdirSync(path.join(__dirname, '..', `uploads/${folder}`)); //폴더 생성
  } catch (error) {
    console.log(`The ${folder} folder already exists...`);
  }
};

const storage = (folder: string): multer.StorageEngine => {
  createFolder(folder); // 폴더 만들고

  return multer.diskStorage({
    //옵션을 써준다.
    destination(req, file, cb) {
      //* 어디에 저장할 지

      const folderName = path.join(__dirname, '..', `uploads/${folder}`);

      cb(null, folderName); //cb에 두번째 인자가 어디에 저장할지다.
    },

    filename(req, file, cb) {
      //* 어떤 이름으로 올릴 지

      const ext = path.extname(file.originalname); //파일을 올려서 확장자를 추출한다.

      const fileName = `${path.basename(
        file.originalname,

        ext,
      )}${Date.now()}${ext}`;

      cb(null, fileName);
    },
  });
};
//multerOptions을 컨트롤러에서 사용해서 업로드 한다.
export const multerOptions = (folder: string) => {
  const result: MulterOptions = {
    storage: storage(folder),
  };

  return result;
};