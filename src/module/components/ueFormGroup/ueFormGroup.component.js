(function () {
    'use strict';


    var ueFormGroup = {
        bindings : {
            setting: '=',
            options: '='
        },
        transclude : true,
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueFormGroup/ueFormGroup.html');
        }],
        controller: 'UeFormGroupController',
        controllerAs : 'vm'
    };
    /**
     * @desc Array-type field.
     * @example <ue-form-group></ue-form-group>
     */
    angular
        .module('universal.editor')
        .component('ueFormGroup',ueFormGroup);
})();