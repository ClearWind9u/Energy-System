const db = require('../database/db');

// Lấy danh sách người dùng
exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm người dùng mới
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    res.status(201).json({ message: 'Người dùng đã được tạo' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
