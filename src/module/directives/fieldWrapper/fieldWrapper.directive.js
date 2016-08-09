(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('fieldWrapper',fieldWrapper);

    fieldWrapper.$inject = ['$templateCache','FieldBuilder','configData','$timeout','RestApiService'];

    function fieldWrapper($templateCache,FieldBuilder,configData,$timeout,RestApiService){
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
            elem.on('$destroy', function () {
                scope.$destroy();
            });

            $timeout(function () {
                elem.addClass("field-wrapper-" + scope.field.type);
            },0);

            var entityObject = RestApiService.getEntityObject();

            if(scope.parentField){
                angular.forEach(entityObject.tabs, function (tab) {
                    angular.forEach(tab.fields, function (field) {
                        if(field.name == scope.parentField){
                            angular.forEach(field.fields, function (innerField) {
                                if(innerField.name == scope.fieldName){
                                    scope.field = innerField;
                                    return;
                                }
                            });
                        }
                    });
                });
            } else {
                angular.forEach(entityObject.tabs, function (tab) {
                    angular.forEach(tab.fields, function (field) {
                        if(field.name == scope.fieldName){
                            scope.field = field;
                            return;
                        }
                    });
                });
            }

            elem.append(new FieldBuilder(scope).build());
        }
    }
})();