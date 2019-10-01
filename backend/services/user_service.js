let async = require('async'),
    parseString = require('xml2js').parseString;

let util = require('../utilities/util'),
    userDAO = require('../dao/user_dao');
let mailService = require('./mail_service');
let randomGenerator = require('generate-password');

const saltRounds = 10;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let loginUser = (data, callback) => {
    async.auto({
        user: (cb) => {

            var dataToSet = {
                "user_email": data.user_email ? data.user_email : '',
                "user_password": data.user_password,
            }
            userDAO.loginUser(dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }

                if (dbData == "") {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.INCORRECT_EMAIL });
                    return;
                }
                bcrypt.compare(dataToSet.user_password, dbData[0].user_password, function (err, result) {
                    if (result == true) {
                        var token = jwt.sign({ email: dbData[0].user_email }, process.env.JWT_SECRET, { expiresIn: '30d' });
                        dataToSet.token = token;
                        dbData[0].token = token;

                        // dataToSet.user_id = dbData.user_id;
                        // dataToSet.user
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.AUTH_SUCCESS, "result": dbData[0] });
                    } else {
                        cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.INCORRECT_PASSWORD });
                        return;
                    }
                });
            });
        }
    }, (err, response) => {
        callback(response.user);
    });
}
/**API to create the atricle */
let createUser = (req, callback) => {
    let data = req.body;
    async.auto({
        user: (cb) => {
            var dataToSet = {
                "user_name": data.user_name ? data.user_name : '',
                "user_email": data.user_email ? data.user_email : '',
                "user_password": data.user_password,
            }
            userDAO.createUser(dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.DUPLICATE_MAIL });
                    return;
                }
                var token = jwt.sign({ email: dataToSet.user_email }, process.env.JWT_SECRET, { expiresIn: '30d' });
                dataToSet.token = token;
                dataToSet.user_id = dbData.insertId;
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DATA_CREATED, "result": dataToSet });
            });
        }
    }, (err, response) => {
        callback(response.user);
    });
}

let SendVerifyCodeToMail = (req, callback) => {
    let data = req.body;
    async.auto({
        user: (cb) => {
            var dataToSet = {
                "user_email": data.user_email ? data.user_email : ''
            }
            // create a verification verifycode for this user.
            var verifycode = randomGenerator.generate({ length: 8, numbers: true });
            // save the verification tokenTo
            userDAO.createVerifycode({ user_email: dataToSet.user_email, verifycode: verifycode }, (tokenErr, tokenData) => {
                if (tokenErr) {
                    cb(null, { "statusCode": tokenErr.errno, "statusMessage": tokenErr.sqlMessage });
                    return;
                }
                // mailoptions
                var mailOptions = {
                    from: 'none@reply.com',
                    to: dataToSet.user_email,
                    subject: 'Verifying your mail in Skill Builder',
                    text: 'Verify code:' + verifycode
                };
                // send the email
                mailService.sendMail(mailOptions, function (mailErr) {
                    if (mailErr) {
                        cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.MAIL_SEND_ERROR });
                        return;
                    }
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.MAIL_SENT, "result": dataToSet });
                });
            });
        }
    }, (err, response) => {
        callback(response.user);
    });
}


let sendRecoveryPassword = (req, callback) => {
    let data = req.body;
    async.auto({
        user: (cb) => {
            var dataToSet = {
                "user_email": data.user_email ? data.user_email : '',
                "url": data.url ? data.url : ''
            }
            var resetToken = randomGenerator.generate({ length: 64, numbers: true });
            var criteria = { user_email: data.user_email }
            var updateUserInfo = {
                "resetToken": resetToken
            }
            userDAO.updateUserResetToken(criteria, updateUserInfo, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                // mailoptions
                var mailOptions = {
                    from: 'none@reply.com',
                    to: dataToSet.user_email,
                    subject: 'Password Recovery',
                    text: 'recovery url:' + dataToSet.url + ";resetToken=" + resetToken
                };
                // send the email
                mailService.sendMail(mailOptions, function (mailErr) {
                    if (mailErr) {
                        cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.MAIL_SEND_ERROR });
                        return;
                    }
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.MAIL_SENT, "result": dataToSet });
                });
            });
        }
    }, (err, response) => {
        callback(response.user);
    });
}

