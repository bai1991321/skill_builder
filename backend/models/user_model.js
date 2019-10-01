// const pool = require('./dbconnection');
let dbConnection = require('./dbconnection');

let initialize = () => {
    dbConnection.getDB().query("create table IF NOT EXISTS user (\
            id INT auto_increment primary key,\
            name VARCHAR(45),\
            email VARCHAR(45),\
            password VARCHAR(256)\
        )"
    );
}

module.exports = {
    initialize: initialize
}