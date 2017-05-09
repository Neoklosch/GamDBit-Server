var mongoose = require('mongoose');

var trainSchema = new mongoose.Schema({
    trainNr: String,
    arrivingTime: Date,
    bfNr: Number
});

module.exports = mongoose.model('Train', trainSchema);
