(function () {
    'use strict';

    var componentWrapper = {
        bindings : {
            setting : '=',
            entityId: '@',
            buttonClass: '@',
            scopeIdParent: '@'
        },
        template : ['$templateCache', function($templateCache) {
            return $templateCache.get('module/components/componentWrapper/componentWrapper.html');
        }],
        controller: 'ComponentWrapperController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('componentWrapper',componentWrapper);
})();
