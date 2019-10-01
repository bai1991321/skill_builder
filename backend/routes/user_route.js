const express = require('express');
const bodyParser = require('body-parser');
router = express.Router();

util = require('../utilities/util');
userService = require('../services/user_service');
const valFunctions = require('../validators/validate');
let mailService = require('../services/mail_service');

// create application/json parser
const jsonParser = bodyParser.json()


router.post('/login', jsonParser, function (req, res) {
    if (valFunctions.checkInputDataNULL(req, res)) return false;
    if (valFunctions.checkInputDataQuality(req, res)) return false;
    //if(valFunctions.checkJWTToken(req,res)) return false;
    //if(valFunctions.checkUserAuthRole(req,res)) return false;
    var url = req.headers.origin;
    userService.loginUser(req.body, (data) => {
        res.send(data);
    })
});

/**Api to create user */
router.post('/create-user', jsonParser, (req, res) => {
    userService.createUser(req, (data) => {
        res.send(data);
    });
});
router.post('/send-verifycode-tomail', jsonParser, (req, res) => {
    userService.SendVerifyCodeToMail(req, (data) => {
        res.send(data);
    });
});
router.post('/send-recovery-password', jsonParser, (req, res) => {
    userService.sendRecoveryPassword(req, (data) => {
        res.send(data);
    });
});
router.post('/confirm-verifycode', jsonParser, (req, res) => {
    userService.ConfirmVerifycode(req, (data) => {
        res.send(data);
    });
});
router.post('/reset-password', jsonParser, (req, res) => {
    userService.resetPassword(req, (data) => {
        res.send(data);
    });
});


// /**Api to update user */
router.put('/update-userpassword', jsonParser, (req, res) => {
    userService.updateUserPassword(req.body, (data) => {
        res.send(data);
    });
});
router.put('/update-useremail', jsonParser, (req, res) => {
    userService.updateUserEmail(req.body, (data) => {
        res.send(data);
    });
});

// /**Api to update user */
router.put('/update-user', jsonParser, (req, res) => {
    userService.updateUser(req.body, (data) => {
        res.send(data);
    });
});
router.put('/update-userphoto', jsonParser, (req, res) => {
    userService.updateUserPhoto(req.body, (data) => {
        res.send(data);
    });
});

// /**Api to delete the user */
router.delete('/delete-user', jsonParser, (req, res) => {
    userService.deleteUser(req.query, (data) => {
        res.send(data);
    });
});

/**Api to get the list of user */
router.get('/get-user', jsonParser, (req, res) => {
    documentService.getUser(req.query, (data) => {
        res.send(data);
    });
});

// /**API to get the user by id... */
router.get('/get-user-by-id', jsonParser, (req, res) => {
    userService.getUserById(req.query, (data) => {
        res.send(data);
    });
});

module.exports = router;

