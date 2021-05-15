var mongoose = require('mongoose');

// Phase Schema
const PhaseSchema = mongoose.Schema({
    description: {
        type: String,
        index: true,
        unique: true
    }
});

let Phase = module.exports = mongoose.model('Phase', PhaseSchema);

module.exports.createPhase = function(newPhase, callback){
    newPhase.save(callback);
};

module.exports.deletePhaseByID = function(id, callback){
    Phase.remove({_id: id}, callback);
};

module.exports.updatePhaseByID = function(id, newPhase, callback){
    Phase.update({_id: id}, newPhase, callback);
};

module.exports.getAllPhases = function(callback) {
    Phase.find(callback);
};

module.exports.getAllPhasesID = function(callback) {
    Phase.find(function (err, phases) {
        let phasesList = [];

        for(let i = 0; i < phases.length; i++) {
            phasesList.push(phases[i].id);
        }
        callback(null, phasesList);
    });
};

module.exports.getPhaseByID = function(id, callback){
    Phase.findById(id, callback);
};

module.exports.getPhaseByCode = function(description, callback){
    Phase.findOne({description: description}, callback);
};