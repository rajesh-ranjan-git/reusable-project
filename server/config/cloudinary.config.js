import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../constants/env.constants.js";

cloudinary.config({
  cloud_name: CLOUDINARY_API_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default cloudinary;
