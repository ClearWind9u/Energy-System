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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
