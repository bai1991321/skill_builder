let dbConfig = require("../models/dbconnection");
const bcrypt = require('bcrypt');
const saltRounds = 10;

let getUser = (criteria, callback) => {
    //criteria.user_id ? conditions += ` and user_id = '${criteria.user_id}'` : true;
    dbConfig.getDB().query(`select * from user where 1`, criteria, callback);
}
let loginUser = (criteria, callback) => {
    let conditions = 'SELECT * FROM `users` WHERE `user_email` = ?';
    let values = [criteria.user_email]
    dbConfig.getDB().query(conditions, values, callback);
}

let createUser = (dataToSet, callback) => {
    bcrypt.hash(dataToSet.user_password, saltRounds, function (err, hash) {
        var sql = 'INSERT INTO users SET ?';
        var values = { 'user_name': dataToSet.user_name, 'user_email': dataToSet.user_email, 'user_password': hash, 'user_image': '' }
        // Use the connection
        dbConfig.getDB().query(sql, values, callback);
    });
}
let createVerifycode = (dataToSet, callback) => {
    var sql = 'INSERT INTO verifyCodes SET ?';
    var values = { 'user_email': dataToSet.user_email, 'verifycode': dataToSet.verifycode }
    // Use the connection
    dbConfig.getDB().query(sql, values, callback);
}

let checkVerifycode = (criteria, callback) => {
    let conditions = "";
    criteria.user_email ? conditions += ` and user_email = '${criteria.user_email}'` : true;
    criteria.verifycode ? conditions += ` and verifycode = '${criteria.verifycode}'` : true;
    dbConfig.getDB().query(`select * from verifyCodes where 1 ${conditions}`, callback);
}
let checkResetToken = (criteria, callback) => {
    let conditions = "";
    criteria.resetToken ? conditions += ` and resetToken = '${criteria.resetToken}'` : true;
    dbConfig.getDB().query(`select * from users where 1 ${conditions}`, callback);
}
let getUserDetail = (criteria, callback) => {
    let conditions = "";
    criteria.user_id ? conditions += ` and user_id = '${criteria.user_id}'` : true;
    dbConfig.getDB().query(`select * from users where 1 ${conditions}`, callback);
}


let deleteUser = (criteria, callback) => {
    let conditions = "";
    criteria.id ? conditions += ` and id = '${criteria.id}'` : true;
    console.log(`delete from users where 1 ${conditions}`);
    dbConfig.getDB().query(`delete from users where 1 ${conditions}`, callback);

}

let updateUserEmail = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    criteria.user_id ? conditions += ` and user_id = '${criteria.user_id}'` : true;
    dataToSet.user_email ? setData += `user_email = '${dataToSet.user_email}'` : true;
    console.log(`UPDATE users SET ${setData} where 1 ${conditions}`);
    dbConfig.getDB().query(`UPDATE users SET ${setData} where 1 ${conditions}`, callback);
}

let updateUserVerified = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    criteria.user_email ? conditions += ` and user_email = '${criteria.user_email}'` : true;
    dataToSet.is_verified ? setData += `is_verified = '${dataToSet.is_verified}'` : true;
    dbConfig.getDB().query(`UPDATE users SET ${setData} where 1 ${conditions}`, callback);
}
let removeVerifyCode = (criteria, callback) => {
    let conditions = "";
    let setData = "";
    criteria.user_email ? conditions += ` and user_email = '${criteria.user_email}'` : true;
    dbConfig.getDB().query(`delete from verifycodes where 1 ${conditions}`, callback);
}


let updateUserPassword = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    criteria.user_id ? conditions += ` and user_id = '${criteria.user_id}'` : true;
    dataToSet.user_password ? setData += `user_password = '${dataToSet.user_password}'` : true;
    console.log(`UPDATE users SET ${setData} where 1 ${conditions}`);
    dbConfig.getDB().query(`UPDATE users SET ${setData} where 1 ${conditions}`, callback);
}
let updateUserPasswordByToken = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    criteria.resetToken ? conditions += ` and resetToken = '${criteria.resetToken}'` : true;
    dataToSet.user_password ? setData += `user_password = '${dataToSet.user_password}'` : true;
    setData += `, resetToken = ''`;
    console.log(`UPDATE users SET ${setData} where 1 ${conditions}`);
    dbConfig.getDB().query(`UPDATE users SET ${setData} where 1 ${conditions}`, callback);
}
let updateUserResetToken = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    criteria.user_email ? conditions += ` and user_email = '${criteria.user_email}'` : true;
    dataToSet.resetToken ? setData += `resetToken = '${dataToSet.resetToken}'` : true;
    dbConfig.getDB().query(`UPDATE users SET ${setData} where 1 ${conditions}`, callback);
}
let updateUser = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    criteria.user_id ? conditions += ` and user_id = '${criteria.user_id}'` : true;
    dataToSet.user_name ? setData += `user_name = '${dataToSet.user_name}'` : true;
    // dataToSet.user_email ? setData += `, user_email = '${dataToSet.user_email}'` : true;
    console.log(`UPDATE users SET ${setData} where 1 ${conditions}`);
    dbConfig.getDB().query(`UPDATE users SET ${setData} where 1 ${conditions}`, callback);
}
let updateUserPhoto = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    criteria.user_id ? conditions += ` and user_id = '${criteria.user_id}'` : true;
    dataToSet.user_image ? setData += `user_image = '${dataToSet.user_image}'` : true;
    console.log(`UPDATE users SET ${setData} where 1 ${conditions}`);
    dbConfig.getDB().query(`UPDATE users SET ${setData} where 1 ${conditions}`, callback);
}
module.exports = {
    loginUser: loginUser,
    getUser: getUser,
    createUser: createUser,
    createVerifycode: createVerifycode,
    checkVerifycode: checkVerifycode,
    checkResetToken: checkResetToken,
    deleteUser: deleteUser,
    updateUser: updateUser,
    removeVerifyCode: removeVerifyCode,
    getUserDetail: getUserDetail,
    updateUserPassword: updateUserPassword,
    updateUserPasswordByToken: updateUserPasswordByToken,
    updateUserResetToken: updateUserResetToken,
    updateUserEmail: updateUserEmail,
    updateUserPhoto: updateUserPhoto,
    updateUserVerified: updateUserVerified
}