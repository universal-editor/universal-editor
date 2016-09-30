(function () {
    'use strict';

    var buttonWrapper = {
        bindings : {
            setting : '=',
            entityId: '@',
            buttonClass: '@'
        },
        template : ['$templateCache', function($templateCache) {
            return $templateCache.get('module/components/buttonWrapper/buttonWrapper.html');
        }],
        controller: 'ButtonWrapperController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('buttonWrapper',buttonWrapper);
})();
