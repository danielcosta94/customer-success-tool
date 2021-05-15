var mongoose = require('mongoose');

// Role Schema
const RoleSchema = mongoose.Schema({
    description: {
        type: String,
        index: true,
        unique: true
    },
});

let Role = module.exports = mongoose.model('Role', RoleSchema);

module.exports.createRole = function(newRole, callback) {
    newRole.save(callback);
};

module.exports.deleteRoleByID = function(id, callback){
    Role.remove({_id: id}, callback);
};

module.exports.updateRoleByID = function(id, newRole, callback){
    Role.update({_id: id}, newRole, callback);
};

module.exports.getAllRoles = function(callback) {
    Role.find(callback);
};

module.exports.getAllRolesID = function(callback) {
    Role.find(function (err, roles) {
        let rolesList = [];

        for(let i = 0; i < roles.length; i++) {
            rolesList.push(roles[i].id);
        }
        callback(null, rolesList);
    });
};

module.exports.getRoleByID = function(id, callback){
    Role.findById(id, callback);
};

module.exports.getRoleByDescription = function(description, callback) {
    Role.findOne({description: description}, callback);
};
