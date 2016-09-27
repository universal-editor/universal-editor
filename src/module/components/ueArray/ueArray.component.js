(function () {
    'use strict';


    var ueArray = {
        bindings : {
            field: "=",
            setError: "=",
            setEmpty: "=",
            errorIndexOf: "=",
            parentField: "=",
            parentFieldIndex: "="
        },
        transclude : true,
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueArray/ueArray.html');
        }],
        controller: 'UeArrayController',
        controllerAs : 'vm'
    };
    /**
     * @desc Array-type field.
     * @example <ue-array></ue-array>
     */
    angular
        .module('universal.editor')
        .component('ueArray',ueArray);
})();