const db = require('../database/db')
const axios = require("axios");

//lay danh sach thiet bi
exports.getAllDevices = async (req,res) => {
 try {
    const [result] = await db.promise().query("SELECT * FROM device")
    return res.status(200).json(result)
 } catch (error) {
    console.error("Loi khi lay thong tin cac thiet bi:", error.message);
    return res.status(500).json({ message: "abc server error", error: error.message });
 }

}

exports.addDevices = async (req, res) => {
   try {
       const { device_name, max_energy, id_group } = req.body;

       var insertSql = "INSERT INTO device (name, max_energy, electric_consumed, time_used, id_group) VALUES (?, ?, 0, 0, ?)";
       const [result] = await db.promise().query(insertSql, [device_name, max_energy, id_group]);

       return res.status(200).json({ message: "Đã thêm thành công", device_id: result.insertId });
   } catch (error) {
       console.error("Lỗi khi thêm thiết bị:", error.message);
       return res.status(500).json({ message: "Internal server error", error: error.message });
   }
};

exports.editDevices = async (req, res) => {
   try {
       const { device_id, device_name, max_energy, id_group } = req.body;
       
       const [result] = await db.promise().query("SELECT * FROM device WHERE id = ?", [device_id]);
       if (result.length === 0) {
           return res.status(400).json({ message: "Không tồn tại thiết bị cần sửa" });
       }

       const updateSql = "UPDATE device SET name = ?, max_energy = ?, id_group = ? WHERE id = ?";
       await db.promise().query(updateSql, [device_name, max_energy, id_group, device_id]);

       return res.status(200).json({ message: "Đã sửa thiết bị thành công" });
   } catch (error) {
       console.error("Lỗi khi sửa thiết bị:", error.message);
       return res.status(500).json({ message: "Internal server error", error: error.message });
   }
};

exports.deleteDevices = async (req, res) => {
   try {
       const { device_id } = req.query;

       if (!device_id) {
           return res.status(400).json({ message: "Thiếu device_id" });
       }

       // Kiểm tra xem thiết bị có tồn tại không
       const [result] = await db.promise().query("SELECT * FROM device WHERE id = ?", [device_id]);
       
       if (result.length === 0) {
           return res.status(404).json({ message: "Thiết bị cần xóa không tồn tại" });
       }

       // Tiến hành xóa thiết bị
       await db.promise().query("DELETE FROM device WHERE id = ?", [device_id]);

       return res.status(200).json({ message: "Đã xóa thiết bị thành công" });
   } catch (error) {
       console.error("Lỗi khi xóa thiết bị:", error.message);
       return res.status(500).json({ message: "Internal server error", error: error.message });
   }
};

