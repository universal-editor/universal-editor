(function () {
    'use strict';

    angular
        .module('universal.editor')
        .factory('ComponentBuilder',ComponentBuilder);

    ComponentBuilder.$inject = ['$compile'];

    function ComponentBuilder($compile){
        var Component = function (scope) {
            this.scope = scope.$new();
            this.scope.setting = scope.setting;
        };

        Component.prototype.build = function () {
            var element = '<' + this.scope.setting.component.name +' data-setting="setting"></' + this.scope.setting.component.name + '>';
            return $compile(element)(this.scope);
        };

        return Component;
    }
})();