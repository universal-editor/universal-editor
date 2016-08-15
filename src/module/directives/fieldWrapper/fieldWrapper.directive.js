(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('fieldWrapper',fieldWrapper);

    fieldWrapper.$inject = ['$templateCache','FieldBuilder','configData','$timeout'];

    function fieldWrapper($templateCache,FieldBuilder,configData,$timeout){
        return {
            restrict : 'A',
            replace : true,
            scope : {
                fieldName : '@',
                parentField : '@',
                parentFieldIndex : '@'
            },
            template : $templateCache.get('module/directives/fieldWrapper/fieldWrapper.html'),
            controller: 'FieldWrapperController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            var element = elem.find('.field-element');
            elem.on('$destroy', function () {
                scope.$destroy();
            });

            $timeout(function () {
                element.addClass("field-wrapper-" + scope.field.type);
            },0);

            element.append(new FieldBuilder(scope).build());
        }
    }
})();