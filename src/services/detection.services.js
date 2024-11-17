const Face = require("../models/face.model");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();
const path = require("path");
const fs = require("fs");
const geolib = require("geolib");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.API_NAME_CLOUDINARY,
  api_key: process.env.API_KEY_CLOUDDINARY,
  api_secret: process.env.API_SECRET_CLOUDDINARY,
});

const createDetection = async (image) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uploadsDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }
      const now = new Date();

      // Lấy thời gian UTC (số milliseconds từ 1970-01-01)
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;

      // Giờ Việt Nam chênh lệch 7 tiếng so với UTC
      const vietnamTime = new Date(utcTime + 7 * 60 * 60000);

      // Lấy từng phần của thời gian
      const hours = vietnamTime.getHours().toString().padStart(2, "0"); // Lấy giờ, bổ sung 0 nếu cần
      const minutes = vietnamTime.getMinutes().toString().padStart(2, "0"); // Lấy phút, bổ sung 0 nếu cần
      const day = vietnamTime.getDate().toString().padStart(2, "0"); // Lấy ngày, bổ sung 0 nếu cần
      const month = (vietnamTime.getMonth() + 1).toString().padStart(2, "0"); // Lấy tháng, bổ sung 0 nếu cần
      const year = vietnamTime.getFullYear(); // Lấy năm

      // Tạo chuỗi theo định dạng "13h54.09.24.2024"
      const formattedTime = `${hours}h${minutes}-${day}-${month}-${year}`;

      const imagePath = path.join(uploadsDir, `${formattedTime}.jpg`);
      fs.writeFileSync(imagePath, image.data);

      const savedImage = await cloudinary.uploader.upload(imagePath, {
        public_id: `face_${formattedTime}`,
        resource_type: "image",
      });

      fs.unlinkSync(imagePath);

      const url = `${process.env.URL_VPS_FACE}/verify-face?image_url=${savedImage.secure_url}`;

      const response = await axios.post(url);
      console.log(response.data)
      if(response.data.result == 'Face matched'){
        await Face.create({
          image: savedImage.secure_url,
          name: response.data.closest_id
        });
        resolve({
          data: savedImage.secure_url,
          status: "OK",
          message: "Face matched",
        });
      }else{
        await Face.create({
          image: savedImage.secure_url,
          name: "Dangerous"
        });
        resolve({
          data: savedImage.secure_url,
          status: "ERR",
          message: "No matching face found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const createDetectionForCheckHuman = async (image) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uploadsDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }
      const now = new Date();

      // Lấy thời gian UTC (số milliseconds từ 1970-01-01)
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;

      // Giờ Việt Nam chênh lệch 7 tiếng so với UTC
      const vietnamTime = new Date(utcTime + 7 * 60 * 60000);

      // Lấy từng phần của thời gian
      const hours = vietnamTime.getHours().toString().padStart(2, "0"); // Lấy giờ, bổ sung 0 nếu cần
      const minutes = vietnamTime.getMinutes().toString().padStart(2, "0"); // Lấy phút, bổ sung 0 nếu cần
      const day = vietnamTime.getDate().toString().padStart(2, "0"); // Lấy ngày, bổ sung 0 nếu cần
      const month = (vietnamTime.getMonth() + 1).toString().padStart(2, "0"); // Lấy tháng, bổ sung 0 nếu cần
      const year = vietnamTime.getFullYear(); // Lấy năm

      // Tạo chuỗi theo định dạng "13h54.09.24.2024"
      const formattedTime = `${hours}h${minutes}-${day}-${month}-${year}`;

      const imagePath = path.join(uploadsDir, `${formattedTime}.jpg`);
      fs.writeFileSync(imagePath, image.data);

      const savedImage = await cloudinary.uploader.upload(imagePath, {
        public_id: `face_${formattedTime}`,
        resource_type: "image",
      });

      fs.unlinkSync(imagePath);

      const url = `${process.env.URL_VPS_FACE}/detect-human?image_url=${savedImage.secure_url}`;

      const response = await axios.post(url);
      console.log(response.data)
      if(response.data.result == 'Human detected'){
        await Face.create({
          image: savedImage.secure_url,
          name: "Dangerous"
        });
        resolve({
          data: savedImage.secure_url,
          status: "OK",
          message: "Human detected, Have people front door!",
        });
      }else{
        resolve({
          data: savedImage.secure_url,
          status: "ERR",
          message: "Nothing, its just dog",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const postToCloudiany = async (image) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uploadsDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }
      const now = new Date();

      // Lấy thời gian UTC (số milliseconds từ 1970-01-01)
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;

      // Giờ Việt Nam chênh lệch 7 tiếng so với UTC
      const vietnamTime = new Date(utcTime + 7 * 60 * 60000);

      // Lấy từng phần của thời gian
      const hours = vietnamTime.getHours().toString().padStart(2, "0"); // Lấy giờ, bổ sung 0 nếu cần
      const minutes = vietnamTime.getMinutes().toString().padStart(2, "0"); // Lấy phút, bổ sung 0 nếu cần
      const day = vietnamTime.getDate().toString().padStart(2, "0"); // Lấy ngày, bổ sung 0 nếu cần
      const month = (vietnamTime.getMonth() + 1).toString().padStart(2, "0"); // Lấy tháng, bổ sung 0 nếu cần
      const year = vietnamTime.getFullYear(); // Lấy năm

      // Tạo chuỗi theo định dạng "13h54.09.24.2024"
      const formattedTime = `${hours}h${minutes}-${day}-${month}-${year}`;

      const imagePath = path.join(uploadsDir, `${formattedTime}.jpg`);
      fs.writeFileSync(imagePath, image.data);

      const savedImage = await cloudinary.uploader.upload(imagePath, {
        public_id: `face_${formattedTime}`,
        resource_type: "image",
      });

      fs.unlinkSync(imagePath);

      resolve({
        data: savedImage.secure_url,
        status: "OK",
        message: "Post to cloudinary successfully",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getLatestImage = async (req, res) => {
  try {
    const latestFace = await Face.findOne({ name: { $ne: "Dangerous" } }).sort({ createdAt: -1 });

    if (!latestFace) {
      return res.status(404).json({
        status: "FAIL",
        message: "No image found",
      });
    }

    // Lấy URL của ảnh từ Cloudinary
    const imageUrl = latestFace.image;

    // Gọi đến URL của Cloudinary để tải ảnh
    const response = await axios({
      url: imageUrl, // URL của ảnh trên Cloudinary
      method: 'GET',
      responseType: 'arraybuffer', // Nhận dữ liệu dưới dạng nhị phân (binary)
    });
    
    return(response);
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Failed to get latest image",
      error: error.message,
    });
  }
};

const getLatestImageForWarning = async (req, res) => {
  try {
    // Corrected query
    const latestFace = await Face.findOne({ name: "Dangerous" }).sort({ createdAt: -1 });
    if (!latestFace) {
      return res.status(404).json({
        status: "FAIL",
        message: "No image found",
      });
    }

    // Lấy URL của ảnh từ Cloudinary
    const imageUrl = latestFace.image;

    // Gọi đến URL của Cloudinary để tải ảnh
    const response = await axios({
      url: imageUrl, // URL của ảnh trên Cloudinary
      method: 'GET',
      responseType: 'arraybuffer', // Nhận dữ liệu dưới dạng nhị phân (binary)
    });
    
    return(response);
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Failed to get latest image",
      error: error.message,
    });
  }
};

module.exports = {
  createDetection,
  createDetectionForCheckHuman,
  postToCloudiany,
  getLatestImage,
  getLatestImageForWarning
};
