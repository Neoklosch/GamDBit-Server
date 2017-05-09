/**
 * Split into declaration and initialization for better performance.
 */
var validator,
    _ = require('lodash'),
    async = require('async'),
    querystring = require('querystring'),
    secrets = require('../config/secrets'),
    Bidding = require('../models/Bidding'),
    DBUser = require('../models/DBUser'),
    request = require('request'),
    Train = require('../models/Train');

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = function(req, res) {
    res.render('api/index', {
        title: 'API Examples'
    });
};

/**
 * GET /api
 * List of API examples.
 */
exports.postUser = function(req, res) {
    var dbUser = new DBUser({
        token: req.body.token,
        loc: [req.body.lon, req.body.lat]
    });

    dbUser.save(function(err) {
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }
        res.status(200).end();
    });
};

exports.putUser = function(req, res) {
    async.waterfall([
        function getUser(callback) {
            DBUser.findOne({
                token: req.body.token
            }, function(err, dbUser) {
                if (err) {
                    callback(err, 500);
                }
                callback(null, dbUser)
            });
        },
        function parseBodyData(dbUser, callback) {
            var data = {};
            if (req.body.hasOwnProperty('lat') && req.body.hasOwnProperty('lon')) {
                data['loc'] = [req.body.lon, req.body.lat];
            } else {
                callback(true, 400);
                return;
            }
            callback(null, dbUser, data);
        },
        function updateUser(dbUser, data, callback) {
            if (data !== {}) {
                dbUser.update(data, function(err) {
                    if (err) {
                        callback(err, 500);
                        return;
                    }
                    callback(null, 200);
                    return;
                });
            } else {
                callback(true, 400);
            }
        }
    ], function complete(err, status) {
        res.status(status).end();
    });
};

exports.getTrain = function(req, res) {
    Train.find(req.query, function(err, trains) {
        if (err) {
            res.status(500).end();
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(trains));
    });
};

exports.postTrain = function(req, res) {
    var train = new Train({
        trainNr: req.body['trainNr'],
        arrivingTime: req.body['arrivingTime'],
        bfNr: req.body['arrivingTime']
    });

    train.save(function(err) {
        if (err) {
            res.status(500).end();
            return;
        }
        res.status(200).end();
    });
};

exports.postBidding = function(req, res) {
    var bidding = new Bidding({
        dbUserNr: req.body['dbUserNr'],
        trainId: req.body['trainId'],
        estimatedDelay: req.body['estimatedDelay'],
        realDelay: req.body['realDelay'] || -1
    });

    bidding.save(function(err) {
        if (err) {
            res.status(500).end();
            return;
        }
        res.status(200).end();
    });
};

exports.putTrainDelay = function(req, res) {
    Bidding.findOne({
        _id: req.body['_id']
    }, function(err, bidding) {
        if (err) {
            res.status(500).end();
            return;
        }
        if (req.body.hasOwnProperty('realDelay')) {
            res.status(400).end();
            return;
        }
        bidding.update({
            realDelay: req.body['realDelay']
        }, function(err) {
            if (err) {
                res.status(500).end();
                return;
            }
            res.status(200).end();
        });
    });
};

exports.getResult = function(req, res) {
    res.render('api/index', {
        title: 'API Examples'
    });
};
