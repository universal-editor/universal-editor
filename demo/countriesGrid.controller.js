(function () {
    'use strict';

    angular
        .module('demoApp')
        .controller('CountryGridController', CountryGridController);

    function CountryGridController() {
        'ngInject';
        var vm = this;
        var countryDataSource = {
            standard: 'YiiSoft',
            url: '//universal-backend.dev/rest/v1/country',
            sortBy: {
                id: 'desc'
            },
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
                    dataSource: countryDataSource,
                    header: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Add',
                                        sref: 'country_edit'
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
                                    sref: 'country_edit'
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