exports.setPower = async (req, res) => {
    try {
        const {power,name} = req.body;
        console.log(power + " " + name);
        await db.promise().query("UPDATE device SET max_energy = ? WHERE name = ?", [power,name]);
        return res.status(200).json({ message: "Đã thiết lập công suất thành công" });
    } catch (error) {
        console.error("Lỗi khi thiêt lập công suất:", error.message);
       return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

exports.addRecord = async (req, res) => {
  try {
    const { id_device, current, humidity, temperature, voltage_light, time } =
      req.body;
    const [existing] = await db
      .promise()
      .query("SELECT * FROM record WHERE id_device = ? AND time = ?", [
        id_device,
        time,
      ]);
    if (existing.length > 0) {
      return res
        .status(200)
        .json({ message: "Bản ghi đã tồn tại. Không thêm mới." });
    }
    await db.promise().query(
      `INSERT INTO record (id_device, time, current, humidity, temperature, voltage_light)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_device, time, current, humidity, temperature, voltage_light]
    );
    return res.status(201).json({ message: "Thêm bản ghi thành công" });
  } catch (error) {
    console.error("Lỗi khi thêm bản ghi:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getRecordsByFilter = async (req, res) => {
  try {
    const { filter, date } = req.query;
    if (!filter || !date) {
      return res.status(400).json({ message: "Missing filter or date parameter" });
    }
    if (!["day", "month", "year"].includes(filter)) {
      return res.status(400).json({ message: "Invalid filter. Use 'day', 'month', or 'year'" });
    }

    const selectedDate = new Date(date);
    if (isNaN(selectedDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();

    let query = "";
    let queryParams = [];
    let responseData = [];

    if (filter === "day") {
      query = `
        SELECT id_device, time, current, humidity, temperature, voltage_light
        FROM record
        WHERE DATE(time) = ?
      `;
      queryParams = [date];
      const [records] = await db.promise().query(query, queryParams);

      responseData = records.map((record) => ({
        date: record.time.toISOString().split("T")[0],
        displayDate: new Date(record.time).toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        id_device: record.id_device,
        time: record.time.toISOString(),
        current: parseFloat(record.current),
        humidity: parseFloat(record.humidity),
        temperature: parseFloat(record.temperature),
        voltage_light: parseFloat(record.voltage_light),
        devices: [
          {
            name: record.id_device,
            current: parseFloat(record.current),
            humidity: parseFloat(record.humidity),
            temperature: parseFloat(record.temperature),
            voltage_light: parseFloat(record.voltage_light),
          },
        ],
      }));

    } else if (filter === "month") {
      query = `
        SELECT id_device, time, current, humidity, temperature, voltage_light
        FROM record
        WHERE YEAR(time) = ? AND MONTH(time) = ?
      `;
      queryParams = [year, month];

      const [records] = await db.promise().query(query, queryParams);

      if (records.length === 0) {
        return res.status(200).json([]);
      }
      responseData = [
        {
          date: `${month}/${year}`,
          displayDate: `Tháng ${month}, ${year}`,
          devices: records.map((record) => ({
            name: record.id_device,
            id_device: record.id_device,
            time: record.time.toISOString(),
            current: parseFloat(record.current),
            humidity: parseFloat(record.humidity),
            temperature: parseFloat(record.temperature),
            voltage_light: parseFloat(record.voltage_light),
          })),
        },
      ];

    } else if (filter === "year") {
      query = `
        SELECT id_device, time, current, humidity, temperature, voltage_light
        FROM record
        WHERE YEAR(time) = ?
      `;
      queryParams = [year];

      const [records] = await db.promise().query(query, queryParams);

      if (records.length === 0) {
        return res.status(200).json([]);
      }

      responseData = [
        {
          date: `${year}`,
          displayDate: `Năm ${year}`,
          devices: records.map((record) => ({
            name: record.id_device,
            id_device: record.id_device,
            time: record.time.toISOString(),
            current: parseFloat(record.current),
            humidity: parseFloat(record.humidity),
            temperature: parseFloat(record.temperature),
            voltage_light: parseFloat(record.voltage_light),
          })),
        },
      ];
    }
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching records:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// exports.getAiRecommendation = async (req, res) => {
//   try {
//     const { filter, date, usage, devices } = req.body;

//     // Kiểm tra dữ liệu đầu vào
//     if (!filter || !date || !usage || !Array.isArray(devices)) {
//       return res.status(400).json({ error: "Thiếu hoặc sai định dạng dữ liệu đầu vào" });
//     }

//     // Chuẩn bị prompt cho AI
//     const prompt = `
//   Hi
// `;

//     // Gọi Hugging Face Inference API
//     const aiResponse = await axios.post(
//       "https://api-inference.huggingface.co/models/gpt2",
//       {
//         inputs: prompt,
//         parameters: {
//           max_length: 100,
//           temperature: 0.7,
//           top_p: 0.9,
//           return_full_text: false // Không trả lại prompt trong response
//         }
//       },
//       {
//         headers: {
//           "Authorization": `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("AI Response:", aiResponse.data[0]);

//     // Lấy lời khuyên từ AI
//     const recommendation = aiResponse.data[0].generated_text.trim();

//     // Trả về kết quả
//     res.json({ recommendation });
//   } catch (error) {
//     console.error("Lỗi khi gọi Hugging Face API:", error.response?.data || error.message);
//     res.status(500).json({
//       error: "Không thể lấy lời khuyên từ AI. Vui lòng thử lại.",
//       details: error.response?.data || error.message,
//     });
//   }
// };