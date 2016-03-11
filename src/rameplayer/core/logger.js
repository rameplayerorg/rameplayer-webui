/**
 * RamePlayer WebUI
 * Copyright (C) 2016
 *
 * See LICENSE.
 */

/**
 * Logger Service
 * @namespace Factories
 */
(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .factory('logger', logger);

    logger.$inject = ['$log', 'dataService'];

    /**
     * @namespace logger
     * @desc Wrapper for logging system
     * @memberof Factories
     */
    function logger($log, dataService) {
        var level = {
            DEBUG: 'DEBUG',
            INFO: 'INFO',
            WARNING: 'WARNING',
            ERROR: 'ERROR'
        };

        var service = {
            log: log,
            info: info,
            warn: warn,
            error: error,
            debug: debug
        };

        return service;

        ////////////////////

        function log() {
            send(level.INFO, arguments);
            /* jshint validthis:true */
            return $log.log.apply(this, arguments);
        }

        function info() {
            send(level.INFO, arguments);
            /* jshint validthis:true */
            return $log.info.apply(this, arguments);
        }

        function warn() {
            send(level.WARNING, arguments);
            /* jshint validthis:true */
            $log.warn.apply(this, arguments);
        }

        function error() {
            send(level.ERROR, arguments);
            /* jshint validthis:true */
            $log.error.apply(this, arguments);
        }

        function debug() {
            send(level.DEBUG, arguments);
            /* jshint validthis:true */
            $log.debug.apply(this, arguments);
        }

        function send(lvl, args) {
            var message = argsToString(args);
            dataService.writeLog(lvl, message);
        }

        function argsToString(args) {
            var str = '';
            for (var i = 0; i < args.length; i++) {
                if (i > 0) {
                    str += ' ';
                }
                if (typeof args[i] === 'object') {
                    str += angular.toJson(args[i], true);
                }
                else {
                    str += String(args[i]);
                }
            }
            return str;
        }
    }
})();
