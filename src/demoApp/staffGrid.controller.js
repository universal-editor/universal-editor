(function() {
    'use strict';

    angular
        .module('demoApp')
        .controller('StaffGridController', StaffGridController);

    StaffGridController.$inject = [];

    function StaffGridController() {
        var staffDataSource = {
            type: 'REST',
            url: '//universal-backend.dev/rest/v1/staff',
            sortBy: '-id',
            primaryKey: 'id',
            parentField: 'parent_id',
            keys:{
                items: 'items',
                meta: '_meta'
            },
            fields:[
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
                name: 'ue-grid',
                settings: {
                    dataSource: staffDataSource,
                    header:{
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button-link',
                                    settings: {
                                        label: 'создать',
                                        state: 'staff_edit'
                                    }
                                }
                            }
                        ]
                    },
                    columns: ['name', 'email'],
                    contextMenu:[
                        {
                            component: {
                                name: 'ue-button-link',
                                settings: {
                                    label: 'редактировать',
                                    state: 'staff_edit'
                                }
                            }
                        },
                        {
                            separator: true,
                            component: {
                                name: 'ue-button-service',
                                settings: {
                                    label: 'Удалить',
                                    action: 'delete',
                                    state: 'staff'
                                }
                            }
                        },
                        {
                            separator: true,
                            component: {
                                name: 'ue-button-service',
                                settings: {
                                    label: 'Раскрыть',
                                    action: 'open'
                                }
                            }
                        }
                    ],
                    footer: {
                        controls: [
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
