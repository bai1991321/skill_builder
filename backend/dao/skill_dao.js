let dbConfig = require("../models/dbconnection");
const bcrypt = require('bcrypt');
const saltRounds = 10;

let getSkills = (criteria, callback) => {
    if (criteria.skill_userid == 0) {
        const query = "SELECT * FROM skills where skill_state = 'public' or skill_userid = 0";
        dbConfig.getDB().query(query, callback);
    } else {
        const query = "SELECT * FROM skills where (skill_state = 'public' or skill_state='private') AND skill_userid = '" + criteria.skill_userid + "'";
        console.log("query:", query);
        dbConfig.getDB().query(query, callback);
    }
}

let getSkillDetail = (criteria, callback) => {
    let conditions = "";
    criteria.skillId ? conditions += ` and skill_id = '${criteria.skillId}'` : true;
    console.log(`select * from skills where 1 ${conditions}`);
    dbConfig.getDB().query(`select * from skills where 1 ${conditions}`, callback);
}

let searchSkillsWithKey = (criteria, callback) => {
    let conditions = "";
    let tags_array = criteria.skill_tags.split(',');
    let i = 0;
    // first, check whether userid exist or not.    
    if (!criteria.skill_userid || criteria.skill_userid == 0) { // if skill_user not exist,
        conditions = "and skill_state = 'public' and skill_userid = 0";
        if (criteria.skill_tags) {
            tags_array.forEach(tag_name => {
                tag_name ? conditions += ` and skill_name LIKE '%${tag_name}%'` : true;
            });
        }
    } else { // if skill_user exist,
        if (!criteria.skill_tags) {
            conditions = "and (skill_state='public' or skill_userid = 0) or (skill_userid='" + criteria.skill_userid + "')";
        } else {
            tags_array.forEach(tag_name => {
                if (tag_name.toLowerCase() == 'private') {
                    conditions += ` and skill_state='private' and skill_userid=${criteria.skill_userid}`;
                    tag_name = '';
                    if (i = 0) i = 1;
                } else if (tag_name.toLowerCase() == 'me') {
                    conditions += ` and (skill_state='private' or skill_state = 'public') and skill_userid=${criteria.skill_userid}`;
                    tag_name = '';
                    if (i = 0) i = 1;
                } else {
                    if (i = 0) {
                        conditions += " and skill_state='public'";
                        i = 1;
                    }
                }
                conditions += ` and skill_name LIKE '%${tag_name}%'`
            });

        }
    }

    console.log(`select * from skills where 1 ${conditions}`);
    dbConfig.getDB().query(`select * from skills where 1 ${conditions}`, callback);
}

let searchAbilitiesWithKey = (criteria, callback) => {
    let conditions = "";
    let orConditions = "";
    let tags_array = criteria.skill_tags.split(',');
    let i = 0;
    // first, check whether userid exist or not.    
    if (criteria.ability_userid) { // if skill_user exist,
        if (!criteria.skill_tags) {
            conditions = "and ability_userid='" + criteria.ability_userid + "' AND ability_skillid='" + criteria.ability_skillid + "'";
        } else {
            tags_array.forEach(tag_name => {
                if (tag_name.toLowerCase() == 'me' || tag_name.toLowerCase() == 'private') {

                    tag_name = '';
                    i = 1;
                } else {
                    if (i = 0) {
                        conditions += " and ability_state='public'";
                        i = 1;
                    }
                }
                tag_name ? conditions += ` and ability_tags LIKE '%${tag_name}%'` : true;
                tag_name ? orConditions += ` or skill_name LIKE '%${tag_name}%'` : true;
            });
            conditions += ` and ability_state='private' and ability_userid=${criteria.ability_userid}`;
            // orConditions += ` and skill_state='private' and skill_userid = ${criteria.ability_userid}`;
            orConditions += ` and skill_userid = ${criteria.ability_userid}`;
        }
        console.log(`select abilities.*, skills.* from abilities LEFT JOIN skills ON abilities.ability_skillid = skills.skill_id where 1 ${conditions} ${orConditions}`);
        dbConfig.getDB().query(`select abilities.* from abilities LEFT JOIN skills ON abilities.ability_skillid = skills.skill_id where 1 ${conditions} ${orConditions}`, callback);
    }

}
let createSkill = (dataToSet, callback) => {
    var sql = 'INSERT INTO skills SET ?';
    var values = { 'skill_name': dataToSet.skill_name, 'skill_image': dataToSet.skill_image, 'skill_bgcolor': dataToSet.skill_bgcolor, 'skill_state': dataToSet.skill_state, 'skill_userid': dataToSet.skill_userid };
    console.log(">>>>>>>>>", values);
    // Use the connection
    dbConfig.getDB().query(sql, values, callback);
}

let deleteSkill = (criteria, callback) => {
    let conditions = "";
    criteria.skill_id ? conditions += ` and skill_id = '${criteria.skill_id}'` : true;
    console.log("delete from skills where 1 " + conditions);
    dbConfig.getDB().query("delete from skills where 1 " + conditions, callback);

}

let updateSkill = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    console.log(dataToSet.skill_userid);
    criteria.skill_id ? conditions += " skill_id = " + criteria.skill_id : true;
    dataToSet.skill_name ? setData += "skill_name = '" + dataToSet.skill_name + "'" : true;
    dataToSet.skill_image ? setData += ", skill_image = '" + dataToSet.skill_image + "'" : true;
    dataToSet.skill_bgcolor ? setData += ", skill_bgcolor = '" + dataToSet.skill_bgcolor + "'" : true;
    dataToSet.skill_state ? setData += ", skill_state = '" + dataToSet.skill_state + "'" : true;
    dataToSet.skill_userid ? setData += ", skill_userid = " + dataToSet.skill_userid + "" : true;
    dbConfig.getDB().query("UPDATE skills SET " + setData + " where " + conditions + "", callback);
}
module.exports = {
    getSkills: getSkills,
    createSkill: createSkill,
    deleteSkill: deleteSkill,
    updateSkill: updateSkill,
    getSkillDetail: getSkillDetail,
    searchSkillsWithKey: searchSkillsWithKey,
    searchAbilitiesWithKey: searchAbilitiesWithKey
}