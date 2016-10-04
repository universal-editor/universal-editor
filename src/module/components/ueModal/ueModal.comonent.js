(function () {
    'use strict';

    angular.module('universal.editor').component('ueModal', {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueModal/ueModal.html');
        }],
        bindings: {
            resolve: '=',
            close: '&',
            dismiss: '&'
        },
        controller: ['$scope', function ($scope) {
            var $ctrl = this;
            console.log($ctrl);
            $ctrl.$onInit = function () {
                $ctrl.resolve.setting.pk = $ctrl.resolve.pk;
            };

            $ctrl.ok = function () {
                $ctrl.close({$value: "ок modal"});
            };

            $ctrl.cancel = function () {
                $ctrl.dismiss({$value: 'cancel modal'});
            };
            $scope.$on('exit_modal', function() {
                $ctrl.dismiss({$value: 'cancel modal emit'});
            });
        }]
    });
})();