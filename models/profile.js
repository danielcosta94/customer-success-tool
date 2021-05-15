var mongoose = require('mongoose');

var Role = require('../models/role');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

// Profile Schema
const ProfileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    phone: {
        type: String,
    },
    roles: [{
        type: ObjectId,
        index: true,
    }]
});

let Profile = module.exports = mongoose.model('Profile', ProfileSchema);

module.exports.createProfile = function(newProfile, callback){
    newProfile.save(callback);
};

module.exports.deleteProfileByID = function(id, callback){
    Profile.remove({_id: id}, callback);
};

module.exports.updateProfileByID = function(id, newProfile, callback){
    Profile.update({_id: id}, newProfile, callback);
};

module.exports.getAllProfiles = function(callback) {
    Profile.find(callback);
};

module.exports.getAllProfilesIDByPositionType = function(role_type, callback) {
    Role.getRoleByDescription(role_type, function (err, role) {
        if (role) {
            Profile.find({roles: role.id}, function (err, profiles) {
                let profiles_ids_list = [];

                for(let i = 0; i < profiles.length; i++) {
                    profiles_ids_list.push(profiles[i].id);
                }

                callback(null, profiles_ids_list);
            });
        } else {
            callback(null);
        }
    });
};

module.exports.getProfileByID = function(id, callback){
    Profile.findById(id, callback);
};

module.exports.getProfilesByName = function(name, callback){
    Profile.find({name: name}, callback);
};

module.exports.getProfileByEmail = function(email, callback){
    Profile.findOne({email: email}, callback);
};

module.exports.getProfilesByRoleID = function(role_id, callback){
    Profile.find({role: role_id}, callback);
};