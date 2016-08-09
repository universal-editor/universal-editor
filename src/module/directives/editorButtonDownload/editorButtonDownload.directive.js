(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonDownload',editorButtonDownload);

    editorButtonDownload.$inject = ['$templateCache','RestApiService','configData'];

    function editorButtonDownload($templateCache,RestApiService,configData){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonDownload/editorButtonDownload.html'),
            scope : {
                itemValue : "=",
                buttonLabel : "@",
                buttonRequest : "@",
                index: "@",
                buttonClass: "@"
            },
            controller : 'EditorButtonDownloadController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            scope.editor = RestApiService.getEntityType();
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
