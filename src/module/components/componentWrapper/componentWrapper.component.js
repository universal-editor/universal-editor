(function () {
    'use strict';
    //var $ = require('jquery');

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
