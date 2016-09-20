(function () {
    'use strict';

    /**
     * @desc Array-type field.
     * @example <ue-array></ue-array>
     */
    angular
        .module('universal.editor')
        .directive('ueArray',ueArray);

    ueArray.$inject = ['$templateCache'];

    function ueArray($templateCache){
        return {
            restrict : 'E',
            replace : true,
            scope : {
                field: "=",
                setError: "=",
                setEmpty: "=",
                errorIndexOf: "=",
                parentField: "=",
                parentFieldIndex: "="
            },
            transclude : true,
            template : $templateCache.get('module/directives/ueArray/ueArray.html'),
            controller: 'UeArrayController',
            controllerAs : 'vm',
            link : link,
            bindToController: true
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();