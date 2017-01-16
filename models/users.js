var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var configs = require('../setup/configs.json');

var url = configs.mongodb_uri;

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    db.close();
});