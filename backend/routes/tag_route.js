const express = require('express');
const bodyParser = require('body-parser');
router = express.Router();
util = require('../utilities/util');
tagService = require('../services/tag_service');

// create application/json parser
const jsonParser = bodyParser.json();

/**Api to get the list of tag */
router.get('/get-tags', jsonParser, (req, res) => {
    tagService.getTags(req.query, (data) => {
        res.send(data);
    });
});
/**Api to create tag */
router.post('/add-tag', jsonParser, (req, res) => {
    tagService.createTag(req.body, (data) => {
        res.send(data);
    });
});
// /**Api to update tag */
router.put('/update-tag', jsonParser, (req, res) => {
    tagService.updateTag(req.body, (data) => {
        res.send(data);
    });
});
// /**Api to delete the tag */
router.delete('/delete-tag', jsonParser, (req, res) => {
    tagService.deleteTag(req.query, (data) => {
        res.send(data);
    });
});
// /**API to get the tag by id... */
router.post('/get-tag-by-id', jsonParser, (req, res) => {
    tagService.getTagById(req.body, (data) => {
        res.send(data);
    });
});
router.post('/search-tags', jsonParser, (req, res) => {
    tagService.searchTagsWithKey(req.body, (data) => {
        res.send(data);
    });
});

module.exports = router;