(function () {
    'use strict';

    angular
        .module('ModuleWithService', [])
        .service('JSONAPIApiTypeService', JSONAPITypeService);

    function JSONAPITypeService() {
        var self = this;

        self.getHeaders = function(config) {
            var headers = {};
            headers['Content-Type'] = 'application/vnd.api+json';
            return headers;
        };

        self.getMethod = function(config) {
            var method;
            if (config.action == 'create') {
                method = 'POST';
            }

            if (config.action == 'update') {
                method = 'PATCH';
            }

            if (config.action == 'delete') {
                method = 'DELETE';
            }

            if (config.action == 'list') {
                method = 'GET';
            }

            if (config.action == 'one') {
                method = 'GET';
            }

            return method;
        };

        self.getData = function(config) {
            var data;

            if (config.action == 'create') {
                data = {};
                data.attributes = config.data;
            }

            if (config.action == 'update') {
                data = {};
                data.attributes = config.data;
                data.id = config.data.id;
                delete config.data.id;
            }
            return { data: data };
        };

        self.getParams = function(config) {
            if (config.action == 'list') {
                config.params['per-page'] = 10;
                config.params.page = config.pagination.page;
            }
            return config.params;
        };

        self.getURL = function(config) {
            return config.url;
        };

        //self.processResponse = function(response, succses, fail) {
        //
        //};
    }

})();