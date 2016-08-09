(function () {
    'use strict';

    angular
        .module('universal.editor')
        .provider('ConfigDataProvider', ConfigDataProvider);

    ConfigDataProvider.$inject = ['configData'];
    function ConfigDataProvider(configData){
        return {
            getDefaultEntity: function(){
                return configData.entities[0].name;
            },
            $get: ['$q',function($q) {
                var deferred = $q.defer();
                deferred.resolve(configData);
                return deferred;
            }]
        };
    }
})();
