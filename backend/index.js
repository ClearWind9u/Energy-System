const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const manageDeviceRouter = require('./routes/manageDeviceRoutes')
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/api", userRoutes);
app.use("/device", manageDeviceRouter);

// // API nhận dữ liệu từ CoreIoT
// app.post('/webhook', async (req, res) => {
//   try {
//       const data = req.body;
//       console.log('📡 Received data from CoreIoT:', data);

//       // Kiểm tra dữ liệu đầu vào
//       if (!data.deviceName || !data.telemetry) {
//           return res.status(400).json({ message: "Invalid data format" });
//       }

//       // Lưu vào database
//       saveToDatabase(data, (err, result) => {
//           if (err) {
//               return res.status(500).json({ message: "Database error", error: err });
//           }
//           res.status(200).json({ message: "Data received successfully", data: result });
//       });

//   } catch (error) {
//       console.error('❌ Error processing data:', error);
//       res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Hàm lưu dữ liệu vào MySQL
// function saveToDatabase(data, callback) {
//   const sql = `INSERT INTO telemetry (device_name, temperature, humidity, raw_data) VALUES (?, ?, ?, ?)`;
//   const values = [
//       data.deviceName || 'Unknown',
//       data.telemetry?.temperature || null,
//       data.telemetry?.humidity || null,
//       JSON.stringify(data.telemetry) || '{}'
//   ];

//   db.query(sql, values, (err, result) => {
//       if (err) {
//           console.error('❌ Lỗi khi chèn dữ liệu vào MySQL:', err);
//           return callback(err, null);
//       }
//       console.log('✅ Dữ liệu đã được lưu vào MySQL:', result);
//       return callback(null, result);
//   });
// }

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
