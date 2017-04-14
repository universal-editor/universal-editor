(function () {
    'use strict';

    angular
        .module('demoApp')
        .controller('CountryFormController', CountryFormController);

    CountryFormController.$inject = ['$state'];
    function CountryFormController($state) {
        'ngInject';
        debugger;
        var vm = this;
        var countryDataSource = {
            standard: 'YiiSoft',
            url: '//universal-backend.dev/rest/v1/country',
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
                    dataSource: countryDataSource,
                    primaryKeyValue: function() {
                        if($state.params.pk === 'new') {
                            return null;
                        }
                        return $state.params.pk;
                    },
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
                    body: ['id','name'],
                    footer: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Save',
                                        action: 'save',
                                        sref: 'country',
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
                                        sref: 'country',
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
