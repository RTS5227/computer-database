/**
 * Created by saber on 4/6/14.
 */
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
    value('version', '0.1').constant('myConfig', {
        HOST: 'http://localhost:5984',
        METHOD: 'GET',
        USER_DB: '_users',
        USER_PREFIX: 'org.couchdb.user:',
        APP_DB: 'db',
        APP_VIEW: 'computer',
        PAGE_SIZE: 10
    }).service('$sb', function (cornercouch, myConfig) {
        var self = this;

        self.couch = self.couch || {};
        self.util = self.util || {};

        self.couch.server = cornercouch(myConfig.HOST, myConfig.METHOD);

        self.couch.db = self.couch.server.getDB(myConfig.APP_DB);

        self.couch.view = function (view, opts, cb) {
            self.couch.db.query(myConfig.APP_VIEW, view, opts).error(self.util.log).success(cb);
        }

        self.util.flash = self.util.flash || (function () {
            var flash = {};
            return {
                put: function (status, data) {
                    flash = {status: status, data: data};
                },
                get: function () {
                    return flash;
                },
                remove: function () {
                    flash = {};
                }
            }
        })();

        self.util.log = function (data, status) {
            console.error("Error: %s (%i)", JSON.stringify(data), status);
        }
    })