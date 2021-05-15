var express = require('express');
var router = express.Router();

var Account = require('../models/account');
var Profile = require('../models/profile');
var Role = require('../models/role');

// GET All Profiles
router.get('/', function (req, res) {
    Profile.getAllProfiles(function (err, profiles) {
        if (!err) {
            res.status(200).json({profiles: profiles});
        } else {
            res.status(500).json({errors: [{msg: err.toString()}]});
        }
    })
});

// POST Create Profile
router.post('/', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const roles_selected_list = req.body.roles;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();

    const errors = req.validationErrors();

    if (!errors) {
        Role.getAllRolesID(function (err, roles_ids) {
            let areRolesSelectedValid = true;

            for(let i = 0; i < roles_selected_list.length && areRolesSelectedValid; i++) {
                areRolesSelectedValid = roles_ids.includes(roles_selected_list[i]);
            }

            if (areRolesSelectedValid) {
                const newProfile = new Profile({
                    name: name,
                    email: email,
                    phone: phone,
                    roles: roles_selected_list
                });

                Profile.createProfile(newProfile, function (err, result) {
                    if (!err) {
                        res.status(201).json({message: 'Profile Created'});
                    } else {
                        res.status(500).json({errors: [{msg: err.toString()}]});
                    }
                });
            } else {
                res.status(400).json({errors: [{msg: 'There are invalid roles selected'}]});
            }
        });
    } else {
        res.status(500).json({errors: errors});
    }
});

// GET Get Profile By ID
router.get('/:id', function (req, res) {
    const profile_id = req.params.id;

    Profile.getProfileByID(profile_id, function (err, profile) {
        if(profile) {
            res.status(200).json(profile);
        } else {
            res.status(200).json(null);
        }
    });
});

// PUT Update Profile By ID
router.put('/:id', function (req, res) {
    const profile_id = req.params.id;

    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const roles_selected_list = req.body.roles;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();

    const errors = req.validationErrors();

    if (!errors) {
        Profile.getProfileByID(profile_id, function (err, profile) {
            if (profile) {
                Role.getAllRolesID(function (err, roles_ids) {
                    let areRolesSelectedValid = true;

                    for(let i = 0; i < roles_selected_list.length && areRolesSelectedValid; i++) {
                        areRolesSelectedValid = roles_ids.includes(roles_selected_list[i]);
                    }

                    if (areRolesSelectedValid) {
                        const newProfile = {
                            name: name,
                            email: email,
                            phone: phone,
                            roles: roles_selected_list
                        };

                        Profile.updateProfileByID(profile_id, newProfile, function (err, result) {
                            if (!err) {
                                res.status(200).json({message: 'Profile Updated'});
                            } else {
                                res.status(500).json({errors: [{msg: err.toString()}]});
                            }
                        });
                    } else {
                        res.status(400).json({errors: [{msg: 'There are invalid roles selected'}]});
                    }
                });
            } else {
                res.status(400).json({errors: [{msg: 'Profile ID does not exists'}]});
            }
        });
    } else {
        res.status(500).json({errors: [{msg: err.toString()}]});
    }
});

// DELETE Delete Profile By ID
router.delete('/:id', function (req, res) {
    const profile_id = req.params.id;

    Account.getAccountsByProfileID(profile_id, function (err, accounts) {
        if (!err && accounts.length === 0) {
            Profile.deleteProfileByID(profile_id, function (err, result) {
                if (!err) {
                    res.status(200).json({message: 'Profile Deleted'});
                } else {
                    res.status(500).json({errors: [{msg: err.toString()}]});
                }
            });
        } else {
            if (accounts) {
                res.status(400).json({errors: [{msg: 'Profile ID is being used'}]});
            } else {
                res.status(400).json({errors: [{msg: 'Profile ID does not exists'}]});
            }
        }
    });
});

module.exports = router;