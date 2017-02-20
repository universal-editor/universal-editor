(function() {
    'use strict';

    angular
        .module('universal.editor')
        .service('ModalService', ModalService);

    ModalService.$inject = ['$q', '$rootScope', '$http', 'configData', 'EditEntityStorage', '$location', '$timeout', '$state', '$httpParamSerializer', '$document', '$uibModal'];

    /*@ngInject*/
    function ModalService($q, $rootScope, $http, configData, EditEntityStorage, $location, $timeout, $state, $httpParamSerializer, $document, $uibModal) {
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

            if(self.options.$parentComponentId) {
                $location.search('relativeEntityId', self.options.$parentComponentId);
            }
            modalInstance = $uibModal.open({
                component: 'ueModal',
                resolve: {
                    settings: function() {
                        return settings;
                    },
                    $parentComponentId: function() {
                        return self.options.$parentComponentId || $location.search().relativeEntityId;
                    }
                }
            });

            modalInstance.rendered.then(function() {
                isOpen = true;
                var pk = $state.params['pk'];
                if (pk === 'new') {
                   EditEntityStorage.newSourceEntity(self.options.$parentComponentId);
                }
                self.fromState = settings.fromState || null;                
            });

            modalInstance.result.then(closeWindow, closeWindow);
        }

        function isModalOpen() {
            return isOpen;
        }

        function closeWindow(isUpdateParentComponent) {
            if (isOpen) {
                var parentComponentId = self.options.$parentComponentId;
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
                            $rootScope.$broadcast('editor:read_entity', parentComponentId);
                        }
                    });
                }
                settings = null;                
            }
        }
    }
})();
