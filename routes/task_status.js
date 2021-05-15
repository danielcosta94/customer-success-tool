var express = require('express');
var router = express.Router();

var Task = require('../models/task');
var TaskStatus = require('../models/task_status');

// GET All TaskStatus
router.get('/', function (req, res) {
    TaskStatus.getAllTaskStatus(function (err, task_status) {
        if (!err) {
            res.status(200).json({task_status: task_status});
        } else {
            res.status(500).json({errors: [{msg: err.toString()}]});
        }
    })
});

// POST Create TaskStatus
router.post('/', function (req, res) {
    const description = req.body.description;
    req.checkBody('description', 'Description is required').notEmpty();

    const errors = req.validationErrors();

    if (!errors) {
        const newTaskStatus = new TaskStatus({
            description: description
        });

        TaskStatus.createTaskStatus(newTaskStatus, function (err, result) {
            if (!err) {
                res.status(201).json({message: 'Task Status Created'});
            } else {
                res.status(500).json({errors: [{msg: err.toString()}]});
            }
        });
    } else {
        res.status(400).json({errors: errors});
    }
});

// GET Get TaskStatus By ID
router.get('/:id', function (req, res) {
    const task_status_id = req.params.id;

    TaskStatus.getTaskStatusByID(task_status_id, function (err, task_status) {
        if(task_status) {
            res.status(200).json(task_status);
        } else {
            res.status(200).json(null);
        }
    });
});

// PUT Update TaskStatus By ID
router.put('/:id', function (req, res) {
    const task_status_id = req.params.id;

    const description = req.body.description;

    req.checkBody('description', 'Description is required').notEmpty();

    const errors = req.validationErrors();

    if (!errors) {
        TaskStatus.getTaskStatusByID(task_status_id, function (err, task_status) {
            if (task_status) {
                const newTaskStatus = {
                    description: description,
                };

                TaskStatus.updateTaskStatusByID(task_status_id, newTaskStatus, function (err, result) {
                    if (!err) {
                        res.status(201).json({message: 'Task Status Updated'});
                    } else {
                        res.status(500).json({errors: [{msg: err.toString()}]});
                    }
                });
            } else {
                res.status(400).json({errors: [{msg: 'Task Status ID does not exists'}]});
            }
        });
    } else {
        res.status(400).json({errors: errors});
    }
});

// DELETE Delete TaskStatus By ID
router.delete('/:id', function (req, res) {
    const task_status_id = req.params.id;

    Task.getTasksByTaskStatusID(task_status_id, function (err, tasks) {
        if (!err && tasks.length === 0) {
            TaskStatus.deleteTaskStatusByID(task_status_id, function (err, result) {
                if (!err) {
                    res.status(200).json({message: 'Task Status Deleted'});
                } else {
                    res.status(500).json({errors: [{msg: err.toString()}]});
                }
            });
        } else {
            if (tasks) {
                res.status(400).json({errors: [{msg: 'Task Status ID is being used'}]});
            } else {
                res.status(400).json({errors: [{msg: 'Task Status ID does not exists'}]});
            }
        }
    });
});

module.exports = router;