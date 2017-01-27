(function () {
    'use strict';

    var componentWrapper = {
        bindings : {
            setting : '=',
            entityId: '@',
            buttonClass: '@',
            options: '='
        },
        controller: 'ComponentWrapperController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('componentWrapper',componentWrapper);
})();
