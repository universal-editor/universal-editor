(function () {
    'use strict';

    var ueComponent = {
        bindings : {
            setting: '<',
            options: '='
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueComponent/ueComponent.html');
        }],
        controller: 'UeComponentController',
        controllerAs : 'vm'
    };

    /**
     * @desc component-type field.
     * @example <ue-component></ue-component>
     */
    angular
        .module('universal.editor')
        .component('ueComponent',ueComponent);
})();