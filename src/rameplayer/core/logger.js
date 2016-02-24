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
            DEBUG: 'debug',
            INFO: 'info',
            WARNING: 'warning',
            ERROR: 'error'
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
            send('', arguments);
            return $log.log.apply(this, arguments);
        }

        function info() {
            send(level.INFO, arguments);
            return $log.info.apply(this, arguments);
        }

        function warn() {
            send(level.WARNING, arguments);
            $log.warn.apply(this, arguments);
        }

        function error() {
            send(level.ERROR, arguments);
            $log.error.apply(this, arguments);
        }

        function debug() {
            send(level.DEBUG, arguments);
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
