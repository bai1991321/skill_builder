let async = require('async');
let util = require('../utilities/util');
let skillDAO = require('../dao/skill_dao');

/**API to create the skill */
let createSkill = (data, callback) => {
    async.auto({
        skill: (cb) => {
            var dataToSet = {
                "skill_name": data.skill_name ? data.skill_name : '',
                "skill_image": data.skill_image ? data.skill_image : '',
                "skill_bgcolor": data.skill_bgcolor,
                "skill_state": data.skill_state,
                'skill_userid': data.skill_userid
            }
            skillDAO.createSkill(dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": err.message });
                    return;
                }
                dataToSet.skill_id = dbData.insertId;
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DATA_CREATED, "result": dataToSet });
            });
        }
    }, (err, response) => {
        callback(response.skill);
    });
}

/**API to update the skill */
let updateSkill = (data, callback) => {
    async.auto({
        skillUpdate: (cb) => {
            if (!data.skill_id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                skill_id: data.skill_id,
            }
            var dataToSet = {
                "skill_name": data.skill_name,
                "skill_image": data.skill_image,
                "skill_bgcolor": data.skill_bgcolor,
                "skill_state": data.skill_state,
                "skill_userid": data.skill_userid
            }
            console.log(data);
            skillDAO.updateSkill(criteria, dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                dataToSet.skill_id = criteria.skill_id;
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DATA_UPDATED, "result": dataToSet });
            });
        }
    }, (err, response) => {
        callback(response.skillUpdate);
    });
}

/**API to delete the subject */
let deleteSkill = (data, callback) => {
    console.log(data, 'data to set')
    async.auto({
        removeSkill: (cb) => {
            if (!data.skill_id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                skill_id: data.skill_id,
            }
            skillDAO.deleteSkill(criteria, (err, dbData) => {
                if (err) {
                    console.log(err);
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }

                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DELETE_DATA });
            });
        }
    }, (err, response) => {
        callback(response.removeSkill);
    });
}

/***API to get the skill list */
let getSkill = (data, callback) => {
    async.auto({
        skill: (cb) => {
            skillDAO.getSkill({}, (err, data) => {
                if (err) {
                    cb(null, { "errorCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, data);
                return;
            });
        }
    }, (err, response) => {
        callback(response.skill);
    })
}

let getSkills = (data, callback) => {
    async.auto({
        product: (cb) => {
            let criteria = {
                "skill_userid" : data.skill_userid ? data.skill_userid : 0
            }
            skillDAO.getSkills(criteria, (err, data) => {
                if (err) {
                    cb(null, { "errorCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, data);
                return;
            })
        }
    }, (err, response) => {
        callback(response.product);
    });
}

/***API to get the skill detail by id */
let getSkillById = (data, callback) => {
    async.auto({
        skill: (cb) => {
            let criteria = {
                "skillId": data.skillId
            }
            skillDAO.getSkillDetail(criteria, (err, data) => {
                if (err) {
                    console.log(err, 'error----');
                    cb(null, { "errorCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, data[0]);
                return;
            });
        }
    }, (err, response) => {
        callback(response.skill);
    })
}
let searchSkillsWithKey = (data, callback) => {
    async.auto({
        skill: (cb) => {
            let criteria = {
                "skill_tags": data.tag_name,
                "skill_userid" : data.skill_userid
            }
            skillDAO.searchSkillsWithKey(criteria, (err, data) => {
                if (err) {
                    cb(null, { "errorCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, data);
                return;
            });
        }
    }, (err, response) => {
        callback(response.skill);
    })
}
let searchAbilitiesWithKey = (data, callback) => {
    async.auto({
        skill: (cb) => {
            let criteria = {
                "skill_tags": data.tag_name,
                "ability_userid" : data.ability_userid,
                "ability_skillid" : data.ability_skillid,
            }
            skillDAO.searchAbilitiesWithKey(criteria, (err, data) => {
                if (err) {
                    cb(null, { "errorCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.SERVER_BUSY });
                    return;
                }
                cb(null, data);
                return;
            });
        }
    }, (err, response) => {
        callback(response.skill);
    })
}

module.exports = {
    createSkill: createSkill,
    updateSkill: updateSkill,
    deleteSkill: deleteSkill,
    getSkill: getSkill,
    getSkillById: getSkillById,
    getSkills: getSkills,
    searchSkillsWithKey: searchSkillsWithKey,
    searchAbilitiesWithKey: searchAbilitiesWithKey
};