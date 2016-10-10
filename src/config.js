
window.RequstCallback = {
    beforeSend: function(re) {
        console.log('Привет мир!!! я beforeSend', re);
    },
    error: function(re) {
        console.log('Привет мир!!! я error', re);
    },
    success: function(re) {
        console.log('Привет мир!!! я success', re);
    },
    complete: function() {
        console.log('Привет мир!!! я complete');
    }
};

var staffDataSource = {
    type: 'REST',
    url: '//universal-backend.dev/rest/v1/staff',
    sortBy: '-id',
    primaryKey: 'id',
    parentField: 'parent_id',
    fields: [
        {
            name: 'id',
            component: {
                name: 'ue-number',
                settings: {
                    label: '№',
                    validators: []
                }
            }
        },
        {
            name: 'parent_id',
            component: {
                name: 'ue-number',
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
                    validators: []
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
            "name": "parent_id",
            component: {
                "name": "ue-autocomplete",
                settings: {
                    "list": true,
                    "label": "Руководитель",
                    "valuesRemote": {
                        "fields": {
                            "value": "id",
                            "label": "name"
                        },
                        "url": "http://universal-backend.dev/rest/v1/staff"
                    }
                }
            }
        }
    ]
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
                name: 'ue-number',
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
                        name: 'ue-table',
                        settings: {
                            dataSource: staffDataSource,
                            header:[
                                {
                                    component: {
                                        name: 'ue-button-goto',
                                        settings: {
                                            label: 'создать',
                                            state: 'index.modal_edit'
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
                                            beforeSend: 'RequstCallback.beforeSend',
                                            success: 'RequstCallback.success',
                                            error: 'RequstCallback.error',
                                            complete: 'RequstCallback.complete'
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
                            ],
                            columns: ['name', 'email'],
                            contextMenu:[
                                {
                                    component: {
                                        name: 'ue-button-goto',
                                        settings: {
                                            label: 'редактировать',
                                            state: 'index.modal_edit'
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
                                        name: 'ue-button-open',
                                        settings: {
                                            label: 'Раскрыть'
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
                                            beforeSend: 'RequstCallback.beforeSend',
                                            success: 'RequstCallback.success',
                                            error: 'RequstCallback.error',
                                            complete: 'RequstCallback.complete'
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
                            ]
                        }
                    }
                },
                {
                    name: 'edit',
                    url: '/staff/:pk',
                    component: {
                        name: 'ue-form',
                        settings: {
                            dataSource: staffDataSource,
                            body: [
                                {
                                    component: {
                                        name: 'ue-form-tab',
                                        settings: {
                                            label: 'Tab 1',
                                            fields: [
                                                'id',
                                                'name', 'email'
                                                //{
                                                //    name: "fio",
                                                //    component: {
                                                //        name: 'ue-form-group',
                                                //        settings: {
                                                //            label: 'Group 1',
                                                //            fields: ['name', 'email']
                                                //        }
                                                //    }
                                                //}
                                            ]
                                        }
                                    }
                                },
                                {
                                    component: {
                                        name: 'ue-form-tab',
                                        settings: {
                                            label: 'Tab 2',
                                            fields: [
                                                {
                                                    component: {
                                                        name: 'ue-table',
                                                        settings: {
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
                                                            beforeSend: 'RequstCallback.beforeSend',
                                                            success: 'RequstCallback.success',
                                                            error: 'RequstCallback.error',
                                                            complete: 'RequstCallback.complete'
                                                        }
                                                    }
                                                },
                                            ]
                                        }
                                    }
                                }
                            ],
                            footer: [
                                //"default-data-controls": true,
                                //component: {
                                //    name: 'my-super-component'
                                //}
                                {
                                    component: {
                                        name: 'ue-button-service',
                                        settings: {
                                            label: 'Сохранить',
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
                                            beforeSend: 'RequstCallback.beforeSend',
                                            success: 'RequstCallback.success',
                                            error: 'RequstCallback.error',
                                            complete: 'RequstCallback.complete'
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
                },
                {
                    name: 'index.modal_edit',
                    url: false,
                    component:
                    {
                        name: 'ue-modal',
                        settings: {
                            size: {
                                width: '70%',
                                height: 'auto'
                            },
                            header: {
                                label: 'Модальное окно'
                            },
                            body: {
                                component: {
                                    name: 'ue-form',
                                    settings: {
                                        dataSource: staffDataSource,
                                        body: [
                                            {
                                                component: {
                                                    name: 'ue-form-tab',
                                                    settings: {
                                                        label: 'Tab 1',
                                                        fields: [
                                                            'id',
                                                            'name', 'email'
                                                            //{
                                                            //    name: "fio",
                                                            //    component: {
                                                            //        name: 'ue-form-group',
                                                            //        settings: {
                                                            //            label: 'Group 1',
                                                            //            fields: ['name', 'email']
                                                            //        }
                                                            //    }
                                                            //}
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                component: {
                                                    name: 'ue-form-tab',
                                                    settings: {
                                                        label: 'Tab 2',
                                                        fields: [
                                                            {
                                                                component: {
                                                                    name: 'ue-table',
                                                                    settings: {
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
                                                                        beforeSend: 'RequstCallback.beforeSend',
                                                                        success: 'RequstCallback.success',
                                                                        error: 'RequstCallback.error',
                                                                        complete: 'RequstCallback.complete'
                                                                    }
                                                                }
                                                            },
                                                        ]
                                                    }
                                                }
                                            }
                                        ],
                                        footer: [
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
                                                    name: 'ue-button-service',
                                                    settings: {
                                                        label: 'Сохранить',
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
                                                beforeAction: 'RequstCallback.sendAction'
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        },
        {
            name: 'staff12',
            label: 'Сотрудники12',
            states: [
                {
                    name: 'index',
                    component: {
                        name: 'ue-table',
                        settings: {
                            dataSource: messagesDataSource,
                            header:[
                                {
                                    component: {
                                        name: 'ue-button-create',
                                        settings: {
                                            label: 'создать'
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
                                            beforeSend: 'RequstCallback.beforeSend',
                                            success: 'RequstCallback.success',
                                            error: 'RequstCallback.error',
                                            complete: 'RequstCallback.complete'
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
                            ],
                            columns: ['name', 'email'],
                            contextMenu:[
                                {
                                    component: {
                                        name: 'ue-button-edit',
                                        settings: {
                                            label: 'Редактировать',
                                            state: 'edit'
                                        }
                                    }
                                },
                                {
                                    component: {
                                        name: 'ue-button-delete',
                                        settings: {
                                            label: 'Удалить',
                                            state: 'index'
                                        }
                                    }
                                },
                                {
                                    component: {
                                        name: 'ue-button-open',
                                        settings: {
                                            label: 'Раскрыть'
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
                                            beforeSend: 'RequstCallback.beforeSend',
                                            success: 'RequstCallback.success',
                                            error: 'RequstCallback.error',
                                            complete: 'RequstCallback.complete'
                                        }
                                    }
                                },
                            ]
                        }
                    }
                },
                {
                    name: 'edit',
                    component: {
                        name: 'ue-form',
                        settings: {
                            dataSource: staffDataSource,
                            body: [
                                {
                                    component: {
                                        name: 'ue-form-tab',
                                        settings: {
                                            label: 'Tab 1',
                                            fields: [
                                                'id',
                                                //'name', 'email'
                                                {
                                                    name: "fio",
                                                    component: {
                                                        name: 'ue-form-group',
                                                        settings: {
                                                            label: 'Group 1',
                                                            fields: ['name', 'email']
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    component: {
                                        name: 'ue-form-tab',
                                        settings: {
                                            label: 'Tab 2',
                                            fields: [
                                                {
                                                    component: {
                                                        name: 'ue-table',
                                                        settings: {
                                                            label: 'Messages',
                                                            dataSource: messagesDataSource,
                                                            columns: ['id', 'title']
                                                        }
                                                    }
                                                },
                                                {
                                                    component: {
                                                        name: 'ue-button-request1',
                                                        settings: {
                                                            label: 'This is button!!!',
                                                            request: {
                                                                url: '//ya.ru',
                                                                method: 'GET'
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            ],
                            footer: [
                                {
                                    component: {
                                        name: 'ue-button-update',
                                        settings: {
                                            label: 'Обновить',
                                            state: 'index'
                                        }
                                    }
                                },
                                {
                                    component: {
                                        name: 'ue-button-delete',
                                        settings: {
                                            label: 'Удалить',
                                            state: 'index'
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
                                            beforeSend: 'RequstCallback.beforeSend',
                                            success: 'RequstCallback.success',
                                            error: 'RequstCallback.error',
                                            complete: 'RequstCallback.complete'
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
            ]
        }
    ]
});