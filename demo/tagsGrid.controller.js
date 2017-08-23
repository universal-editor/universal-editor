(function() {
    'use strict';

    angular
        .module('demoApp')
        .controller('TagsGridController', TagsGridController);

    function TagsGridController() {
        'ngInject';
        var vm = this;
        var tagsDataSource = {
            standard: 'YiiSoft',
            transport: {
                url: '//universal-backend.dev/rest/v1/tags'
            },
            sortBy: {
                id: 'desc'
            },
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
                            ]
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
                name: 'ue-grid',
                settings: {
                    dataSource: tagsDataSource,
                    header: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-filter'
                                }
                            },
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Add',
                                        sref: 'tags_edit'
                                    }
                                }
                            }
                        ]
                    },
                    columns: ['name'],
                    contextMenu: [
                        {
                            component: {
                                name: 'ue-button',
                                settings: {
                                    label: 'Edit',
                                    sref: 'tags_edit'
                                }
                            }
                        },
                        {
                            separator: true,
                            component: {
                                name: 'ue-button',
                                settings: {
                                    label: 'Delete',
                                    action: 'delete',
                                    sref: 'staff'
                                }
                            }
                        }
                    ],
                    footer: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-pagination'
                                }
                            }
                        ]
                    }
                }
            }
        };
    }
})();
