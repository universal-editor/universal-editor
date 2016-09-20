(function () {
    'use strict';

    /**
     * @desc String-type field.
     * @example <ue-date></ue-date>
     */
    angular
        .module('universal.editor')
        .directive('ueDate',ueDate);

    ueDate.$inject = ['$templateCache'];

    function ueDate($templateCache){
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
            template : $templateCache.get('module/directives/ueDate/ueDate.html'),
            controller: 'UeDateController',
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