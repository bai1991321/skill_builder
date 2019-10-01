const express = require('express');
const bodyParser = require('body-parser');
router = express.Router();

util = require('../utilities/util');
skillService = require('../services/skill_service');

// create application/json parser
const jsonParser = bodyParser.json();

/**Api to create skill */
router.post('/add-skill', jsonParser, (req, res) => {
    skillService.createSkill(req.body, (data) => {
        res.send(data);
    });
});

// /**Api to update skill */
router.post('/update-skill', jsonParser, (req, res) => {
    skillService.updateSkill(req.body, (data) => {
        res.send(data);
    });
});

// /**Api to delete the skill */
router.post('/delete-skill', jsonParser, (req, res) => {
    skillService.deleteSkill(req.body, (data) => {
        res.send(data);
    });
});

/**Api to get the list of skill */
router.post('/get-skills', jsonParser, (req, res) => {
    skillService.getSkills(req.body, (data) => {
        res.send(data);
    });
});
router.post('/get-skill', jsonParser, (req, res) => {
    skillService.getSkillById(req.body, (data) => {
        res.send(data);
    });
});

// /**API to get the skill by id... */
router.get('/get-skill-by-id', jsonParser, (req, res) => {
    skillService.getSkillById(req.query, (data) => {
        res.send(data);
    });
});
router.post('/search-skills', jsonParser, (req, res) => {
    skillService.searchSkillsWithKey(req.body , (data) => {
        res.send(data);
    });
});
router.post('/search-abilities', jsonParser, (req, res) => {
    skillService.searchAbilitiesWithKey(req.body , (data) => {
        res.send(data);
    });
});

module.exports = router;