(function () {
    'use strict';


    var ueGroup = {
        bindings : {
            setting: '<',
            options: '='
        },
        transclude : true,
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueGroup/ueGroup.html');
        }],
        controller: 'UeGroupController',
        controllerAs : 'vm'
    };
    /**
     * @desc Array-type field.
     * @example <ue-group></ue-group>
     */
    angular
        .module('universal.editor')
        .component('ueGroup',ueGroup);
})();