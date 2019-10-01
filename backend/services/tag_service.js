let async = require('async');
let parseString = require('xml2js').parseString;
let util = require('../utilities/util');
let tagDAO = require('../dao/tag_dao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**API to create the tag */
let createTag = (data, callback) => {
    async.auto({
        tag: (cb) => {
            var dataToSet = {
                "tag_name": data.tag_name ? data.tag_name : ''
            }
            tagDAO.createTag(dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": err.message });
                    return;
                }
                dataToSet.tag_id = dbData.insertId;
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DATA_CREATED, "result": dataToSet });
            });
        }
    }, (err, response) => {
        callback(response.tag);
    });
}

/**API to update the tag */
let updateTag = (data, callback) => {
    async.auto({
        tagUpdate: (cb) => {
            if (!data.tag_id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                tag_id: data.tag_id,
            }
            var dataToSet = {
                "tag_name": data.tag_name ? data.tag_name : ''
            }
            tagDAO.updateTag(criteria, dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                else {
                    dataToSet.tag_id = criteria.tag_id;
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DATA_UPDATED, "result": dataToSet });
                }
            });
        }
    }, (err, response) => {
        callback(response.tagUpdate);
    });
}

/**API to delete the subject */
let deleteTag = (data, callback) => {
    console.log(data, 'data to set')
    async.auto({
        removeTag: (cb) => {
            if (!data.id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                id: data.id,
            }
            tagDAO.deleteTag(criteria, (err, dbData) => {
                if (err) {
                    console.log(err);
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DELETE_DATA });
            });
        }
    }, (err, response) => {
        callback(response.removeTag);
    });
}

/***API to get the tag list */
let getTag = (data, callback) => {
    async.auto({
        tag: (cb) => {
            tagDAO.getTag({}, (err, data) => {
                if (err) {
                    cb(null, { "errorCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, data);
                return;
            });
        }
    }, (err, response) => {
        callback(response.tag);
    })
}

let getTags = (data, callback) => {
    async.auto({
        tag: (cb) => {
            tagDAO.getTags({}, (err, data) => {
                if (err) {
                    cb(null, { "errorCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, data);
                return;
            })
        }
    }, (err, response) => {
        callback(response.tag);
    });
}


/***API to get the tag detail by id */
let getTagById = (data, callback) => {
    async.auto({
        tag: (cb) => {
            let criteria = {
                "tag_id": data.tag_id
            }
            tagDAO.getTagById(criteria, (err, data) => {
                if (err) {
                    cb(null, { "errorCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, data[0]);
                return;
            });
        }
    }, (err, response) => {
        callback(response.tag);
    })
}

let searchTagsWithKey = (data, callback) => {
    async.auto({
        tag: (cb) => {
            let criteria = {
                "tag_tags": data.tag_name
            }
            tagDAO.searchTagsWithKey(criteria, (err, data) => {
                if (err) {
                    console.log(err, 'error----');
                    cb(null, { "errorCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, data);
                return;
            });
        }
    }, (err, response) => {
        callback(response.tag);
    })
}

module.exports = {
    createTag: createTag,
    updateTag: updateTag,
    deleteTag: deleteTag,
    getTag: getTag,
    getTagById: getTagById,
    getTags: getTags,
    searchTagsWithKey: searchTagsWithKey
};