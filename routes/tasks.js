var express = require('express');
var router = express.Router();

var constants = require('../constants');

var Account = require('../models/account');
var Profile = require('../models/profile');
var Task = require('../models/task');
var TaskStatus = require('../models/task_status');

// GET All Tasks
router.get('/', function (req, res) {
    Task.getAllTasks(function (err, tasks) {
        if (!err) {
            res.status(200).json({tasks: tasks});
        } else {
            res.status(500).json({errors: err.toString()});
        }
    })
});

// POST Create Task
router.post('/', function (req, res) {
    const account_id = req.body.account_id;
    const name = req.body.name;
    const csm_id = req.body.csm_id;
    const description = req.body.description;

    req.checkBody('account_id', 'Account ID is required').notEmpty();
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('csm_id', 'Customer Success Manager is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();

    const errors = req.validationErrors();

    if (!errors) {
        Account.getAccountByID(account_id, function (err, account) {
            if (!err && account) {
                Profile.getAllProfilesIDByPositionType(constants.CSM, function (err, csmList) {
                    if (!err && csmList.includes(csm_id)) {
                            TaskStatus.getTaskStatusByDescription(constants.PLANNED, function (err, task_status) {
                                if (!err) {
                                    const newTask = new Task({
                                        account_id: account_id,
                                        csm_id: csm_id,
                                        name: name,
                                        description: description,
                                        task_status_id: task_status.id,
                                    });

                                    Task.createTask(newTask, function (err, result) {
                                        if (!err) {
                                            res.status(201).json({message: 'Task Created'});
                                        } else {
                                            res.status(500).json({errors: err.toString()});
                                        }
                                    });
                                } else {
                                    res.status(500).json({errors: [{msg: err.toString()}]});
                                }
                            });
                        } else {
                            res.status(400).json({errors: [{msg: "Customer success manager ID does not exist"}]});
                        }
                });
            } else {
                res.status(400).json({errors: [{msg: 'Account ID does not exist'}]});
            }
        });
    } else {
        res.status(400).json({errors: errors});
    }
});

// GET Get Task By ID
router.get('/:id', function (req, res) {
    const task_id = req.params.id;

    Task.getTaskByID(task_id, function (err, task) {
        if (!err) {
            res.status(200).json(task);
        } else {
            res.status(500).json(err);
        }
    });
});

// PUT Update Task By ID
router.put('/:id', function (req, res) {
    const task_id = req.params.id;

    const task_status_id = req.body.task_status_id;
    const name = req.body.name;
    const csm_id = req.body.csm_id;
    const description = req.body.description;

    req.checkBody('task_status_id', 'Task Status ID is required').notEmpty();
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('csm_id', 'Customer Success Manager is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();

    const errors = req.validationErrors();

    if (!errors) {
        Task.getTaskByID(task_id, function (err, task) {
            if (!err && task) {
                Profile.getAllProfilesIDByPositionType(constants.CSM, function (err, csmList) {
                    if (!err && csmList.includes(csm_id)) {
                        TaskStatus.getTaskStatusByID(task_status_id, function (err, task_status) {
                            if (!err && task_status) {
                                const newTaskData = {
                                    csm_id: csm_id,
                                    name: name,
                                    description: description,
                                    task_status_id: task_status_id,
                                };

                                Task.updateTaskByID(task_id, newTaskData, function (err, result) {
                                    if (!err) {
                                        res.status(201).json({message: 'Task Updated'});
                                    } else {
                                        res.status(500).json({errors: err.toString()});
                                    }
                                });
                            } else {
                                res.status(400).json({errors: [{msg: 'Task Status ID does not exists'}]});
                            }
                        });
                    } else {
                        res.status(400).json({errors: [{msg: 'Customer Success Manager ID does not exists'}]});
                    }
                });
            } else {
                res.status(400).json({errors: [{msg: 'Task ID does not exists'}]});
            }
        });
    } else {
        res.status(400).json({errors: errors});
    }
});

// DELETE Delete Task By ID
router.delete('/:id', function (req, res) {
    const task_id = req.params.id;

    Task.getTaskByID(task_id, function (err, task) {
        if (!err && task) {
            Task.deleteTaskByID(task_id, function (err, result) {
                if (!err) {
                    res.status(200).json({message: 'Task Deleted'});
                } else {
                    res.status(500).json({errors: err.toString()});
                }
            })
        } else {
            res.status(400).json({errors: [{msg: 'Task ID does not exist'}]});
        }
    });
});

module.exports = router;