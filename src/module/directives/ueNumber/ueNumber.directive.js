(function () {
    'use strict';

    /**
     * @desc number-type field.
     * @example <ue-number></ue-number>
     */
    angular
        .module('universal.editor')
        .directive('ueNumber',ueNumber);

    ueNumber.$inject = ['$templateCache'];

    function ueNumber($templateCache){
        return {
            restrict : 'E',
            replace : true,
            scope : {
                field: "=",
                setError: "=",
                setErrorEmpty: "=",
                errorIndexOf: "=",
                parentField: "=",
                parentFieldIndex: "="
            },
            template : $templateCache.get('module/directives/ueNumber/ueNumber.html'),
            controller: 'UeNumberController',
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