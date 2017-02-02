(function() {
    'use strict';

    angular
        .module('demoApp')
        .controller('StaffFormController', StaffFormController);

    StaffFormController.$inject = ['$state', '$location'];

    function StaffFormController($state, $location) {
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
            fields: [
                {
                    name: "name",
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: "Имя"
                        }
                    }
                },
                {
                    name: "email",
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: "Эл. почта",
                            contentType: 'email'
                        }
                    }
                },
                {
                    name: "gender",
                    component: {
                        name: 'ue-radiolist',
                        settings: {
                            label: "Пол",
                            values: {
                                "male": "Мужской",
                                "female": "Женский"
                            }
                        }
                    }
                },
                {
                    name: "country",
                    component: {
                        name: "ue-dropdown",
                        settings: {
                            label: 'Страна',
                            valuesRemote: {
                                fields: {
                                    value: "id",
                                    label: "name"
                                },
                                url: "http://universal-backend.dev/rest/v1/country"
                            },
                            multiple: false,
                            placeholder: "Выберете эелемент"
                        }
                    }
                },
                {
                    name: "parent_id",
                    component: {
                        name: "ue-autocomplete",
                        settings: {
                            label: "Руководитель",
                            valuesRemote: {
                                fields: {
                                    value: "id",
                                    label: "name"
                                },
                                url: "http://universal-backend.dev/rest/v1/staff"
                            },
                            multiple: false
                        }
                    }
                },
                {
                    name: "colors",
                    component: {
                        name: "ue-colorpicker",
                        settings: {
                            label: "Любимые цвета",
                            multiname: "color",
                            expandable: true
                        }
                    }
                },
                {
                    name: "text",
                    component: {
                        name: 'ue-textarea',
                        settings: {
                            label: "Дополнительные заметки"
                        }
                    }
                },
                {
                    name: "fired",
                    component: {
                        name: 'ue-checkbox',
                        settings: {
                            label: "Уволен",
                            trueValue: 1,
                            falseValue: 0
                        }
                    }
                },
                {
                    name: "created_at",
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: "Дата создания"
                        }
                    }
                },
                {
                    name: "updated_at",
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: "Дата обновления"
                        }
                    }
                }
            ]
        };
        var vm = this;
        vm.ueConfig = {
            component: {
                name: 'ue-form',
                settings: {
                    dataSource: staffDataSource,
                    header: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button-link',
                                    settings: {
                                        label: 'Назад',
                                        back: true,
                                        template: function($scope) {
                                            return '<div class="close-editor" ng-click="vm.click()"> </div>';
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    body: [
                        {
                            component: {
                                name: 'ue-form-tabs',
                                settings: {
                                    tabs: [
                                        {
                                            label: 'Карточка',
                                            fields: [
                                                'name',
                                                'email',
                                                'gender',
                                                'country',
                                                'parent_id',
                                                'colors',
                                                'text'
                                            ]
                                        },
                                        {
                                            label: 'Служебное',
                                            fields: [
                                                'fired',
                                                'created_at',
                                                'updated_at'
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    footer: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Сохранить/обновить',
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
                                        label: 'Удалить',
                                        action: 'delete',
                                        sref: 'staff',
                                        useBackUrl: true
                                    }
                                }
                            },
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Сохранить',
                                        action: 'presave'
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
