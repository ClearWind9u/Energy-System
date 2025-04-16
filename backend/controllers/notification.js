const db = require('../database/db');
exports.addNotification = async (req, res) => {
    const listDevice = new Map([
        ["switchState[0]", "relay"],
        ["switchState[1]", "quạt"],
        ["switchState[2]", "đèn led"],
        ["switchState[3]", "tất cả thiết bị"],
        ["switchState[4]", "chế độ thủ công"]
    ]);

    try {
        const { id, device, state } = req.body;

        const statusText = state ? "Đã bật " : "Đã tắt ";

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
        const notificationText = `${statusText}${deviceName} vào ${formatted}`;

        const insertSql = "INSERT INTO notification (id, id_group, content, time) VALUES (null, ?, ?, ?)";
        const idGroup = parseInt(id); // assuming `id` is the group ID

        const [result] = await db.promise().query(insertSql, [idGroup, notificationText, formatted]);

        return res.status(200).json({ message: "Đã thêm thành công", notification_id: result.insertId });
    } catch (error) {
        console.error("Lỗi khi thêm thông báo:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
