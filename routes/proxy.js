var express = require('express');
var router = express.Router();
var cache = require('../middlewares/localStorage');
var constants = require("../constants");

const SERVICE_NAME = 'service_name';
const API_NAME = 'api_name';

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('This is a Serivce Gateway Demo!');
});

router.all('/services', function(req, res, next) {
    console.log(cache.getItem(constants.ROUTE_KEY))
    var serviceName = req.headers[SERVICE_NAME];
    var apiName = req.headers[API_NAME];
    console.log(serviceName);
    console.log(apiName);
    console.log(req.method);
    console.log(req.query);
    console.log(req.body);
    res.send(req.query);
});

module.exports = router;