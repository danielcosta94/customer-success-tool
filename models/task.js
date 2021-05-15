var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

// Task Schema
const TaskSchema = mongoose.Schema({
    account_id: {
        type: ObjectId,
        required: true
    },
    csm_id: {
        type: ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    task_status_id: {
        type: ObjectId,
        required: true
    }
});

TaskSchema.index({ account_id: 1, name: 1 }, {unique: true});

let Task = module.exports = mongoose.model('Task', TaskSchema);

module.exports.createTask = function(newTask, callback){
    newTask.save(callback);
};

module.exports.deleteTaskByID = function(id, callback){
    Task.remove({_id: id}, callback);
};

module.exports.deleteTasksByAccountID = function(account_id, callback){
    Task.remove({account_id: account_id}, callback);
};

module.exports.updateTaskByID = function(id, newData, callback){
    Task.update({_id: id}, newData, callback);
};

module.exports.getAllTasks = function(callback) {
    Task.find(callback);
};

module.exports.getTaskByID = function(id, callback){
    Task.findById(id, callback);
};

module.exports.getTaskByAccountID = function(account_id, callback){
    Task.find({account_id: account_id}, callback);
};

module.exports.getTasksByTaskStatusID = function(task_status_id, callback){
    Task.find({task_status_id: task_status_id}, callback);
};