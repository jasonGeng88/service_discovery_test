"use strict";

var zookeeper = require('node-zookeeper-client');
var cache = require('./localStorage');
var constants = require('../constants')

var client = zookeeper.createClient(constants.ZK_HOSTS);
cache.setItem(constants.ROUTE_KEY, {});

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
            cache.getItem(constants.ROUTE_KEY)[path] = children;

        }
    );
}

module.exports.start = start;