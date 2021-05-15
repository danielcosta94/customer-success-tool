var express = require('express');
var router = express.Router();

var constants = require('../constants');

var Account = require('../models/account');
var Phase = require('../models/phase');
var Product = require('../models/product');
var Profile = require('../models/profile');
var Task = require('../models/task');

// GET All Accounts
router.get('/', function (req, res) {
    Account.getAllAccounts(function (err, accounts) {
        if (!err) {
            res.status(200).json({accounts: accounts});
        } else {
            res.status(500).json({errors: err});
        }
    });
});

// POST Create Account
router.post('/', function (req, res) {
    const products_selected_list = req.body.products;
    const name = req.body.name;
    const owner = req.body.owner;
    const renewal_date = req.body.renewal_date;
    const license = req.body.license;
    const arr = req.body.arr;
    const phase_id = req.body.phase_id;
    const csm_id = req.body.csm_id;
    const sales_manager_id = req.body.sales_manager_id;
    const contact_person = req.body.contact_person;
    const address = req.body.address;
    const website = req.body.website;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('owner', 'Owner Name is required').notEmpty();
    req.checkBody('renewal_date', 'Renewal Date is required').isISO8601();
    req.checkBody('phase_id', 'Phase is required').notEmpty();
    req.checkBody('phase_id', 'Phase ID has to be a string').isString();
    req.checkBody('license', 'License ID has to be an positive integer').isInt({gt: 1});
    req.checkBody('arr', 'Accounting Rate of Return has to be an integer').isInt();
    req.checkBody('csm_id', 'Customer Success Manager is required').notEmpty();
    req.checkBody('csm_id', 'Customer Success Manager ID has to be a string').isString();
    req.checkBody('sales_manager_id', 'Sales Manager is required').notEmpty();
    req.checkBody('sales_manager_id', 'Sales Manager ID has to be a string').isString();
    req.checkBody('contact_person', 'Contact Person Name is required').notEmpty();
    req.checkBody('address', 'Address is required').notEmpty();
    req.checkBody('website', 'Website is not valid').isURL();

    const errors = req.validationErrors();

    if (!errors) {
        Product.getAllProducts(function (err, products) {
            if (!err && products) {
                Product.getLicenseByID(license, function (error, licenseObject) {
                    if (!err && licenseObject) {
                        Phase.getAllPhasesID(function (err, phasesList) {
                            if (!err && phasesList.includes(phase_id)) {
                                Profile.getAllProfilesIDByPositionType(constants.CSM, function (err, csmList) {
                                    if (!err && csmList.includes(csm_id)) {
                                        Profile.getAllProfilesIDByPositionType(constants.SM, function (err, salesManagerList) {
                                            if (!err && salesManagerList.includes(sales_manager_id)) {
                                                let areProductsSelectValid = true;

                                                let productsListIDs = [];
                                                for(let i = 0; i < products.length; i++) {
                                                    productsListIDs.push(products[i].id);
                                                }

                                                for(let i = 0; i < products_selected_list.length && areProductsSelectValid; i++) {
                                                    areProductsSelectValid = productsListIDs.includes(products_selected_list[i]);
                                                }

                                                let today = new Date();
                                                today.setMonth(today.getMonth() + 1);

                                                let licenses = [];
                                                for(let i = 0; i < products_selected_list.length; i++) {
                                                    const newLicense = {
                                                        product_id: products_selected_list[i],
                                                        accept_date: today,
                                                        renewal_date: renewal_date,
                                                        notification_date: null,
                                                    };
                                                    licenses.push(newLicense);
                                                }

                                                if (areProductsSelectValid) {
                                                    const newAccount = new Account({
                                                        name: name,
                                                        owner: owner,
                                                        address: address,
                                                        license: license,
                                                        arr: arr,
                                                        phase_id: phase_id,
                                                        csm_id: csm_id,
                                                        sales_manager_id: sales_manager_id,
                                                        contacts: {
                                                            contact_person: contact_person,
                                                            website: website
                                                        },
                                                        licenses: licenses,
                                                    });

                                                    Account.createAccount(newAccount, function (err, result) {
                                                        if (!err) {
                                                            res.status(201).json({message: 'Account Created'});
                                                        } else {
                                                            res.status(500).json({errors: [{msg: err.toString()}]});
                                                        }
                                                    });
                                                } else {
                                                    res.status(400).json({errors: [{msg: "One or more products selected are invalid"}]});
                                                }
                                            } else {
                                                res.status(400).json({errors: [{msg: "Sales Manager ID does not exist"}]});
                                            }
                                        });
                                    } else {
                                        res.status(400).json({errors: [{msg: "Customer success manager ID does not exist"}]});
                                    }
                                });
                            } else {
                                res.status(400).json({errors: [{msg: "There are no phases in the database"}]});
                            }
                        });
                    } else {
                        res.status(400).json({errors: [{msg: "There license already exists"}]});
                    }
                });
            } else {
                res.status(500).json({errors: [{msg: "There are no products in the database"}]});
            }
        });
    } else {
        res.status(500).json({errors: errors});
    }
});

// GET Get Details Account By ID
router.get('/:id', function (req, res) {
    const account_id = req.params.id;

    Account.getAccountByID(account_id, function (err, account) {
        if (account) {
            res.status(200).json(account);
        } else {
            res.status(200).json(null);
        }
    });
});

/* :TODO more info needed
// PUT Update Account By ID
router.put('/:id', function (req, res) {
});
*/

// DELETE Delete Account By ID
router.delete('/:id', function (req, res) {
    const account_id = req.params.id;
    Account.deleteAccountByID(account_id, function (err, result) {

        if (!err) {
            Task.deleteTasksByAccountID(account_id, function (err, result) {
                if (!err) {
                    res.status(200).json({message: 'Account Deleted'});
                } else {
                    res.status(500).json({errors: err.toString()});
                }
            });
        } else {
            res.status(400).json({errors: [{msg: 'Account ID does not exist'}]});
        }
    });
});

module.exports = router;