const db = require('../database/db');
let bcrypt = require("bcryptjs");
let salt = bcrypt.genSaltSync(10);
// db.connect((err) => {
//   if (err) throw err;
//   console.log("Database connected");
// });
// Lấy danh sách người dùng
exports.getUsers = async (req, res) => {
  try {
    await db.query("SELECT * FROM user", (err, result) => {
      if (err) throw err;
      return res.json(result);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm người dùng mới
exports.createUser = (req, res) => {
  let body = req.body;
  let password = bcrypt.hashSync(body.password, salt);
  body.password = password;
  let values = Object.values(body);
  console.log(values);
  let message = {
    errCode: 0,
    errMessage: "successfully",
  };
  db.query(
    "INSERT INTO user(account,password,name,id_group) VALUES (?, ?, ?, ?)",
    values,
    (err, result) => {
      if (err) {
        console.error("Lỗi MySQL:", err.code);
        if (err.code === "ER_DUP_ENTRY") {
          message = {
            errCode: 1,
            errMessage: "Tài khoản đã tồn tại",
          };
        } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
          message = {
            errCode: 1,
            errMessage: "ID cụm không tồn tại",
          };
        } else {
          message = {
            errCode: 1,
            errMessage: "Lỗi không xác định",
          };
        }
        return res.status(200).json(message);
      } else {
        return res.status(200).json(message);
      }
    }
  );
};

exports.handleLogin = (req, res) => {
  let body = req.body;
  let values = [body.account];
  let message = {
    errCode: 0,
    errMessage: "Login successfully",
    idUser: null,
  };
  sql = "SELECT id,account,password FROM user WHERE account = ?";
  db.query(sql, values, function (err, results) {
    if (err) throw err;
    let output = results[0];
    if (output) {
      let check = bcrypt.compareSync(body.password, output.password);
      if (check) {
        message = {
          errCode: 0,
          errMessage: "Login successfully",
          idUser: output.id,
        };
        return res.status(200).json(message);
      } else {
        message = {
          errCode: 1,
          errMessage: "Wrong password",
          idUser: null,
        };
        return res.status(200).json(message);
      }
    } else {
      message = {
        errCode: 1,
        errMessage: "Username does not exist",
        idUser: null,
      };
      return res.status(200).json(message);
    }
  });
};
exports.getUserById = (req, res) => {
  const { id } = req.params; // Lấy ID từ URL

 db.query("SELECT id, account, name, id_group,password FROM user WHERE id = ?", [id], (err, result) => {
   if (err) {
     return res.status(500).json({ errCode: 1, errMessage: "Lỗi server", error: err.message });
   }

   if (result.length === 0) {
     return res.status(404).json({ errCode: 1, errMessage: "Không tìm thấy người dùng" });
   }

   res.status(200).json({ errCode: 0, user: result[0] });
 });
};

exports.updateUserById = (req, res) => {
  const { id } = req.params; // Lấy ID từ URL
  const { account, name } = req.body; // Lấy dữ liệu từ request body

  if (!account || !name) {
    return res.status(400).json({ errCode: 1, errMessage: "Vui lòng cung cấp đầy đủ account và name" });
  }

  const query = "UPDATE user SET account = ?, name = ? WHERE id = ?";
  db.query(query, [account, name, id], (err, result) => {
    if (err) {
      return res.status(500).json({ errCode: 1, errMessage: "Lỗi server", error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ errCode: 1, errMessage: "Không tìm thấy người dùng" });
    }

    res.status(200).json({ errCode: 0, message: "Cập nhật thông tin thành công" });
  });
};







