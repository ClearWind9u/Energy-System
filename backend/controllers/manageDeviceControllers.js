const db = require('../database/db')


//lay danh sach thiet bi
exports.getAllDevices = async (req,res) => {
 try {
    const [result] = await db.query("SELECT * FROM device")
    return res.status(200).json(result)
 } catch (error) {
    console.error("Loi khi lay thong tin cac thiet bi:", error.message);
    return res.status(500).json({ message: "abc server error", error: error.message });
 }

}
exports.addDevices = async (req,res) => {
   try {
    const {device_id, device_name, id_group} = req.body
        var sql = "SELECT * FROM device WHERE id = ? "
        const [result] = await db.query(sql,[device_id])
        console.log(result);
        if(result.length!=0){
            return res.status(500).json({message: "da ton tai ID "})
        }
        var insertSql = "INSERT INTO device (id, name, max_energy, electric_consumed, time_used, id_group ) VALUES (?,?,0,0,0,?)"
        await db.query(insertSql,[device_id, device_name, id_group])
         return res.status(200).json({message:"da them thanh cong"})
   } catch (error) {
    console.error("Loi khi them thiet bi:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
   }
}