import { ConfigOptions, v2 } from 'cloudinary';
import { CLOUDINARY } from '../shared/constants/constants';
import * as dotenv from 'dotenv';

dotenv.config();

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): ConfigOptions => {
    return v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
  },
};
