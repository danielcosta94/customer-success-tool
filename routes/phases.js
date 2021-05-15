var express = require('express');
var router = express.Router();

var Account = require('../models/account');
var Phase = require('../models/phase');

// GET All Phases
router.get('/', function (req, res) {
    Phase.getAllPhases(function (err, phases) {
        if (!err) {
            res.status(200).json({phases: phases});
        } else {
            res.status(500).json({errors: [{msg: err.toString()}]});
        }
    })
});

// POST Create Phase
router.post('/', function (req, res) {
    const description = req.body.description;

    req.checkBody('description', 'Description is required').notEmpty();

    const errors = req.validationErrors();

    if (!errors) {
        const newPhase = new Phase({
            description: description
        });

        Phase.createPhase(newPhase, function (err, result) {
            if (!err) {
                res.status(201).json({message: 'Phase Created'});
            } else {
                res.status(500).json({errors: [{msg: err.toString()}]});
            }
        });
    } else {
        res.status(400).json({errors: errors});
    }
});

// GET Get Phase By ID
router.get('/:id', function (req, res) {
    const phase_id = req.params.id;

    Phase.getPhaseByID(phase_id, function (err, phase) {
        if(phase) {
            res.status(200).json(phase);
        } else {
            res.status(200).json(null);
        }
    });
});

// PUT Update Phase By ID
router.put('/:id', function (req, res) {
    const phase_id = req.params.id;

    const description = req.body.description;

    req.checkBody('description', 'Description is required').notEmpty();

    const errors = req.validationErrors();

    if (!errors) {
        Phase.getPhaseByID(phase_id, function (err, phase) {
            if (phase) {
                const newPhase = {
                    description: description,
                };

                Phase.updatePhaseByID(phase_id, newPhase, function (err, result) {
                    if (!err) {
                        res.status(201).json({message: 'Phase Updated'});
                    } else {
                        res.status(500).json({errors: [{msg: err.toString()}]});
                    }
                });
            } else {
                res.status(400).json({errors: [{msg: 'Phase ID does not exists'}]});
            }
        });
    } else {
        res.status(400).json({errors: errors});
    }
});

// DELETE Delete Phase By ID
router.delete('/:id', function (req, res) {
    const phase_id = req.params.id;

    Account.getAccountsByPhaseID(phase_id, function (err, accounts) {
        if (!err && accounts.length === 0) {
            Phase.deletePhaseByID(phase_id, function (err, result) {
                if (!err) {
                    res.status(200).json({message: 'Phase Deleted'});
                } else {
                    res.status(500).json({errors: [{msg: err.toString()}]});
                }
            });
        } else {
            if (accounts) {
                res.status(400).json({errors: [{msg: 'Phase ID is being used'}]});
            } else {
                res.status(400).json({errors: [{msg: 'Phase ID does not exists'}]});
            }
        }
    });
});

module.exports = router;