(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeFilterController', UeFilterController);

    UeFilterController.$inject = ['$scope', '$element','EditEntityStorage', 'RestApiService'];

    function UeFilterController($scope, $element, EditEntityStorage, RestApiService) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;
        var settings = vm.setting.component.settings;
        vm.visiable = false;

          vm.header = settings.header;

          vm.body = [];

          angular.forEach(settings.dataSource.fields, function(field) {
              if (field.component.hasOwnProperty("settings") && (settings.fields.indexOf(field.name) != -1)) {
                  vm.body.push(field);
              }
          });

          vm.footer = [];
          if (settings.footer && settings.footer.controls) {
              angular.forEach(settings.footer.controls, function(control) {
                  vm.footer.push(control);
              });
          }

          vm.toggleFilterVisibility = function() {
              vm.visiable = !vm.visiable;
          };

          $element.on('$destroy', function() {
              $scope.$destroy();
          });
    }
})();