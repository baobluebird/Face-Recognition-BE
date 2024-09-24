const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const axios = require("axios");

const mongoose = require("mongoose");

const routes = require("./routes/api/api");
const cors = require("cors");
const bodyParser = require("body-parser");
dotenv.config();
const configViewEngine = require("./config/viewEngine");
const port = process.env.PORT || 3001;
const app = express();
const DetectionService = require("./services/detection.services");

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

configViewEngine(app);

routes(app);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to the database!");
  })

  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post("/api/detection/send-image", upload.single("imageFile"), async (req, res) => {
  try {
    // Kiểm tra nếu không có tệp ảnh nào được tải lên
    if (!req.file) {
      return res.status(400).json({
        status: "ERR",
        message: "No file uploaded",
      });
    }

    const response = await DetectionService.createDetection(req.file);

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

io.on('connection', (socket) => {
  console.log('have user connect:>> ', socket.id);
  io.emit('newUserConnect', 'Have user connect');
});

server.listen(port, () => {
  console.log('Server is running on port',port);
});     
 
global.io = io;