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
            this.scope.setError = scope.setError;
            this.scope.setEmpty = scope.setEmpty;
            this.scope.errorIndexOf = scope.errorIndexOf;
            this.scope.parentField = scope.parentField;
            this.scope.parentFieldIndex = scope.parentFieldIndex;
        };
        
        Field.prototype.build = function () {
            var element = '<data-editor-field-' + this.scope.field.type +' data-field="field" data-set-error="setError"' +
                'data-set-empty="setEmpty" data-error-index-of="errorIndexOf" ' +
                'data-parent-field="parentField" data-parent-field-index="parentFieldIndex" ></data-editor-field-string>';
            return $compile(element)(this.scope);
        };

        return Field;
    }
})();