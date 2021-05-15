var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

// Account Schema
const AccountSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    license: {
        type: Number,
        index: true,
        unique: true,
        required: true
    },
    arr: {
        type: Number,
        required: true
    },
    phase_id: {
        type: ObjectId,
        index: true,
        required: true
    },
    csm_id: {
        type: ObjectId,
        index: true,
        required: true
    },
    sales_manager_id: {
        type: ObjectId,
        index: true,
        required: true
    },
    licenses: [{
        product_id: {
            type: ObjectId,
            index: true,
            required: true,
            unique: true
        },
        accept_date: {
            type: Date,
            required: true
        },
        renewal_date: {
            type: Date,
            required: true
        },
        notification_date: {
            type: Date
        }
    }],
    contacts: {
        contact_person: {
            type: String,
            required: true
        },
        website: {
            type: String
        }
    }
});

let Account = module.exports = mongoose.model('Account', AccountSchema);

module.exports.createAccount = function(newAccount, callback){
    newAccount.save(callback);
};

module.exports.deleteAccountByID = function(id, callback){
    Account.remove({_id: id}, callback);
};

module.exports.updateAccountByID = function(id, newAccount, callback){
    Account.update({_id: id}, newAccount, callback);
};

module.exports.getAllAccounts = function(callback) {
    Account.find(callback);
};

module.exports.getAccountByID = function(id, callback){
    Account.findById(id, callback);
};

module.exports.getAccountsByPhaseID = function(phase_id, callback){
    Account.find({phase_id: phase_id}, callback);
};

module.exports.getAccountsByProfileID = function(profile_id, callback) {
    Account.find({$or: [{csm_id: profile_id}, {sales_manager_id: profile_id}]}, callback);
};

module.exports.getAccountsByProductID = function(product_id, callback) {
    Account.find({"licenses.product_id": product_id}, callback);
};