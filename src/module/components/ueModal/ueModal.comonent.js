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
        controller: function ($uibModal, $scope, configData, $element) {
            var vm = this;
            vm.entityId = vm.resolve.settings._pk;
            vm.assetsPath = '/assets/universal-editor';

            if (!!configData.ui && !!configData.ui.assetsPath) {
                vm.assetsPath = configData.ui.assetsPath;
            }

            vm.size = vm.resolve.settings.size;
            if (vm.size) {
                if (vm.size.width) {
                    $element.closest(".modal-dialog").width(vm.size.width);
                }
                if (vm.size.height) {
                    $element.closest(".modal-dialog").height(vm.size.height);
                }
            }
            
            vm.header = vm.resolve.settings.header;

            vm.body = vm.resolve.settings.body;
            vm.body.component._pk = vm.entityId;

            vm.footer = [];

            if(vm.resolve.settings.footer && vm.resolve.settings.footer.controls) {
                angular.forEach(vm.resolve.settings.footer.controls, function(control) {
                control.component._pk = vm.entityId;
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