(function () {
    'use strict';

    angular
        .module('demoApp')
        .controller('StaffGridController', StaffGridController);

    StaffGridController.$inject = [];

    function StaffGridController() {
        var vm = this;
        var staffDataSource = {
            type: 'REST',
            url: '//universal-backend.dev/rest/v1/staff',
            sortBy: '-id',
            primaryKey: 'id',
            parentField: 'parent_id',
            keys: {
                items: 'items',
                meta: '_meta'
            },
            fields:[
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
                                'male': 'Male',
                                'female': 'Female'
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
                                url: 'http://universal-backend.dev/rest/v1/country'
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
                                url: 'http://universal-backend.dev/rest/v1/staff'
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
                            expandable: true
                        }
                    }
                },
                {
                    name: 'text',
                    component: {
                        name: 'ue-textarea',
                        settings: {
                            label: 'Notes'
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
            ]
        };
        
        vm.ueConfig = {
            component: {
                name: 'ue-grid',
                settings: {
                    dataSource: staffDataSource,
                    header: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Add',
                                        sref: 'staff_edit'
                                    }
                                }
                            }
                        ]
                    },
                    columns: ['name', 'email', 'gender', 'parent_id'],
                    contextMenu: [
                        {
                            separator: true,
                            component: {
                                name: 'ue-button',
                                settings: {
                                    label: 'Subordinate',
                                    action: 'open'
                                }
                            }
                        },
                        {
                            component: {
                                name: 'ue-button-link',
                                settings: {
                                    label: 'Edit',
                                    sref: 'staff_edit'
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
                                    name: 'ue-pagination',
                                    settings: {
                                        label: {
                                            last: '>>',
                                            next: '>'
                                        }
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
