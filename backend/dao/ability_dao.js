let dbConfig = require("../models/dbconnection");
const bcrypt = require('bcrypt');
const saltRounds = 10;

let getAbility = (criteria, callback) => {
    //criteria.ability_id ? conditions += ` and ability_id = '${criteria.ability_id}'` : true;
    dbConfig.getDB().query(`select * from ability where 1`, criteria, callback);
}

let getAbilities = (criteria, callback) => {
    const query = "SELECT * FROM abilities WHERE 1 AND (ability_state='public' or ability_state='private') and ability_userid = " + criteria.ability_userid + " ORDER BY ability_id ASC";
    dbConfig.getDB().query(query, criteria, callback);
}

let loginAbility = (criteria, callback) => {
    let conditions = 'SELECT * FROM `abilities` WHERE `email` = ?';
    let values = [criteria.user_email]
    dbConfig.getDB().query(conditions, values, callback);
}

let getAbilityDetail = (criteria, callback) => {
    const query = "SELECT * FROM ability_details WHERE 1 and ad_abilityid = '" + criteria.ad_abilityid + "' ORDER BY ad_abilityid ASC";
    dbConfig.getDB().query(query, callback);
}

let getAbilityById = (criteria, callback) => {
    const query = "SELECT * FROM abilities WHERE 1 and ability_id = '" + criteria.ability_id + "'";
    dbConfig.getDB().query(query, callback);
}

let createAbility = (dataToSet, callback) => {
    var sql = 'INSERT INTO abilities SET ?';
    var values = {
        'ability_name': dataToSet.ability_name, 'ability_image': dataToSet.ability_image, 'ability_userid': dataToSet.ability_userid,
        'ability_skillid': dataToSet.ability_skillid, 'ability_tags': dataToSet.ability_tags, 'ability_state': dataToSet.ability_state + ''
    };
    // Use the connection
    dbConfig.getDB().query(sql, values, callback);
}

let createAbilityDetails = (dataToSet, callback) => {
    var sql = 'INSERT INTO ability_details SET ?';
    var values = {
        'ad_abilityid': dataToSet.ad_abilityid, 'ad_title': dataToSet.ad_title, 'ad_description': dataToSet.ad_description,
        'ad_tags': dataToSet.ad_tags
    };
    // Use the connection
    dbConfig.getDB().query(sql, values, callback);
}

let updateAbility = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    criteria.ability_id ? conditions += ` and ability_id = '${criteria.ability_id}'` : true;
    dataToSet.ability_name ? setData += `ability_name = '${dataToSet.ability_name}'` : true;
    dataToSet.ability_image ? setData += `, ability_image = '${dataToSet.ability_image}'` : true;
    dataToSet.ability_userid ? setData += `, ability_userid = '${dataToSet.ability_userid}'` : true;
    dataToSet.ability_skillid ? setData += `, ability_skillid = '${dataToSet.ability_skillid}'` : true;
    dataToSet.ability_tags ? setData += `, ability_tags = '${dataToSet.ability_tags}'` : true;
    setData += `, ability_state = '${dataToSet.ability_state + ''}'`
    // dataToSet.ability_state ? setData += `, ability_state = '${dataToSet.ability_state}'` : true;
    dbConfig.getDB().query(`UPDATE abilities SET ${setData} where 1 ${conditions}`, callback);
}

let updateAbilityDetails = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    criteria.ad_id ? conditions += ` and ad_id = '${criteria.ad_id}'` : true;
    dataToSet.ad_abilityid ? setData += `ad_abilityid = '${dataToSet.ad_abilityid}'` : true;
    dataToSet.ad_title ? setData += `, ad_title = '${dataToSet.ad_title}'` : true;
    dataToSet.ad_description ? setData += `, ad_description = '${dataToSet.ad_description}'` : true;
    dataToSet.ad_tags ? setData += `, ad_tags = '${dataToSet.ad_tags}'` : true;
    dbConfig.getDB().query(`UPDATE ability_details SET ${setData} where 1 ${conditions}`, callback);
}

let deleteAbility = (criteria, callback) => {
    let conditions = "";
    criteria.id ? conditions += ` and id = '${criteria.id}'` : true;
    console.log(`delete from abilities where 1 ${conditions}`);
    dbConfig.getDB().query(`delete from abilities where 1 ${conditions}`, callback);
}

let deleteAbilityDetailsById = (criteria, dataToSet, callback) => {
    let conditions = "";
    criteria.ad_id ? conditions += ` and ad_id = '${criteria.ad_id}'` : true;
    dbConfig.getDB().query(`delete from ability_details where 1 ${conditions}`, callback);
}

