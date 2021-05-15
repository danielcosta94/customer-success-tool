var express = require('express');
var router = express.Router();

var Profile = require('../models/profile');
var Role = require('../models/role');

// GET All Roles
router.get('/', function (req, res) {
    Role.getAllRoles(function (err, roles) {
        if (!err) {
            res.status(200).json({roles: roles});
        } else {
            res.status(500).json({errors: [{msg: err.toString()}]});
        }
    })
});

// POST Create Role
router.post('/', function (req, res) {
    const description = req.body.description;
    req.checkBody('description', 'Description is required').notEmpty();

    const errors = req.validationErrors();

    if (!errors) {
        const newRole = new Role({
            description: description
        });

        Role.createRole(newRole, function (err, result) {
            if (!err) {
                res.status(201).json({message: 'Role Created'});
            } else {
                res.status(500).json({errors: [{msg: err.toString()}]});
            }
        });
    } else {
        res.status(400).json({errors: errors});
    }
});

// GET Get Role By ID
router.get('/:id', function (req, res) {
    const role_id = req.params.id;

    Role.getRoleByID(role_id, function (err, role) {
        if(role) {
            res.status(200).json(role);
        } else {
            res.status(200).json(null);
        }
    });
});

// PUT Update Role By ID
router.put('/:id', function (req, res) {
    const role_id = req.params.id;

    const description = req.body.description;

    req.checkBody('description', 'Description is required').notEmpty();

    const errors = req.validationErrors();

    if (!errors) {
        Role.getRoleByID(role_id, function (err, role) {
            if (role) {
                const newRole = {
                    description: description,
                };

                Role.updateRoleByID(role_id, newRole, function (err, result) {
                    if (!err) {
                        res.status(201).json({message: 'Role Updated'});
                    } else {
                        res.status(500).json({errors: [{msg: err.toString()}]});
                    }
                });
            } else {
                res.status(400).json({errors: [{msg: 'Role ID does not exists'}]});
            }
        });
    } else {
        res.status(400).json({errors: errors});
    }
});

// DELETE Delete Role By ID
router.delete('/:id', function (req, res) {
    const role_id = req.params.id;

    Profile.getProfilesByRoleID(role_id, function (err, profiles) {
        if(!err && profiles.length === 0) {
            Role.deleteRoleByID(role_id, function (err, result) {
                if (!err) {
                    res.status(200).json({message: 'Role Deleted'});
                } else {
                    res.status(500).json({errors: [{msg: err.toString()}]});
                }
            });
        } else {
            if (profiles) {
                res.status(400).json({errors: [{msg: 'Role ID is being used'}]});
            } else {
                res.status(400).json({errors: [{msg: 'Role ID does not exists'}]});
            }
        }
    });

});

module.exports = router;