(function () {
    'use strict';

    var ueGrid = {
        bindings : {
            setting: '<',
            options: '='
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueGrid/ueGrid.html');
        }],
        controller: 'UeGridController',
        controllerAs : 'vm'
    };
    angular
        .module('universal.editor')
        .component('ueGrid',ueGrid);
})();