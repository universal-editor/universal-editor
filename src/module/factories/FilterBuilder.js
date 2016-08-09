(function () {
    'use strict';

    angular
        .module('universal.editor')
        .factory('FilterBuilder',FilterBuilder);

    FilterBuilder.$inject = ['$compile'];

    function FilterBuilder($compile){
        var Filter = function (scope) {

            this.scope = scope.$new();
            this.scope.filter = scope.filter;
        };

        Filter.prototype.build = function () {
            var element = '<div data-editor-filter-' + this.scope.filter.type + '=""></div>';

            return $compile(element)(this.scope);
        };

        return Filter;
    }
})();
