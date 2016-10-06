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
        controller: function ($uibModal, $scope) {
            var $ctrl = this;
            console.log($ctrl); 
            

            $ctrl.$onInit = function () {
              $ctrl.resolve.settings.pk = $ctrl.resolve.pk;
              $ctrl.resolve.settings.isModal = true;
            };

            $ctrl.ok = function () {
                $ctrl.close({$value: "ок modal"});
            };

            $ctrl.cancel = function () {
                $ctrl.close();   
            };
            $scope.$on('exit_modal', function() {
                $ctrl.dismiss({$value: 'cancel modal emit'});
            });
    }});
})();