(function() {
    'use strict';

    angular
        .module('universal-editor')
        .service('ModalService', ModalService);
        
    function ModalService($q, $rootScope, $http, configData, $location, $timeout, $state, $httpParamSerializer, $document, $uibModal) {
        "ngInject";
        var self = this,
            modalInstance,
            isOpen = false,
            settings;

        self.close = closeWindow;
        self.open = openWindow;
        self.isModalOpen = isModalOpen;
        self.options = {};
        self.fromState = null;

        function openWindow(component) { /** send fromState и _pk */
            settings = component.settings;

            if(self.options.$componentId) {
                $location.search('relativeEntityId', self.options.$componentId);
            }
            modalInstance = $uibModal.open({
                component: 'ueModal',
                resolve: {
                    settings: function() {
                        return settings;
                    },
                    $componentId: function() {
                        return self.options.$componentId || $location.search().relativeEntityId;
                    }
                }
            });

            modalInstance.rendered.then(function() {
                isOpen = true;
                var pk = $state.params['pk'];
                self.fromState = settings.fromState || null;                
            });

            modalInstance.result.then(closeWindow, closeWindow);
        }

        function isModalOpen() {
            return isOpen;
        }

        function closeWindow(isUpdateParentComponent) {
            if (isOpen) {
                var parentComponentId = self.options.$componentId;
                isOpen = false;
                if (modalInstance) {
                    modalInstance.close();
                }
                modalInstance = null;
                $location.search('relativeEntityId', null);
                self.options = null;
                if (settings.fromState) {
                    $state.go(settings.fromState.name, settings.fromParams, { reload: false }).then(function() {
                        if (!isUpdateParentComponent) {
                            $rootScope.$broadcast('ue:collectionRefresh', parentComponentId);
                        }
                    });
                }
                settings = null;                
            }
        }
    }
})();
