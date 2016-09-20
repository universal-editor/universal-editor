(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('ueTextarea',ueTextarea);

    ueTextarea.$inject = ['$templateCache'];

    function ueTextarea($templateCache){
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
            template : $templateCache.get('module/directives/ueTextarea/ueTextarea.html'),
            controller: 'UeTextareaController',
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