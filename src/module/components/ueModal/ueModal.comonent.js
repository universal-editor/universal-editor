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
        controller: function ($uibModal, $scope, configData, $element, $state) {
            var vm = this;
            vm.entityId = $state.params.pk;
            vm.assetsPath = '/assets/universal-editor';

            if (!!configData.ui && !!configData.ui.assetsPath) {
                vm.assetsPath = configData.ui.assetsPath;
            }
            var modalDialog = $element.closest(".modal-dialog");

            vm.size = vm.resolve.settings.size;
            if (vm.size) {
                if (vm.size.width) {
                    modalDialog.width(vm.size.width);
                }
                if (vm.size.height) {
                    modalDialog.height(vm.size.height);
                }
            }
            
            vm.header = vm.resolve.settings.header;

            vm.body = vm.resolve.settings.body;
            if(vm.body) {
                vm.body.component.settings.modal = true;
            }

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