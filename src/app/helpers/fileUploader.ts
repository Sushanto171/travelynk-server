/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';
import fs from "fs";
import multer from "multer";
import path from 'path';
import config from '../config';
import { ApiError } from './ApiError';
import { httpStatus } from './httpStatus';

// diskStorage ===> store file after upload cloudinary
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary.NAME,
  api_key: config.cloudinary.API_KEY,
  api_secret: config.cloudinary.API_SECRET
});


const uploadFileToCloudinary = async (file: Express.Multer.File) => {
  try {
    // upload file
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: "travelynk",
      public_id: file.filename
    })
    return uploadResult
  } catch (error: any) {
    console.log(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message)
  }
}

//delete uploaded from cloudinary
const destroyFileFormCloudinary = async (req: Request) => {

  const url = Object.values(req.body).find((value: unknown) =>
    typeof value === 'string' && value.startsWith("http://res.cloudinary.com")
  ) as string | undefined;

  if (!url) {
    return; // Exit if no URL is found
  }

  const regex = /\/upload\/(?:v\d+\/)?(.+?)\.[A-Za-z0-9]+(?:\?.*)?$/;
  const match = url.match(regex);

  const public_id = match ? match[1] : null;
  if (public_id) {
    console.log({ public_id });
    return await cloudinary.uploader.destroy(public_id);
  }
  return;
};

// clean disk buffer
const cleanUpDiskFile = (file: Express.Multer.File) => {
  fs.unlinkSync(file.path);
};

export const fileUploadHelper = {
  upload,
  uploadFileToCloudinary,
  destroyFileFormCloudinary,
  cleanUpDiskFile

}