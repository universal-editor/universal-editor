window.RequstCallback = {
    beforeAction: function() {
        console.log('Ïðèâåò ìèð!!! ÿ beforeSend');
    }
};

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
    fields: [
        {
            name: 'id',
            component: {
                name: 'ue-string',
                settings: {
                    label: '№',
                    validators: [
                        {
                            type: 'number',
                            min: 10,
                            max: 50,
                            step: 2
                        }
                    ]
                }
            }
        },
        {
            name: 'parent_id',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'Начальник',
                    validators: []
                }
            }
        },
        {
            name: 'name',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'Имя',
                    validators: [
                        // @todo Примеры
                    ]
                }
            }
        },
        {
            name: 'email',
            expandable: true,
            component: {
                name: 'ue-string',
                settings: {
                    label: 'Эл. почта',
                    validators: [
                        {
                            type: 'string',
                            trim: true,
                            contentType: 'email'
                        }
                    ]
                }
            }
        },
        {
            name: 'description',
            component: {
                name: 'ue-textarea',
                settings: {
                    label: 'textarea',
                    validators: [
                        {
                            type: 'string',
                            minLength: 10,
                            maxLength: 50,
                            trim: true
                        },
                        {
                            type: 'mask',
                            mask: 'AA',
                            maskDefinitions: {
                                'A': /[a-z]/,
                                '*': /[a-zA-Z0-9]/,
                                '+': /[0-9]/
                            }
                        }
                    ],
                    multiple: false
                }
            }
        },
        {
            name: "gender",
            component: {
                name: "ue-radiolist",
                settings:{
                    "label": "Пол",
                    "values": {
                        "male": "Мужской",
                        "female": "Женский"
                    },
                    "showOnly": "edit"
                }
            }
        },
        {
            name: 'date',
            component: {
                name: 'ue-date',
                settings: {
                    label: 'date',
                    validators: [
                        {
                            type: 'date',
                            format: 'YYYY-MM-DD'
                        }
                    ]
                }
            }
        },
        {
            name: 'date2',
            component: {
                name: 'ue-date',
                settings: {
                    label: 'date2',
                    validators: [
                    ]
                }
            }
        },
        {
            name: 'datetime',
            component: {
                name: 'ue-datetime',
                settings: {
                    label: 'datetime',
                    validators: [
                        // @todo Примеры
                    ]
                }
            }
        },
        {
            name: 'time',
            component: {
                name: 'ue-time',
                settings: {
                    label: 'time',
                    validators: [
                        // @todo Примеры
                    ]
                }
            }
        }
    ]
};

var filterComponent = {
    component: {
        name: 'ue-filter',
        settings: {
            header: {
                label: 'Фильтр'
            },
            fields: ['id', 'parent_id', 'email', 'description'],
            footer: {
                controls: [
                    {
                        component: {
                            name: 'ue-button-filter',
                            settings: {
                                label: 'Применить',
                                action: 'send'
                            }
                        }
                    },
                    {
                        component: {
                            name: 'ue-button-filter',
                            settings: {
                                label: 'Очистить',
                                action: 'clear'
                            }
                        }
                    }
                ]
            }
        }
    }
};

var messagesDataSource = {
    type: 'REST',
    url: '//universal-backend.dev/rest/v1/news',
    sortBy: '-id',
    primaryKey: 'id',
    fields: [
        {
            name: 'id',
            component: {
                name: 'ue-string',
                settings: {
                    label: '№',
                    validators: []
                }
            }
        },
        {
            name: 'email',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'Message',
                    validators: []
                }
            }
        }
    ]
};

