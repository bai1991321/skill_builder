let dbConfig = require("../models/dbconnection");

let getTag = (criteria, callback) => {
    dbConfig.getDB().query(`select * from tags where 1`, criteria, callback);
}

let getTags = (criteria, callback) => {
    const query = "SELECT tag_id, tag_name FROM tags ORDER BY tag_id DESC";
    dbConfig.getDB().query(query, criteria, callback);
}

let getTagById = (criteria, callback) => {
    const query = "SELECT * FROM tags WHERE 1 and tag_id = '" + criteria.tag_id + "'";
    dbConfig.getDB().query(query, callback);
}

let createTag = (dataToSet, callback) => {
    var sql = 'INSERT INTO tags SET ?';
    var values = { 'tag_name': dataToSet.tag_name };
    // Use the connection
    dbConfig.getDB().query(sql, values, callback);
}

let updateTag = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    criteria.tag_id ? conditions += ` and tag_id = '${criteria.tag_id}'` : true;
    dataToSet.tag_name ? setData += `tag_name = '${dataToSet.tag_name}'` : true;;
    dbConfig.getDB().query(`UPDATE tags SET ${setData} where 1 ${conditions}`, callback);
}

let deleteTag = (criteria, callback) => {
    let conditions = "";
    criteria.tag_id ? conditions += ` and tag_id = '${criteria.tag_id}'` : true;
    dbConfig.getDB().query(`delete from tags where 1 ${conditions}`, callback);
}

let searchTagsWithKey = (criteria, callback) => {
    let conditions = "";
    criteria.tag_tags ? conditions += ` and tag_tags LIKE '%${criteria.tag_tags}%'` : true;
    dbConfig.getDB().query(`select * from tags where 1 ${conditions}`, callback);
}
module.exports = {
    getTag: getTag,
    createTag: createTag,
    deleteTag: deleteTag,
    updateTag: updateTag,
    getTagById: getTagById,
    getTags: getTags,
    searchTagsWithKey: searchTagsWithKey
}