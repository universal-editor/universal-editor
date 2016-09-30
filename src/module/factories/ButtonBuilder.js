(function () {
    'use strict';

    angular
        .module('universal.editor')
        .factory('ButtonBuilder',ButtonBuilder);

    ButtonBuilder.$inject = ['$compile'];

    function ButtonBuilder($compile){
        var Button = function (scope) {
            this.scope = scope.$new();
            this.scope.setting = scope.setting;
        };

        Button.prototype.build = function () {
            var element = '<' + this.scope.setting.component.name +' data-setting="setting"></' + this.scope.setting.component.name + '>';
            return $compile(element)(this.scope);
        };

        return Button;
    }
})();