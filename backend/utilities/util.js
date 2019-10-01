// Define Error Codes
let statusCode = {
    OK: 200,
    FOUR_ZERO_FOUR: 404,
    FOUR_ZERO_THREE: 403,
    FOUR_ZERO_ONE: 401,
    FIVE_ZERO_ZERO: 500
};

// Define Error Messages
let statusMessage = {
    SERVER_BUSY: 'Our Servers are busy. Please try again later.',
    TOKEN_ERROR: 'Token not created.',
    MAIL_SEND_ERROR: 'Send mail error.',
    NO_USER_WITH_TOKEN:'We were unable to find a user for this token.',    
    ALREADY_VERIFY:'This user has already been verified.',
    MAIL_SENT: 'Mail sent successfully. Please Check your mail.',
    INVALID_TOKEN: 'We were unable to find a valid token. Your token my have expired.',
    USERID_NOTFOUND: 'User Id not found.',
    INCORRECT_EMAIL: 'Incorrect Email.',
    INCORRECT_PASSWORD: 'Incorrect Password.',
    AUTH_SUCCESS: 'Authenticated successfully.',
    DATA_UPDATED: 'Data updated successfully.',
    DATA_CREATED: 'Data created successfully.',
    DELETE_DATA: 'Delete data successfully',
    DUPLICATE_MAIL: 'The mail is duplicated.',

};

module.exports = {
    statusCode: statusCode,
    statusMessage: statusMessage
}