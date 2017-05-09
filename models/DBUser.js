var mongoose = require('mongoose'),
    async = require('async'),
    request = require('request');

var dbUserSchema = new mongoose.Schema({
    token: {
        type: String,
        unique: true
    },
    loc: {
        type: [Number],
        index: '2d'
    },
    bfNr: Number
});

dbUserSchema.pre('save', function(next) {
    var dbUser = this;

    async.waterfall([
        function getBfNr(callback) {
            if (dbUser.loc[0] !== '' && dbUser.loc[1]) {
                request('http://54.93.120.139/api/blattspinat/station/' + dbUser.loc[1] + '/' + dbUser.loc[0], function (err, response, body) {
                    if (err) {
                        callback(true);
                        return;
                    }
                    var bf = JSON.parse(body);
                    if (bf === []) {
                        callback(true);
                        return;
                    }
                    dbUser['bfNr'] = bf[0]['bfNr'];
                    callback(null);
                });
            }
        }
    ], function complete(err, status) {
        next();
    });
});

module.exports = mongoose.model('DBUser', dbUserSchema);
