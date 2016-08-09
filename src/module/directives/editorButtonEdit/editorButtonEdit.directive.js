(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonEdit',editorButtonEdit);

    editorButtonEdit.$inject = ['$templateCache','RestApiService'];

    function editorButtonEdit($templateCache,RestApiService){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonEdit/editorButtonEdit.html'),
            scope : {
                entityId : "@",
                buttonLabel : "@",
                buttonRequest : "@",
                entitySubtype : "@"
            },
            controller : 'EditorButtonEditController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, editorCtrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();