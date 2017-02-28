(function () {
    'use strict';

    var ueDropdown = {
         bindings : {
            setting: '<',
            options: '='
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueDropdown/ueDropdown.html');
        }],
        controller: 'UeDropdownController',
        controllerAs : 'vm'
    };

    /**
     * @desc Select-type field.
     * @example <ue-dropdown></ue-dropdown>
     */
    angular
        .module('universal-editor')
        .component('ueDropdown',ueDropdown);
})();