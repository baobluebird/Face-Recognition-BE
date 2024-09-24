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
      fs.writeFileSync(imagePath, image);

      const savedImage = await cloudinary.uploader.upload(imagePath, {
        public_id: `hole_${formattedTime}`,
        resource_type: "image",
      });

      fs.unlinkSync(imagePath);

      //const url = `${process.env.URL_VPS_HOLE}/process-image?image_url=${savedImage.secure_url}`;

      //const response = await axios.post(url);
      // if(response.data.result == 'No detection'){
      //   //delete hole
      //   await Hole.findByIdAndDelete(hole._id);
      //   resolve({
      //     status: "ERR",
      //     message: "No detection",
      //   });
      // }
      // hole.image = response.data.image_url;
      // hole.description = response.data.result;
      // await hole.save();
      await Face.create({
        image: savedImage.secure_url,
      });
      resolve({
        data: savedImage.secure_url,
        status: "OK",
        message: "Create hole successfully",
      });
    } catch (error) {
      reject(error);
    }
  });
};
const getLatestImage = async (req, res) => {
  try {
    const latestFace = await Face.findOne().sort({ createdAt: -1 });

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
    console.log(response)
    resolve({
      data: response.data,
      status: "OK",
      message: "Create hole successfully",
    });
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
  getLatestImage,
};
