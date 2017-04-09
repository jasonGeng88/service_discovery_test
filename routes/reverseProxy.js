var proxy = require('http-proxy').createProxyServer({});
var loadbalance = require('loadbalance')
var cache = require('../middlewares/localStorage');
var constants = require("../constants");

function reverseProxy(req, res, next){
    var serviceName = req.headers[constants.SERVICE_NAME];
    var apiName = req.headers[constants.API_NAME];
    var serviceNode = constants.SERVICE_ROOT_PATH + '/' + serviceName;
    var addresses = cache.getItem(constants.ROUTE_KEY)[serviceNode];
    console.log(addresses);

    var host = cache.getItem(constants.LOAD_BALANCE_KEY)[serviceNode].pick();
    console.log(host);
    var url = 'http://' + host + '/' + apiName;
    proxy.web(req, res, { target: url});

}

module.exports = reverseProxy;