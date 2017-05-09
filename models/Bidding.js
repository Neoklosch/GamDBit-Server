var mongoose = require('mongoose');

var biddingSchema = new mongoose.Schema({
    dbUserNr: String,
    trainId: Number,
    estimatedDelay: Number,
    realDelay: Number
});

module.exports = mongoose.model('Bidding', biddingSchema);
