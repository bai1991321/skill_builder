const express = require('express');
const bodyParser = require('body-parser');
router = express.Router();

util = require('../utilities/util');
abilityService = require('../services/ability_service');
const valFunctions = require('../validators/validate');

// create application/json parser
const jsonParser = bodyParser.json();

/**Api to create ability */
router.post('/add-ability', jsonParser, (req, res) => {
    abilityService.createAbility(req.body, (data) => {
        res.send(data);
    });
});
router.post('/add-ability-details', jsonParser, (req, res) => {
    abilityService.createAbilityDetails(req.body, (data) => {
        res.send(data);
    });
});

// /**Api to update ability */
router.post('/update-ability', jsonParser, (req, res) => {
    abilityService.updateAbility(req.body, (data) => {
        res.send(data);
    });
});
router.post('/update-ability-details', jsonParser, (req, res) => {
    abilityService.updateAbilityDetails(req.body, (data) => {
        res.send(data);
    });
});

// /**Api to delete the ability */
router.delete('/delete-ability', jsonParser, (req, res) => {
    abilityService.deleteAbility(req.query, (data) => {
        res.send(data);
    });
});

router.post('/delete-ability-details-by-id', jsonParser, (req, res) => {
    abilityService.deleteAbilityDetailsById(req.body, (data) => {
        res.send(data);
    });
});

/**Api to get the list of ability */
router.post('/get-abilities', jsonParser, (req, res) => {
    abilityService.getAbilities(req.body, (data) => {
        res.send(data);
    });
});

// /**API to get the ability by id... */
router.post('/get-ability-by-id', jsonParser, (req, res) => {
    abilityService.getAbilityById(req.body, (data) => {
        res.send(data);
    });
});

router.post('/delete-ability-by-id', jsonParser, (req, res) => {
    abilityService.deleteAbilityById(req.body, (data) => {
        res.send(data);
    });
});
router.post('/details', jsonParser, (req, res) => {
    abilityService.getAbilityDetails(req.body, (data) => {
        res.send(data);
    });
});
router.post('/search-abilities', jsonParser, (req, res) => {
    abilityService.searchAbilitiesWithKey(req.body, (data) => {
        res.send(data);
    });
});
router.post('/search-abilities-without-skillid', jsonParser, (req, res) => {
    abilityService.searchAbilitiesWithoutSkillid(req.body, (data) => {
        res.send(data);
    });
});

module.exports = router;