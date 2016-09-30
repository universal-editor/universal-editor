(function () {
    'use strict';

    var fieldWrapper = {
        bindings : {
            setting: '='
            //parentField : '@',
            //parentFieldIndex : '@'
        },
        template : ['$templateCache', function($templateCache) {
            return $templateCache.get('module/components/fieldWrapper/fieldWrapper.html');
        }],
        controller: 'FieldWrapperController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('fieldWrapper',fieldWrapper);
})();