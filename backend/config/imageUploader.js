import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

export const uploadImageToCloudinary = async (file, folder, height, quality) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  try {
    const options = { folder };

    if (height) {
      options.height = height;
    }
    if (quality) {
      options.quality = quality;
    }

    options.resource_type = "auto";

    console.log("I'm in uploader.upload");
    const uploadRes = await cloudinary.uploader.upload(
      file.tempFilePath,
      options
    );
    console.log("Uploaded -> ", uploadRes);

    return uploadRes;
  } catch (e) {
    console.log("Error in uploading file...");
    console.log(e);
  }
};
