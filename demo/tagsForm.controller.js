(function () {
    'use strict';

    angular
        .module('demoApp')
        .controller('TagsFormController', TagsFormController);

    function TagsFormController($state, $location) {
        "ngInject";
        var vm = this;
        var tagsDataSource = {
            standard: 'YiiSoft',
            url: '//universal-backend.dev/rest/v1/tags',
            sortBy: '-id',
            fields: [
                {
                    name: 'id',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'ID',
                            validators: [
                                {
                                    type: 'number'
                                }
                            ],
                            disabled: true
                        }
                    }
                },
                {
                    name: 'name',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'Name'
                        }
                    }
                }
            ]
        };

        vm.ueConfig = {
            component: {
                name: 'ue-form',
                settings: {
                    dataSource: tagsDataSource,
                    header: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Back',
                                        useBackUrl: true
                                    }
                                }
                            }
                        ]
                    },
                    body: ['id', 'name'],
                    footer: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Save',
                                        action: 'save',
                                        sref: 'tags',
                                        useBackUrl: true
                                    }
                                }
                            },
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Apply',
                                        action: 'presave'
                                    }
                                }
                            },
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Delete',
                                        action: 'delete',
                                        sref: 'tags',
                                        useBackUrl: true
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        };
    }
})();