let deleteAbilityById = (criteria, dataToSet, callback) => {
    let conditions = "";
    criteria.ability_id ? conditions += ` and ability_id = '${criteria.ability_id}'` : true;
    dbConfig.getDB().query(`delete from abilities where 1 ${conditions}`, callback);
}

let searchAbilitiesWithKey = (criteria, callback) => {
    let conditions = "";
    let orConditions = "";
    let tags_array = criteria.ability_tags.split(',');
    i = 0;

    criteria.ability_userid ? conditions += ` and ability_userid = ${criteria.ability_userid}` : true;
    criteria.ability_skillid ? conditions += ` and ability_skillid = ${criteria.ability_skillid}` : true;
    // criteria.ability_userid ? orConditions += ` or skill_userid = ${criteria.ability_userid}` : true;
    if (!criteria.ability_tags.trim()) {
        conditions += " and (ability_state='public' or ability_state='private')";
    } else {
        tags_array.forEach(tag_name => {
            if (tag_name.toLowerCase() == 'private') {
                conditions += ` and ability_state = 'private'`;
                orConditions += ` and skill_state = 'private'`;
                tag_name = '';
                i = 1;
            } else if (tag_name.toLowerCase() == 'me') {
                conditions += ` and ability_state = 'public'`;
                orConditions += ` and skill_state = 'public'`;
                tag_name = '';
                i = 1;
            } else {
                if (i == 0) {
                    i = 1;
                }
            }
            tag_name ? conditions += ` and ability_tags LIKE '%${tag_name}%'` : true;
            tag_name ? orConditions += ` or skill_name LIKE '%${tag_name}%'` : true;
        });
    }
    console.log(`select abilities.*, skills.* from abilities LEFT JOIN skills ON abilities.ability_skillid = skills.skill_id where 1 ${conditions} ${orConditions}`);
    dbConfig.getDB().query(`select abilities.*, skills.* from abilities LEFT JOIN skills ON abilities.ability_skillid = skills.skill_id where 1 ${conditions} ${orConditions}`, callback);
}

let searchAbilitiesWithoutSkillid = (criteria, callback) => {
    let conditions = "";
    let orConditions = "";
    let tags_array = criteria.ability_tags.split(',');
    i = 0;

    criteria.ability_userid ? conditions += ` and ability_userid = ${criteria.ability_userid}` : true;
    // orConditions += ` or (`;
    // criteria.ability_userid ? orConditions += ` or skill_userid = ${criteria.ability_userid}` : true;
    if (!criteria.ability_tags.trim()) {
        conditions += " and (ability_state='public' or ability_state='private')";
    } else {
        tags_array.forEach(tag_name => {
            if (tag_name.toLowerCase() == 'private') {
                conditions += ` and ability_state = 'private'`;
                // orConditions += ` skill_state = 'private'`;
                tag_name = '';
                i = 1;
            } else if (tag_name.toLowerCase() == 'me') {
                conditions += ` and ability_state = 'public'`;
                // orConditions += ` skill_state = 'public'`;
                tag_name = '';
                i = 1;
            } else {
                if (i == 0) {
                    i = 1;
                }
            }
            tag_name ? conditions += ` and ability_tags LIKE '%${tag_name}%'` : true;
            tag_name ? orConditions += ` or skill_name LIKE '%${tag_name}%'` : true;
        });
    }
    // orConditions += ` )`;
    console.log(`select abilities.*, skills.* from abilities LEFT JOIN skills ON abilities.ability_skillid = skills.skill_id where 1 ${conditions} ${orConditions}`);
    dbConfig.getDB().query(`select abilities.*, skills.* from abilities LEFT JOIN skills ON abilities.ability_skillid = skills.skill_id where 1 ${conditions} ${orConditions}`, callback);
}
module.exports = {
    loginAbility: loginAbility,
    getAbility: getAbility,
    createAbility: createAbility,
    createAbilityDetails: createAbilityDetails,
    deleteAbility: deleteAbility,
    updateAbility: updateAbility,
    updateAbilityDetails: updateAbilityDetails,
    getAbilityById: getAbilityById,
    getAbilityDetail: getAbilityDetail,
    getAbilities: getAbilities,
    searchAbilitiesWithKey: searchAbilitiesWithKey,
    searchAbilitiesWithoutSkillid: searchAbilitiesWithoutSkillid,
    deleteAbilityDetailsById: deleteAbilityDetailsById,
    deleteAbilityById: deleteAbilityById
}