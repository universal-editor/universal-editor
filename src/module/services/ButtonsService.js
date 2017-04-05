(function() {
    'use strict';

    angular
        .module('universal-editor')
        .service('ButtonsService', ButtonsService);

    function ButtonsService($window) {
        'ngInject';
        var self = this;
        self.getCallback = getCallback;

        function getCallback(name) {
            if (!name) {
                return name;
            }
            var callback = name.split('.');
            return $window[callback[0]][callback[1]];
        }
    }
})();
