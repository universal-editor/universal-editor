(function () {
    'use strict';

    angular
        .module('universal.editor')
        .factory('FieldBuilder',FieldBuilder);

    FieldBuilder.$inject = ['$compile'];

    function FieldBuilder($compile){
        var Field = function (scope) {
            this.scope = scope.$new();
            this.scope.field = scope.field;
        };
        
        Field.prototype.build = function () {
            var element = '<div data-editor-field-' + this.scope.field.type + '=""></div>';

            return $compile(element)(this.scope);
        };

        return Field;
    }
})();