var ue = new UniversalEditor('universal-editor', {
    ui: {
        assetsPath: '/assets'
    },
    entities: [
        {
            name: 'staff',
            label: 'Сотрудники',
            states: [
                {
                    name: 'index',
                    url: '/staff',
                    component: {
                        name: 'ue-grid',
                        settings: {
                            dataSource: staffDataSource,
                            header:{
                                filter: filterComponent,
                                controls: [
                                    {
                                        component: {
                                            name: 'ue-button-goto',
                                            settings: {
                                                label: 'создать',
                                                state: 'edit'
                                            }
                                        }
                                    }
                                ]
                            },
                            columns: ['name', 'email'],
                            contextMenu:[
                                {
                                    component: {
                                        name: 'ue-button-goto',
                                        settings: {
                                            label: 'редактировать',
                                            state: 'edit'
                                        }
                                    }
                                },
                                {
                                    separator: true,
                                    component: {
                                        name: 'ue-button-service',
                                        settings: {
                                            label: 'Удалить',
                                            action: 'delete'
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
                                },
                                {
                                    separator: true,
                                    component: {
                                        name: 'ue-button-request',
                                        settings: {
                                            label: 'This is request!!!',
                                            url: '//universal-backend.dev/rest/v1/staff',
                                            method: 'GET',
                                            beforeSend: window.RequstCallback.beforeSend
                                        }
                                    }
                                },
                                {
                                    component: {
                                        name: 'ue-button-request',
                                        settings: {
                                            label: 'This _blank!!!',
                                            url: 'http://333v.ru/uploads/12/12182eaff9b46ef1848fe409b0fa9ed5.jpg',
                                            target: '_blank'
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
                },
                {
                    name: 'index.modal_edit',
                    url: '/staff/:pk',
                    component: {
                        name: 'ue-modal',
                        settings: {
                            size: {
                                width: '70%',
                                height: '90%'
                            },
                            header: {
                                label: 'Модальное окно'
                            },
                            body: {
                                text: 'Text in modal',
                                component: {
                                    name: 'ue-form',
                                    settings: {
                                        dataSource: staffDataSource,
                                        body: [
                                            {
                                                component: {
                                                    name: 'ue-form-tabs',
                                                    settings: {
                                                        tabs: [
                                                            {
                                                                label: 'Tab 1',
                                                                fields: [
                                                                    'id',
                                                                    'name',
                                                                    'email',
                                                                    'description',
                                                                    'gender',
                                                                    'datetime',
                                                                    'date',
                                                                    'time'
                                                                ]
                                                            },
                                                            {
                                                                label: 'Tab 2',
                                                                fields: [
                                                                    {
                                                                        component: {
                                                                            name: 'ue-form-group',
                                                                            settings: {
                                                                                label: 'Group 1',
                                                                                countInLine: 2,
                                                                                fields: ['name', 'email']
                                                                            }
                                                                        }
                                                                    },
                                                                    {
                                                                        component: {
                                                                            name: 'ue-grid',
                                                                            settings: {
                                                                                header:{
                                                                                    controls: [
                                                                                        {
                                                                                            component: {
                                                                                                name: 'ue-button-goto',
                                                                                                settings: {
                                                                                                    label: 'создать',
                                                                                                    state: 'edit'
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    ]
                                                                                },
                                                                                label: 'Messages',
                                                                                dataSource: messagesDataSource,
                                                                                columns: ['id', 'title']
                                                                            }
                                                                        }
                                                                    },
                                                                    {
                                                                        component: {
                                                                            name: 'ue-button-request',
                                                                            settings: {
                                                                                label: 'This is request!!!',
                                                                                url: '//universal-backend.dev/rest/v1/staff',
                                                                                method: 'GET',
                                                                                beforeSend: window.RequstCallback.beforeSend,
                                                                                success: window.RequstCallback.success,
                                                                                error: window.RequstCallback.error,
                                                                                complete: window.RequstCallback.complete
                                                                            }
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            footer: {
                                controls: [
                                    {
                                        component: {
                                            name: 'ue-button-modal',
                                            settings: {
                                                label: 'Закрыть',
                                                action: 'close',
                                                beforeAction: 'funcName' // Функция выполняется перед выполнением экшена (в данном случае — закрытием окна).
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                {
                    name: 'edit',
                    url: '/staff/:pk',
                    component: {
                        name: 'ue-form',
                        settings: {
                            header: {
                                label: 'Модальное окно'
                            },
                            dataSource: staffDataSource,
                            body: [
                                {
                                    component: {
                                        name: 'ue-form-tabs',
                                        settings: {
                                            tabs: [
                                                {
                                                    label: 'Tab 1',
                                                    fields: [
                                                        'id',
                                                        'name',
                                                        'email',
                                                        'description',
                                                        'gender',
                                                        'datetime',
                                                        'date',
                                                        'date2',
                                                        'time'
                                                    ]
                                                },
                                                {
                                                    label: 'Tab 2',
                                                    fields: [
                                                        {
                                                            component: {
                                                                name: 'ue-grid',
                                                                settings: {
                                                                    header:{
                                                                    },
                                                                    label: 'Messages',
                                                                    dataSource: messagesDataSource,
                                                                    columns: ['id', 'title']
                                                                }
                                                            }
                                                        },
                                                        {
                                                            component: {
                                                                name: 'ue-button-request',
                                                                settings: {
                                                                    label: 'This is request!!!',
                                                                    url: '//universal-backend.dev/rest/v1/staff',
                                                                    method: 'GET',
                                                                    beforeSend: window.RequstCallback.beforeSend,
                                                                    success: window.RequstCallback.success,
                                                                    error: window.RequstCallback.error,
                                                                    complete: window.RequstCallback.complete
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            ],
                            footer: {
                                controls: [
                                    {
                                        component: {
                                            name: 'ue-button-service',
                                            settings: {
                                                label: 'Сохранить/обновить',
                                                action: 'save'
                                            }
                                        }
                                    },
                                    {
                                        component: {
                                            name: 'ue-button-service',
                                            settings: {
                                                label: 'Удалить',
                                                action: 'delete'
                                            }
                                        }
                                    },
                                    {
                                        component: {
                                            name: 'ue-button-service',
                                            settings: {
                                                label: 'Сохранить',
                                                action: 'presave'
                                            }
                                        }
                                    },
                                    {
                                        component: {
                                            name: 'ue-button-request',
                                            settings: {
                                                label: 'This is request!!!',
                                                url: '//universal-backend.dev/rest/v1/staff',
                                                method: 'GET',
                                                beforeSend: window.RequstCallback.beforeSend,
                                                success: window.RequstCallback.success,
                                                error: window.RequstCallback.error,
                                                complete: window.RequstCallback.complete
                                            }
                                        }
                                    },
                                    {
                                        component: {
                                            name: 'ue-button-request',
                                            settings: {
                                                label: 'This _blank!!!',
                                                url: 'http://333v.ru/uploads/12/12182eaff9b46ef1848fe409b0fa9ed5.jpg',
                                                target: '_blank'
                                            }
                                        }
                                    },
                                    {
                                        component: {
                                            name: 'ue-button-download',
                                            settings: {
                                                label: 'This is button!!!',
                                                request: {
                                                    url: 'http://333v.ru/uploads/12/12182eaff9b46ef1848fe409b0fa9ed5.jpg'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        }
    ]
});
