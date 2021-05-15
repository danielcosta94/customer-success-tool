var mongoose = require('mongoose');

// TaskStatus Schema
const TaskStatusSchema = mongoose.Schema({
    description: {
        type: String,
        index: true,
        unique: true
    }
});

let TaskStatus = module.exports = mongoose.model('Task_Statu', TaskStatusSchema);

module.exports.createTaskStatus = function(newTaskStatus, callback){
    newTaskStatus.save(callback);
};

module.exports.deleteTaskStatusByID = function(id, callback){
    TaskStatus.remove({_id: id}, callback);
};

module.exports.updateTaskStatusByID = function(id, newTaskStatus, callback){
    TaskStatus.update({_id: id}, newTaskStatus, callback);
};

module.exports.getAllTaskStatus = function(callback) {
    TaskStatus.find(callback);
};

module.exports.getAllTaskStatusID = function(callback) {
    TaskStatus.find(function (err, task_status) {
        let task_status_list = [];

        for(let i = 0; i < task_status.length; i++) {
            task_status_list.push(task_status[i].id);
        }
        callback(null, task_status_list);
    });
};

module.exports.getTaskStatusByID = function(id, callback){
    TaskStatus.findById(id, callback);
};

module.exports.getTaskStatusByDescription = function(description, callback){
    TaskStatus.findOne({description: description}, callback);
};