const db = require('../database/db')


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