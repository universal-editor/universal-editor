(function () {
    'use strict';

    angular.module('universal.editor').component('ueModal', {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueModal/ueModal.html');
        }],
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controllerAs: 'vm',
        controller: function ($uibModal, $scope) {
            var vm = this;
            vm.entityId = vm.resolve.settings._pk;
            
            vm.header = vm.resolve.settings.header;
            vm.body = vm.resolve.settings.body;
            vm.footer = [];

            if(vm.resolve.settings.footer && vm.resolve.settings.footer.controls) {
                angular.forEach(vm.resolve.settings.footer.controls, function(control) {
                  vm.footer.push(control);
                });
            }                        

            vm.$onInit = function () {
              vm.resolve.settings.isModal = true;
            };

            vm.ok = function () {
                vm.close({$value: "ок modal"});
            };

            vm.cancel = function () {
                vm.close();   
            };
            
            $scope.$on('exit_modal', function() {
                vm.dismiss({$value: 'cancel modal emit'});
            });
    }});
})();