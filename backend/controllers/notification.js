const db = require('../database/db');
const { connect } = require('../routes/userRoutes');
exports.addNotification = async (req, res) => {
    const listDevice = new Map([
        ["switchState[0]", "relay"],
        ["switchState[1]", "quạt"],
        ["switchState[2]", "đèn led"],
        ["switchState[3]", "tất cả thiết bị"],
        ["switchState[4]", "chế độ thủ công"]
    ]);

    try {
        const { id, device, state, username } = req.body;

        const statusText = state ? "đã bật " : "đã tắt ";

        const date = new Date();

        // Tạo thời gian UTC+7 thủ công
        const utc7 = new Date(date.getTime());

        // Format thành chuỗi "YYYY-MM-DD HH:mm:ss"
        const formatted = utc7.getFullYear() + '-' +
            ('0' + (utc7.getMonth() + 1)).slice(-2) + '-' +
            ('0' + utc7.getDate()).slice(-2) + ' ' +
            ('0' + utc7.getHours()).slice(-2) + ':' +
            ('0' + utc7.getMinutes()).slice(-2) + ':' +
            ('0' + utc7.getSeconds()).slice(-2);

        const deviceName = listDevice.get(device) || "thiết bị không xác định";
        const notificationText = `${username} ${statusText}${deviceName}`;

        const insertSql = "INSERT INTO notification (id, id_group, content, time) VALUES (null, ?, ?, ?)";
        const idGroup = parseInt(id); // assuming `id` is the group ID

        const [result] = await db.promise().query(insertSql, [idGroup, notificationText, formatted]);

        return res.status(200).json({ message: "Đã thêm thành công", notification_id: result.insertId });
    } catch (error) {
        console.error("Lỗi khi thêm thông báo:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


exports.getAllNotificationById = async (req, res) => {
    try {
        const { id_group } = req.query;

        if (!id_group) {
            return res.status(400).json({ message: "Thiếu id_group" });
        }

        const sql = "SELECT * FROM notification WHERE id_group = ? ORDER BY time DESC";
        const [rows] = await db.promise().query(sql, [id_group]);

        return res.status(200).json({ notifications: rows });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách thông báo:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.deleteNotificationById = async (req, res)  => {
    try {
        const {id_message } = req.query;
        if( !id_message) {
            return res.status(400),json({message: "Thiếu id_message"});
        }

        const sql = " DELETE from notification where id = ? ";

       const [result] =  await db.promise().query(sql,[id_message]);
       if (result.affectedRows === 0){
        return res.status(404).json({message:"Không tìm thấy Id đã cho"})
       } 

       return res.status(200).json({message:" Xóa thông báo thành công"})

    } catch(error) {
        console.log("Lỗi hệ thống:", error.message); // in lỗi ra rõ ràng
        return res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
}