let ConfirmVerifycode = (req, callback) => {
    let data = req.body;
    async.auto({
        user: (cb) => {
            var dataToSet = {
                "user_email": data.user_email ? data.user_email : '',
                "verifycode": data.verifyCode ? data.verifyCode : ''
            }
            userDAO.checkVerifycode(dataToSet, (tokenErr, checkData) => {
                if (tokenErr || !checkData.length) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.INVALID_TOKEN });
                    return;
                }
                updateUserInfo = { is_verified: 1 };
                userDAO.updateUserVerified({ user_email: dataToSet.user_email }, updateUserInfo, (updateErr, userInfo) => {
                    if (updateErr) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                        return;
                    }
                    userDAO.removeVerifyCode({ user_email: dataToSet.user_email }, (removeErr, removeinfo) => {
                        if (removeErr) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                            return;
                        }
                    });
                    var token = jwt.sign({ email: dataToSet.user_email }, process.env.JWT_SECRET, { expiresIn: '30d' });

                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.AUTH_SUCCESS, "result": token });
                });
            });
        }
    }, (err, response) => {
        callback(response.user);
    });
}
let resetPassword = (req, callback) => {
    let data = req.body;
    async.auto({
        user: (cb) => {
            var dataToSet = {
                "resetToken": data.resetToken ? data.resetToken : '',
                "password": data.password ? data.password : ''
            }
            userDAO.checkResetToken(dataToSet, (tokenErr, checkData) => {
                if (tokenErr || !checkData.length) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_FOUR, "statusMessage": util.statusMessage.INVALID_TOKEN });
                    return;
                }

                var criteria = {
                    resetToken: data.resetToken,
                }
                bcrypt.hash(dataToSet.password, saltRounds, function (err, hash) {
                    var updatePasswordInfo = { "user_password": hash }
                    userDAO.updateUserPasswordByToken(criteria, updatePasswordInfo, (err, dbData) => {
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                            return;
                        } else {
                            cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DATA_UPDATED, "result": dataToSet });
                        }
                    });
                });
            });
        }
    }, (err, response) => {
        callback(response.user);
    });
}

let updateUserPassword = (data, callback) => {
    async.auto({
        userUpdate: (cb) => {
            if (!data.user_id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.USERID_NOTFOUND })
                return;
            }
            var criteria = {
                user_id: data.user_id,
            }
            bcrypt.hash(data.user_password, saltRounds, function (err, hash) {
                var dataToSet = {
                    "user_password": hash
                }
                userDAO.updateUserPassword(criteria, dataToSet, (err, dbData) => {
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                        return;
                    }
                    else {
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DATA_UPDATED, "result": dataToSet });
                    }
                });
            });
        }
    }, (err, response) => {
        callback(response.userUpdate);
    });
}
let updateUserEmail = (data, callback) => {
    async.auto({
        userUpdate: (cb) => {
            if (!data.user_id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.USERID_NOTFOUND })
                return;
            }
            var criteria = {
                user_id: data.user_id,
            }
            var dataToSet = {
                "user_email": data.user_email
            }
            userDAO.updateUserEmail(criteria, dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DATA_UPDATED, "result": dataToSet });
                }
            });
        }
    }, (err, response) => {
        callback(response.userUpdate);
    });
}
/**API to update the user */
let updateUser = (data, callback) => {
    async.auto({
        userUpdate: (cb) => {
            if (!data.user_id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                user_id: data.user_id,
            }
            var dataToSet = {
                // "user_email": data.user_email,
                "user_name": data.user_name,
            }
            userDAO.updateUser(criteria, dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DATA_UPDATED, "result": dataToSet });
                }
            });
        }
    }, (err, response) => {
        callback(response.userUpdate);
    });
}
let updateUserPhoto = (data, callback) => {
    async.auto({
        userUpdate: (cb) => {
            if (!data.user_id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                user_id: data.user_id,
            }
            var dataToSet = {
                "user_image": data.user_image
            }
            userDAO.updateUserPhoto(criteria, dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DATA_UPDATED, "result": dataToSet });
                }
            });
        }
    }, (err, response) => {
        callback(response.userUpdate);
    });
}

/**API to delete the subject */
let deleteUser = (data, callback) => {
    console.log(data, 'data to set')
    async.auto({
        removeUser: (cb) => {
            if (!data.user_id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                user_id: data.user_id,
            }
            userDAO.deleteUser(criteria, (err, dbData) => {
                if (err) {
                    console.log(err);
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DELETE_DATA });
            });
        }
    }, (err, response) => {
        callback(response.removeUser);
    });
}

/***API to get the user list */
let getUser = (data, callback) => {
    async.auto({
        user: (cb) => {
            userDAO.getUser({}, (err, data) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, data);
                return;
            });
        }
    }, (err, response) => {
        callback(response.user);
    })
}

/***API to get the user detail by id */
let getUserById = (data, callback) => {
    async.auto({
        user: (cb) => {
            let criteria = {
                "user_id": data.user_id
            }
            userDAO.getUserDetail(criteria, (err, data) => {
                if (err) {
                    console.log(err, 'error----');
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, data[0]);
                return;
            });
        }
    }, (err, response) => {
        callback(response.user);
    })
}


module.exports = {
    loginUser: loginUser,
    createUser: createUser,
    SendVerifyCodeToMail: SendVerifyCodeToMail,
    sendRecoveryPassword: sendRecoveryPassword,
    ConfirmVerifycode: ConfirmVerifycode,
    resetPassword: resetPassword,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getUser: getUser,
    getUserById: getUserById,
    updateUserPassword: updateUserPassword,
    updateUserEmail: updateUserEmail,
    updateUserPhoto: updateUserPhoto
};