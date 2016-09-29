(function () {
    'use strict';

    angular
        .module('universal.editor')
        .factory('FieldBuilder',FieldBuilder);

    FieldBuilder.$inject = ['$compile'];

    function FieldBuilder($compile){
        var Field = function (scope) {
            this.scope = scope.$new();
            this.scope.setting = scope.setting;
        };
        
        Field.prototype.build = function () {
            var element = '<' + this.scope.setting.component.name +' data-setting="setting"></' + this.scope.setting.component.name + '>';
            return $compile(element)(this.scope);
        };

        return Field;
    }
})();