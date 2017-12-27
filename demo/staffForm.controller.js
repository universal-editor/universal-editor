(function () {
    'use strict';

    angular
        .module('demoApp')
        .controller('StaffFormController', StaffFormController);

    StaffFormController.$inject = ['$state'];
    function StaffFormController($state) {
        'ngInject';
        var vm = this;
        var staffDataSource = {
            standard: 'YiiSoft',
            url: '//universal-backend.test/rest/v1/staff',
            primaryKey: 'id',
            parentField: 'parent_id',
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
                },
                {
                    name: 'email',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'E-mail',
                            contentType: 'email'
                        }
                    }
                },
                {
                    name: 'gender',
                    component: {
                        name: 'ue-radiolist',
                        settings: {
                            label: 'Gender',
                            values: {
                                'Male': 'Male',
                                'Female': 'Female'
                            }
                        }
                    }
                },
                {
                    name: 'country',
                    component: {
                        name: 'ue-dropdown',
                        settings: {
                            label: 'Country',
                            valuesRemote: {
                                fields: {
                                    value: 'id',
                                    label: 'name'
                                },
                                url: 'http://universal-backend.test/rest/v1/country'
                            },
                            multiple: false,
                            placeholder: 'country of residence'
                        }
                    }
                },
                {
                    name: 'parent_id',
                    component: {
                        name: 'ue-autocomplete',
                        settings: {
                            label: 'Head',
                            valuesRemote: {
                                fields: {
                                    value: 'id',
                                    label: 'name'
                                },
                                url: 'http://universal-backend.test/rest/v1/staff'
                            },
                            multiple: false
                        }
                    }
                },
                {
                    name: 'colors',
                    component: {
                        name: 'ue-colorpicker',
                        settings: {
                            label: 'Favorite colors',
                            multiname: 'color',
                            multiple: true,
                            expandable: true
                        }
                    }
                },
                {
                    name: 'fired',
                    component: {
                        name: 'ue-checkbox',
                        settings: {
                            label: 'Fired',
                            trueValue: 1,
                            falseValue: 0
                        }
                    }
                },
                {
                    name: 'created_at',
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: 'Created',
                            disabled: true
                        }
                    }
                },
                {
                    name: 'updated_at',
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: 'Updated',
                            disabled: true
                        }
                    }
                }
            ],
            transport: {
                url: '//universal-backend.test/rest/v1/staff',
                one: {
                    url: '//universal-backend.test/rest/v1/staff/:id',
                    headers: function() {
                        return {};
                    },
                    params: function() {
                        return {expand: 'field', params: 'p'};
                    },
                    data: function() {
                        return {data: 'field'};
                    },
                    method: 'GET',
                    handlers: {
                        before: function(config) {
                            console.log('Before handler!');
                        },
                        error: function(reject) {
                            console.log('Error handler!');
                        },
                        success: function(response) {
                            console.log('Success handler!');
                        },
                        complete: function() {
                            console.log('Complete handler!');
                        }
                    }
                },
                create: {
                    url: '//universal-backend.test/rest/v1/staff',
                    headers: function() {
                        return {};
                    },
                    params: function() {
                        return {expand: 'field', params: 'p'};
                    },
                    data: function() {
                        return {data: 'field'};
                    },
                    method: 'POST',
                    handlers: {
                        before: function(config) {
                            console.log('Before handler!');
                        },
                        error: function(reject) {
                            console.log('Error handler!');
                        },
                        success: function(response) {
                            console.log('Success handler!');
                        },
                        complete: function() {
                            console.log('Complete handler!');
                        }
                    }
                },
                update: {
                    url: '//universal-backend.test/rest/v1/staff/:id',
                    headers: function() {
                        return {};
                    },
                    params: function() {
                        return {expand: 'field', params: 'p'};
                    },
                    data: function() {
                        return {data: 'field'};
                    },
                    method: 'PUT',
                    handlers: {
                        before: function(config) {
                            console.log('Before handler!');
                        },
                        error: function(reject) {
                            console.log('Error handler!');
                        },
                        success: function(response) {
                            console.log('Success handler!');
                        },
                        complete: function() {
                            console.log('Complete handler!');
                        }
                    }
                },
                delete: {
                    url: '//universal-backend.test/rest/v1/staff/:id',
                    headers: function() {
                        return {};
                    },
                    params: function() {
                        return {expand: 'field', params: 'p'};
                    },
                    data: function() {
                        return {data: 'field'};
                    },
                    method: 'DELETE',
                    handlers: {
                        before: function(config) {
                            console.log('Before handler!');
                        },
                        error: function(reject) {
                            console.log('Error handler!');
                        },
                        success: function(response) {
                            console.log('Success handler!');
                        },
                        complete: function() {
                            console.log('Complete handler!');
                        }
                    }
                }
            }
        };

        vm.ueConfig = {
            component: {
                name: 'ue-form',
                settings: {
                    dataSource: staffDataSource,
                    primaryKeyValue: function () {
                        if ($state.params.pk === 'new') {
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
                    body: [
                        'fired',
                        'name',
                        'email',
                        'gender',
                        'country',
                        'parent_id',
                        'colors',
                        'created_at',
                        'updated_at'
                    ],
                    footer: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Save',
                                        action: 'save',
                                        sref: 'staff',
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
                                        sref: 'staff',
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
