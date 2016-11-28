window.RequstCallback = {
    beforeAction: function() {
        console.log('Ïðèâåò ìèð!!! ÿ beforeSend');
    }
};

var elementDataSource = {
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
            name: 'number',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'просто number',
                    validators:[
                        {
                            type: 'number'
                        }
                    ]
                }
            }
        },
        {
            name: 'number_step',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'number c шагом(step) 10',
                    validators:[
                        {
                            type: 'number',
                            step: 10
                        }
                    ]
                }
            }
        },
        {
            name: 'number_minmax',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'number c ограничением min = 0 и max = 100',
                    validators:[
                        {
                            type: 'number',
                            min: 0,
                            max: 100
                        }
                    ]
                }
            }
        },
        {
            name: 'number_minmax_step',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'number c ограничением min = 0 и max = 100 и шагом 10',
                    validators:[
                        {
                            type: 'number',
                            min: 0,
                            max: 100,
                            step: 10
                        }
                    ]
                }
            }
        },
        {
            name: 'string',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'Простое поле string'
                }
            }
        },
        {
            name: 'string_trim',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'string c trim->true',
                    validators:[
                        {
                            type: 'string',
                            trim: true
                        }
                    ]
                }
            }
        },
        {
            name: 'string_minmax',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'string c ограничеме по длинне minLength = 2, maxLength = 25',
                    validators:[
                        {
                            type: 'string',
                            minLength: 2,
                            maxLength: 25
                        }
                    ]
                }
            }
        },
        {
            name: 'string_minmax_trim',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'string c ограничеме по длинне minLength = 2, maxLength = 25, trim',
                    validators:[
                        {
                            type: 'string',
                            minLength: 2,
                            maxLength: 25,
                            trim: true
                        }
                    ]
                }
            }
        },
        {
            name: 'string_url',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'string contentType = url',
                    validators:[
                        {
                            type: 'string',
                            contentType: 'url'
                        }
                    ]
                }
            }
        },
        {
            name: 'string_email',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'string contentType = email',
                    validators:[
                        {
                            type: 'string',
                            contentType: 'email'
                        }
                    ]
                }
            }
        },
        {
            name: 'string_password',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'string contentType = password',
                    validators:[
                        {
                            type: 'string',
                            contentType: 'password'
                        }
                    ]
                }
            }
        },
        {
            name: 'string_pattern',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'string pattern = [0-9][a-z]',
                    validators:[
                        {
                            type: 'string',
                            pattern: '[0-9][a-z]'
                        }
                    ]
                }
            }
        },
        {
            name: 'date',
            component: {
                name: 'ue-date',
                settings: {
                    label: 'date'
                }
            }
        },
        {
            name: 'date_max',
            component: {
                name: 'ue-date',
                settings: {
                    label: 'date max = 10.12.2016',
                    validators:[
                        {
                            type: 'date',
                            maxDate: '10.12.2016'
                        }
                    ]
                }
            }
        },
        {
            name: 'date_min',
            component: {
                name: 'ue-date',
                settings: {
                    label: 'date min = 10.11.2016',
                    validators:[
                        {
                            type: 'date',
                            minDate: '10.11.2016'
                        }
                    ]
                }
            }
        },
        {
            name: 'date_minmax',
            component: {
                name: 'ue-date',
                settings: {
                    label: 'date min = 10.11.2016, max = 10.12.2016',
                    validators:[
                        {
                            type: 'date',
                            minDate: '10.11.2016',
                            maxDate: '10.12.2016'
                        }
                    ]
                }
            }
        },
        {
            name: 'date_format',
            component: {
                name: 'ue-date',
                settings: {
                    label: 'date min = 10.11.2016, max = 10.12.2016',
                    validators:[
                        {
                            type: 'date',
                            format: 'YYYY-DD-MM'
                        }
                    ]
                }
            }
        },
        {
            name: 'date_minmax_format',
            component: {
                name: 'ue-date',
                settings: {
                    label: 'date min = 10.11.2016, max = 10.12.2016',
                    validators:[
                        {
                            type: 'date',
                            format: 'YYYY-DD-MM',
                            minDate: '2016-10-12',
                            maxDate: '2016-10-11'
                        }
                    ]
                }
            }
        },{
            name: 'datetime',
            component: {
                name: 'ue-datetime',
                settings: {
                    label: 'datetime'
                }
            }
        },
        {
            name: 'datetime_max',
            component: {
                name: 'ue-datetime',
                settings: {
                    label: 'datetime max = 10.12.2016 15:55:00',
                    validators:[
                        {
                            type: 'date',
                            maxDate: '10.12.2016 15:55:00'
                        }
                    ]
                }
            }
        },
        {
            name: 'datetime_min',
            component: {
                name: 'ue-datetime',
                settings: {
                    label: 'datetime min = 10.11.2016 15:40:00',
                    validators:[
                        {
                            type: 'date',
                            minDate: '10.11.2016 15:40:00'
                        }
                    ]
                }
            }
        },
        {
            name: 'datetime_minmax',
            component: {
                name: 'ue-datetime',
                settings: {
                    label: 'datetime min = 10.11.2016 15:40:00, max = 10.12.2016 15:55:00',
                    validators:[
                        {
                            type: 'date',
                            minDate: '10.11.2016 15:40:00',
                            maxDate: '10.12.2016 15:55:00'
                        }
                    ]
                }
            }
        },
        {
            name: 'datetime_format',
            component: {
                name: 'ue-datetime',
                settings: {
                    label: 'datetime min = 10.11.2016, max = 10.12.2016',
                    validators:[
                        {
                            type: 'date',
                            format: 'YYYY-DD-MM HH:mm'
                        }
                    ]
                }
            }
        },
        {
            name: 'datetime_minmax_format',
            component: {
                name: 'ue-datetime',
                settings: {
                    label: 'datetime min = 10.11.2016, max = 10.12.2016',
                    validators:[
                        {
                            type: 'date',
                            format: 'YYYY-DD-MM HH:mm',
                            minDate: '2016-10-12 15:40',
                            maxDate: '2016-10-11 15:55'
                        }
                    ]
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
            name: 'element',
            label: 'Элементы',
            states: [
                {
                    name: 'index',
                    url: '/element',
                    component: {
                        name: 'ue-grid',
                        settings: {
                            dataSource: elementDataSource,
                            header: {
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
                            columns: ['number', 'number_step'],
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
                    name: 'edit',
                    url: '/element/:pk',
                    component: {
                        name: 'ue-form',
                        settings: {
                            dataSource: elementDataSource,
                            body: [
                                {
                                    component: {
                                        name: 'ue-form-tabs',
                                        settings: {
                                            tabs: [
                                                {
                                                    label: 'NUMBER',
                                                    fields: [
                                                        'number',
                                                        'number_step',
                                                        'number_minmax',
                                                        'number_minmax_step'

                                                    ]
                                                },
                                                {
                                                    label: 'STRING',
                                                    fields: [
                                                        'string',
                                                        'string_minmax',
                                                        'string_trim',
                                                        'string_minmax_trim',
                                                        'string_url',
                                                        'string_email',
                                                        'string_password',
                                                        'string_pattern'
                                                    ]
                                                },
                                                {
                                                    label: 'DATE',
                                                    fields: [
                                                        'date',
                                                        'date_min',
                                                        'date_max',
                                                        'date_minmax',
                                                        'date_format',
                                                        'date_minmax_format'
                                                    ]
                                                },
                                                {
                                                    label: 'DATETIME',
                                                    fields: [
                                                        'datetime',
                                                        'datetime_min',
                                                        'datetime_max',
                                                        'datetime_minmax',
                                                        'datetime_format',
                                                        'datetime_minmax_format'
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
