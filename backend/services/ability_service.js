let async = require('async');
let parseString = require('xml2js').parseString;
let util = require('../utilities/util');
let abilityDAO = require('../dao/ability_dao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**API to create the ability */
let createAbility = (data, callback) => {
    async.auto({
        ability: (cb) => {
            var dataToSet = {
                "ability_userid": data.ability_userid,
                "ability_name": data.ability_name ? data.ability_name : '',
                "ability_image": data.ability_image ? data.ability_image : '',
                "ability_skillid": data.ability_skillid,
                "ability_tags": data.ability_tags.toString(),
                "ability_state": data.ability_state
            }
            abilityDAO.createAbility(dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": err.message });
                    return;
                }
                dataToSet.ability_id = dbData.insertId;
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DATA_CREATED, "result": dataToSet });
            });
        }
    }, (err, response) => {
        callback(response.ability);
    });
}

let createAbilityDetails = (data, callback) => {
    async.auto({
        abilityDetails: (cb) => {
            var dataToSet = {
                "ad_abilityid": data.ad_abilityid,
                "ad_title": data.ad_title ? data.ad_title : '',
                "ad_description": data.ad_description ? data.ad_description : '',
                "ad_tags": data.ad_tags ? data.ad_tags.toString() : ''
            }
            abilityDAO.createAbilityDetails(dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": err.message });
                    return;
                }
                dataToSet.ad_id = dbData.insertId;
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DATA_CREATED, "result": dataToSet });
            });
        }
    }, (err, response) => {
        callback(response.abilityDetails);
    });
}

/**API to update the ability */
let updateAbility = (data, callback) => {
    async.auto({
        abilityUpdate: (cb) => {
            if (!data.ability_id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                ability_id: data.ability_id,
            }
            var dataToSet = {
                "ability_userid": data.ability_userid,
                "ability_name": data.ability_name ? data.ability_name : '',
                "ability_image": data.ability_image ? data.ability_image : '',
                "ability_skillid": data.ability_skillid,
                "ability_tags": data.ability_tags.toString(),
                "ability_state": data.ability_state
            }
            abilityDAO.updateAbility(criteria, dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                else {
                    dataToSet.ability_id = criteria.ability_id;
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DATA_UPDATED, "result": dataToSet });
                }
            });
        }
    }, (err, response) => {
        callback(response.abilityUpdate);
    });
}

let updateAbilityDetails = (data, callback) => {
    async.auto({
        abilityDetailsUpdate: (cb) => {
            if (!data.ad_id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                ad_id: data.ad_id,
            }
            var dataToSet = {
                "ad_abilityid": data.ad_abilityid,
                "ad_title": data.ad_title ? data.ad_title : '',
                "ad_description": data.ad_description ? data.ad_description : '',
                "ad_tags": data.ad_tags ? data.ad_tags : ''
            }
            abilityDAO.updateAbilityDetails(criteria, dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                else {
                    dataToSet.ad_id = criteria.ad_id;
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DATA_UPDATED, "result": dataToSet });
                }
            });
        }
    }, (err, response) => {
        callback(response.abilityDetailsUpdate);
    });
}

let deleteAbilityById = (data, callback) => {
    async.auto({
        abilityDelete: (cb) => {
            if (!data.ability_id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                ability_id: data.ability_id,
            }
            abilityDAO.deleteAbilityById(criteria, {}, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DELETE_DATA, "result": criteria });
                }
            });
        }
    }, (err, response) => {
        callback(response.abilityDelete);
    });
}
let deleteAbilityDetailsById = (data, callback) => {
    async.auto({
        abilityDetailsUpdate: (cb) => {
            if (!data.ad_id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                ad_id: data.ad_id,
            }
            abilityDAO.deleteAbilityDetailsById(criteria, {}, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DELETE_DATA, "result": criteria });
                }
            });
        }
    }, (err, response) => {
        callback(response.abilityDetailsUpdate);
    });
}

/**API to delete the subject */
let deleteAbility = (data, callback) => {
    console.log(data, 'data to set')
    async.auto({
        removeAbility: (cb) => {
            if (!data.id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                id: data.id,
            }
            abilityDAO.deleteAbility(criteria, (err, dbData) => {
                if (err) {
                    console.log(err);
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DELETE_DATA });
            });
        }
    }, (err, response) => {
        callback(response.removeAbility);
    });
}

/***API to get the ability list */
let getAbility = (data, callback) => {
    async.auto({
        ability: (cb) => {
            abilityDAO.getAbility({}, (err, data) => {
                if (err) {
                    cb(null, { "errorCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, data);
                return;
            });
        }
    }, (err, response) => {
        callback(response.ability);
    })
}

let getAbilities = (data, callback) => {
    async.auto({
        ability: (cb) => {
            let criteria = {
                "ability_userid": data.ability_userid
            }
            abilityDAO.getAbilities(criteria, (err, data) => {
                if (err) {
                    cb(null, { "errorCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, data);
                return;
            })
        }
    }, (err, response) => {
        callback(response.ability);
    });
}


/***API to get the ability detail by id */
let getAbilityById = (data, callback) => {
    async.auto({
        ability: (cb) => {
            let criteria = {
                "ability_id": data.ability_id
            }
            abilityDAO.getAbilityById(criteria, (err, data) => {
                if (err) {
                    cb(null, { "errorCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, data[0]);
                return;
            });
        }
    }, (err, response) => {
        callback(response.ability);
    })
}

let getAbilityDetails = (data, callback) => {
    async.auto({
        ability: (cb) => {
            let criteria = {
                "ad_abilityid": data.ad_abilityid
            }
            abilityDAO.getAbilityDetail(criteria, (err, data) => {
                if (err) {
                    cb(null, { "errorCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, data);
                return;
            });
        }
    }, (err, response) => {
        callback(response.ability);
    })
}
let searchAbilitiesWithKey = (data, callback) => {
    async.auto({
        ability: (cb) => {
            let criteria = {
                "ability_tags": data.tag_name,
                "ability_userid": data.ability_userid,
                "ability_skillid": data.ability_skillid,
            }
            abilityDAO.searchAbilitiesWithKey(criteria, (err, data) => {
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
        callback(response.ability);
    })
}

let searchAbilitiesWithoutSkillid = (data, callback) => {
    async.auto({
        ability: (cb) => {
            let criteria = {
                "ability_tags": data.tag_name,
                "ability_userid": data.ability_userid
            }
            abilityDAO.searchAbilitiesWithoutSkillid(criteria, (err, data) => {
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
        callback(response.ability);
    })
}
module.exports = {
    createAbility: createAbility,
    createAbilityDetails: createAbilityDetails,
    updateAbility: updateAbility,
    updateAbilityDetails: updateAbilityDetails,
    deleteAbility: deleteAbility,
    getAbility: getAbility,
    getAbilityById: getAbilityById,
    getAbilities: getAbilities,
    searchAbilitiesWithKey: searchAbilitiesWithKey,
    searchAbilitiesWithoutSkillid: searchAbilitiesWithoutSkillid,
    getAbilityDetails: getAbilityDetails,
    deleteAbilityDetailsById: deleteAbilityDetailsById,
    deleteAbilityById: deleteAbilityById
};