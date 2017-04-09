"use strict";

var zookeeper = require('node-zookeeper-client');
var loadbalance = require('loadbalance')
var cache = require('./localStorage');
var constants = require('../constants')

var client = zookeeper.createClient(constants.ZK_HOSTS);
cache.setItem(constants.ROUTE_KEY, {});
cache.setItem(constants.LOAD_BALANCE_KEY, {});

function start() {
    client.connect();

    client.once('connected', function() {
        console.log('Connected to ZooKeeper.');
        getServices(constants.SERVICE_ROOT_PATH);
    });
}

function getServices(path) {
    client.getChildren(
        path,
        function (event) {
            console.log('Got watcher event: %s', event);
            getServices(constants.SERVICE_ROOT_PATH);
        },
        function(error, children, stat) {
            if (error) {
                console.log(
                    'Failed to list children of %s due to: %s.',
                    path,
                    error
                );
                return;
            }

            children.forEach(function(item) {
                getService(path + '/' + item);
            })

        }
    );
}

function getService(path) {
    client.getChildren(
        path,
        null,
        function(error, children, stat) {
            if (error) {
                console.log(
                    'Failed to list children of %s due to: %s.',
                    path,
                    error
                );
                return;
            }
            if (children.length > 0){
                cache.getItem(constants.ROUTE_KEY)[path] = children;
                cache.getItem(constants.LOAD_BALANCE_KEY)[path] = loadbalance.roundRobin(children);
            }

        }
    );
}

module.exports.start = start;