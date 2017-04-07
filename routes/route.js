var express = require('express');
var router = express.Router();
var proxy = require('express-http-proxy');
var cache = require('../middlewares/localStorage');
var constants = require("../constants");


const SERVICE_NAME = 'service_name';
const API_NAME = 'api_name';

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('This is a Serivce Gateway Demo!');
});

router.all('/proxy', proxy('www.baidu.com', {
    forwardPath: function(req) {
        console.log(require('url').parse(req.url).path);
        return 'http://127.0.0.1:32805';
        // return require('url').parse(req.url).path;
    }
}));

router.all('/services', function(req, res, next) {
    console.log(cache.getItem(constants.ROUTE_KEY))
    var serviceName = req.headers[SERVICE_NAME];
    var apiName = req.headers[API_NAME];
    var serviceNode = constants.SERVICE_ROOT_PATH + '/' + serviceName;
    console.log(serviceName);
    console.log(apiName);
    var addresses = cache.getItem(constants.ROUTE_KEY)[serviceNode];
    //random address
    var idx = Math.floor(Math.random() * addresses.length);
    var address = addresses[idx];
    console.log(address);
    console.log(req.method);
    // console.log(req.query);
    // console.log(req.body);
    // res.send(req.query);
    var proxyRes = proxy('www.baidu.com');
    console.log(proxyRes);
    res.send(proxyRes);

});

function reverse(argument) {
    // body...
}

module.exports = router;