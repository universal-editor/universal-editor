(function () {
    'use strict';

    angular
        .module('demoApp')
        .controller('CategoryFormController', CategoryFormController);

    function CategoryFormController($state, $location) {
        "ngInject";
        var vm = this;
        var categoryDataSource = {
            url: 'http://universal-backend.dev/rest/v1/news/categories',
            sortBy: '-id',
            primaryKey: 'id',
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
                    name: 'title',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'Title'
                        }
                    }
                }
            ]
        };

        vm.ueConfig = {
            component: {
                name: 'ue-form',
                settings: {
                    dataSource: categoryDataSource,
                    header: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Back to staff list',
                                        useBackUrl: true
                                    }
                                }
                            }
                        ]
                    },
                    body: ['id', 'title'],
                    footer: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Save',
                                        action: 'save',
                                        sref: 'category',
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
                                        sref: 'category',
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
