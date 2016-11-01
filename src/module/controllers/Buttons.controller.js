(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('ButtonsController', ButtonsController);

    ButtonsController.$inject = ['$scope', '$controller'];

    function ButtonsController($scope, $controller) {
        /* jshint validthis: true */
        var vm = this;
        var baseController = $controller('BaseController', { $scope: $scope });
        angular.extend(vm, baseController);
        var self = $scope.vm;
        var componentSettings = self.setting.component.settings;

        self.label = componentSettings.label;
        self.action = componentSettings.action;
        self.beforeSend = componentSettings.beforeSend;
        self.success = componentSettings.success;
        self.error = componentSettings.error;
        self.complete = componentSettings.complete;
        self.type = self.setting.type;
        self.entityId = self.setting.entityId;
    }
})();
