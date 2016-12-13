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
        },
        {
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
        },
        {
            name: 'time',
            component: {
                name: 'ue-time',
                settings: {
                    label: 'time'
                }
            }
        },
        {
            name: 'time_max',
            component: {
                name: 'ue-time',
                settings: {
                    label: 'time max = 15:55',
                    validators:[
                        {
                            type: 'date',
                            maxDate: '15:55'
                        }
                    ]
                }
            }
        },
        {
            name: 'time_min',
            component: {
                name: 'ue-time',
                settings: {
                    label: 'time min 15:40:00',
                    validators:[
                        {
                            type: 'date',
                            minDate: '15:40'
                        }
                    ]
                }
            }
        },
        {
            name: 'time_minmax',
            component: {
                name: 'ue-time',
                settings: {
                    label: 'time min = 15:40, max = 15:55',
                    validators:[
                        {
                            type: 'date',
                            minDate: '15:40',
                            maxDate: '15:55'
                        }
                    ]
                }
            }
        },
        {
            name: 'time_format',
            component: {
                name: 'ue-time',
                settings: {
                    label: 'time format = mm:HH',
                    validators:[
                        {
                            type: 'date',
                            format: 'mm:HH'
                        }
                    ]
                }
            }
        },
        {
            name: 'time_minmax_format',
            component: {
                name: 'ue-time',
                settings: {
                    label: 'time min = 15:40, max = 15:55 format = mm:HH',
                    validators:[
                        {
                            type: 'date',
                            format: 'mm:HH',
                            minDate: '15:40',
                            maxDate: '15:55'
                        }
                    ]
                }
            }
        },
        {
            name: 'checkbox',
            component: {
                name: 'ue-checkbox',
                settings: {
                    label: 'checkbox с данными в конфиге',
                    values: {
                        "a": "Variable 1",
                        "b": "Variable 2",
                        "c": "Variable 3"
                    }
                }
            }
        },
        {
            name: 'checkbox_array',
            component: {
                name: 'ue-checkbox',
                settings: {
                    label: 'checkbox с данными в конфиге value=array',
                    values: [
                        "Variable 1",
                        "Variable 2",
                        "Variable 3"
                    ]
                }
            }
        },
        {
            name: 'checkbox_array_defaultValue',
            component: {
                name: 'ue-checkbox',
                settings: {
                    label: 'checkbox с данными в конфиге value=array, defaultValue = "Variable 1"',
                    values: [
                        "Variable 1",
                        "Variable 2",
                        "Variable 3"
                    ],
                    defaultValue : ["Variable 1"]
                }
            }
        },
        {
            name: 'checkbox_defaultValue',
            component: {
                name: 'ue-checkbox',
                settings: {
                    label: 'checkbox с данными в конфиге,  defaultValue = "Variable 1"',
                    values: {
                        "a": "Variable 1",
                        "b": "Variable 2",
                        "c": "Variable 3"
                    },
                    defaultValue : ["a", "b"]
                }
            }
        },
        {
            name: 'checkbox_valuesRemote',
            component: {
                name: 'ue-checkbox',
                settings: {
                    label: 'checkbox с valuesRemote',
                    valuesRemote: {
                        fields: {
                            value: "id",
                            label: "name"
                        },
                        url: "http://universal-backend.dev/rest/v1/country"
                    }
                }
            }
        },
        {
            name: 'checkbox_valuesRemote_without_label',
            component: {
                name: 'ue-checkbox',
                settings: {
                    label: 'checkbox с valuesRemote без value',
                    valuesRemote: {
                        fields: {
                            value: "id"
                        },
                        url: "http://universal-backend.dev/rest/v1/country"
                    }
                }
            }
        },
        {
            name: 'radiolist',
            component: {
                name: 'ue-radiolist',
                settings: {
                    label: 'radiolist с данными в конфиге',
                    values: {
                        "a": "Variable 1",
                        "b": "Variable 2",
                        "c": "Variable 3"
                    }
                }
            }
        },
        {
            name: 'radiolist_array',
            component: {
                name: 'ue-radiolist',
                settings: {
                    label: 'radiolist с данными в конфиге value=array',
                    values: [
                        "Variable 1",
                        "Variable 2",
                        "Variable 3"
                    ]
                }
            }
        },
        {
            name: 'radiolist_array_defaultValue',
            component: {
                name: 'ue-radiolist',
                settings: {
                    label: 'radiolist с данными в конфиге value=array, defaultValue = "Variable 1"',
                    values: [
                        "Variable 1",
                        "Variable 2",
                        "Variable 3"
                    ],
                    defaultValue : "Variable 1"
                }
            }
        },
        {
            name: 'radiolist_defaultValue',
            component: {
                name: 'ue-radiolist',
                settings: {
                    label: 'radiolist с данными в конфиге,  defaultValue = "Variable 1"',
                    values: {
                        "a": "Variable 1",
                        "b": "Variable 2",
                        "c": "Variable 3"
                    },
                    defaultValue : "a"
                }
            }
        },
        {
            name: 'radiolist_valuesRemote',
            component: {
                name: 'ue-radiolist',
                settings: {
                    label: 'radiolist с valuesRemote',
                    valuesRemote: {
                        fields: {
                            value: "id",
                            label: "name"
                        },
                        url: "http://universal-backend.dev/rest/v1/country"
                    }
                }
            }
        },
        {
            name: 'radiolist_valuesRemote_without_label',
            component: {
                name: 'ue-radiolist',
                settings: {
                    label: 'radiolist с valuesRemote без value',
                    valuesRemote: {
                        fields: {
                            value: "id"
                        },
                        url: "http://universal-backend.dev/rest/v1/country"
                    }
                }
            }
        },
        {
            name: 'colorpicker',
            component: {
                name: 'ue-colorpicker',
                settings: {
                    label: 'colorpicker'
                }
            }
        },
        {
            name: 'colorpicker_defaultValue',
            component: {
                name: 'ue-colorpicker',
                settings: {
                    label: 'colorpicker c defaultValue',
                    defaultValue : "#FFFFFF"
                }
            }
        },
        {
            name: 'colorpicker_defaultValue_multiple',
            component: {
                name: 'ue-colorpicker',
                settings: {
                    label: 'colorpicker c defaultValue, multiple',
                    defaultValue : '#FFFFFF',
                    multiple: true
                }
            }
        },
        {
            name: 'colorpicker_multiple',
            component: {
                name: 'ue-colorpicker',
                settings: {
                    label: 'colorpicker c multiple',
                    multiple: true
                }
            }
        },
        {
            name: 'select',
            component: {
                name: 'ue-select',
                settings: {
                    label: 'select с данными в конфиге',
                    values: {
                        "a": "Variable 1",
                        "b": "Variable 2",
                        "c": "Variable 3"
                    }
                }
            }
        },
        {
            name: 'select_array',
            component: {
                name: 'ue-select',
                settings: {
                    label: 'select с данными в конфиге value=array',
                    values: [
                        "Variable 1",
                        "Variable 2",
                        "Variable 3"
                    ]
                }
            }
        },
        {
            name: 'select_array_defaultValue',
            component: {
                name: 'ue-select',
                settings: {
                    label: 'select с данными в конфиге value=array, defaultValue = "Variable 1"',
                    values: [
                        "Variable 1",
                        "Variable 2",
                        "Variable 3"
                    ],
                    defaultValue : ["Variable 1"]
                }
            }
        },
        {
            name: 'select_defaultValue',
            component: {
                name: 'ue-select',
                settings: {
                    label: 'select с данными в конфиге,  defaultValue = "Variable 1"',
                    values: {
                        "a": "Variable 1",
                        "b": "Variable 2",
                        "c": "Variable 3"
                    },
                    defaultValue : ["a", "b"]
                }
            }
        },
        {
            name: 'select_valuesRemote',
            component: {
                name: 'ue-select',
                settings: {
                    label: 'select с valuesRemote',
                    valuesRemote: {
                        fields: {
                            value: "id",
                            label: "name"
                        },
                        url: "http://universal-backend.dev/rest/v1/country"
                    }
                }
            }
        },
        {
            name: 'select_valuesRemote_without_label',
            component: {
                name: 'ue-select',
                settings: {
                    label: 'select с valuesRemote без value',
                    valuesRemote: {
                        fields: {
                            value: "id"
                        },
                        url: "http://universal-backend.dev/rest/v1/country"
                    }
                }
            }
        }
    ]
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
                settings:{
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
                name: "ue-select",
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
                settings:{
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
                    values: {
                        "1": ""
                    }
                }
            }
        },
        {
            name: "created_at",
            component: {
                name: 'ue-datetime',
                settings: {
                    label: "Дата создания"
                }
            }
        },
        {
            name: "updated_at",
            component: {
                name: 'ue-datetime',
                settings: {
                    label: "Дата обновления"
                }
            }
        }
    ]
};

var newsDataSource = {
    type: 'REST',
    url: '//universal-backend.dev/rest/v1/news',
    sortBy: '-id',
    primaryKey: 'id',
    parentField: 'parent_id',
    keys:{
        items: 'items',
        meta: '_meta'
    },
    fields:[
        {
            name: "published",
            component: {
                name: 'ue-checkbox',
                settings: {
                    label: "Опубликовано",
                    values: {
                        "1": ""
                    }
                }
            }
        },
        {
            name: "published_at",
            component: {
                name: 'ue-datetime',
                settings: {
                    label: "Дата публикации"
                }
            }
        },
        {
            name: "category_id",
            component: {
                name: "ue-select",
                settings: {
                    label: 'Категория',
                    valuesRemote: {
                        fields: {
                            value: "id",
                            label: "title",
                            "parent": "parent_id",
                            "childCount": "child_count"
                        },
                        url: "http://universal-backend.dev/rest/v1/news/category?expand=child_count"
                    },
                    search: true,
                    tree: true,
                    selectBranches: true
                }
            }
        },
        {
            name: "title",
            component: {
                name: 'ue-string',
                settings: {
                    label: "Заголовок"
                }
            }
        },
        {
            name: "description",
            component: {
                name: 'ue-textarea',
                settings: {
                    label: "Краткое описание"
                }
            }
        },
        {
            name: "authors",
            component: {
                name: "ue-autocomplete",
                settings:{
                    label: "Авторы",
                    valuesRemote: {
                        fields: {
                            value: "id",
                            label: "name"
                        },
                        url: "http://universal-backend.dev/rest/v1/staff"
                    },
                    multiple: false,
                    expandable: true,
                    multiname: "staff_id"
                }
            }
        },
        {
            name: "tags",
            component: {
                name: "ue-autocomplete",
                settings:{
                    label: "Теги",
                    valuesRemote: {
                        fields: {
                            value: "id",
                            label: "name"
                        },
                        url: "http://universal-backend.dev/rest/v1/tags"
                    },
                    multiple: false,
                    expandable: true
                }
            }
        },
        {
            name: "created_at",
            component: {
                name: 'ue-datetime',
                settings: {
                    label: "Дата создания"
                }
            }
        },
        {
            name: "updated_at",
            component: {
                name: 'ue-datetime',
                settings: {
                    label: "Дата обновления"
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
        },
        {
            name: 'news',
            label: 'Новости',
            states: [
                {
                    name: 'index',
                    url: '/news',
                    component: {
                        name: 'ue-grid',
                        settings: {
                            dataSource: newsDataSource,
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
                            columns: ['title', 'authors', 'description'],
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
                    url: '/news/:pk',
                    component: {
                        name: 'ue-form',
                        settings: {
                            dataSource: newsDataSource,
                            body: [
                                {
                                    component: {
                                        name: 'ue-form-tabs',
                                        settings: {
                                            tabs: [
                                                {
                                                    label: 'Новость',
                                                    fields: [
                                                        'published',
                                                        'published_at',
                                                        'category_id',
                                                        'title',
                                                        'description'
                                                    ]
                                                },
                                                {
                                                    label: 'Место',
                                                    fields: [
                                                        'authors',
                                                        'tags'
                                                    ]
                                                },
                                                {
                                                    label: 'Служебное',
                                                    fields: [
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
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        },
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
                                                },
                                                {
                                                    label: 'TIME',
                                                    fields: [
                                                        'time',
                                                        'time_min',
                                                        'time_max',
                                                        'time_minmax',
                                                        'time_format',
                                                        'time_minmax_format'
                                                    ]
                                                },
                                                {
                                                    label: 'CHECKBOX',
                                                    fields: [
                                                        'checkbox',
                                                        'checkbox_array',
                                                        'checkbox_array_defaultValue',
                                                        'checkbox_defaultValue',
                                                        'checkbox_valuesRemote',
                                                        'checkbox_valuesRemote_without_label'
                                                    ]
                                                },
                                                {
                                                    label: 'RADIOLIST',
                                                    fields: [
                                                        'radiolist',
                                                        'radiolist_array',
                                                        'radiolist_array_defaultValue',
                                                        'radiolist_defaultValue',
                                                        'radiolist_valuesRemote',
                                                        'radiolist_valuesRemote_without_label'
                                                    ]
                                                },
                                                {
                                                    label: 'COLORPICKER',
                                                    fields: [
                                                        'colorpicker',
                                                        'colorpicker_defaultValue',
                                                        'colorpicker_defaultValue_multiple',
                                                        'colorpicker_multiple'
                                                    ]
                                                },
                                                {
                                                    label: 'SELECT',
                                                    fields: [
                                                        'select',
                                                        'select_array',
                                                        'select_array_defaultValue',
                                                        'select_defaultValue',
                                                        'select_valuesRemote',
                                                        'select_valuesRemote_without_label'
                                                    ]
                                                },
                                                {
                                                    label: 'Сотрудники',
                                                    fields:[
                                                        {
                                                            component: {
                                                                name: 'ue-grid',
                                                                settings: {
                                                                    label: 'Messages',
                                                                    dataSource: staffDataSource,
                                                                    columns: ['name', 'email'],
                                                                    header: {
                                                                        controls: [
                                                                            {
                                                                                component: {
                                                                                    name: 'ue-button-goto',
                                                                                    settings: {
                                                                                        label: 'создать',
                                                                                        state: 'edit.modal_edit'
                                                                                    }
                                                                                }
                                                                            }
                                                                        ]
                                                                    },
                                                                    contextMenu:[
                                                                        {
                                                                            component: {
                                                                                name: 'ue-button-goto',
                                                                                settings: {
                                                                                    label: 'редактировать',
                                                                                    state: 'edit.modal_edit'
                                                                                }
                                                                            }
                                                                        },
                                                                        {
                                                                            separator: true,
                                                                            component: {
                                                                                name: 'ue-button-service',
                                                                                settings: {
                                                                                    label: 'Удалить1',
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
                                                            component: {
                                                                name: 'ue-grid',
                                                                settings: {
                                                                    label: 'Messages',
                                                                    dataSource: staffDataSource,
                                                                    columns: ['name', 'email'],
                                                                    header: {
                                                                        controls: [
                                                                            {
                                                                                component: {
                                                                                    name: 'ue-button-goto',
                                                                                    settings: {
                                                                                        label: 'создать',
                                                                                        state: 'edit.modal_edit'
                                                                                    }
                                                                                }
                                                                            }
                                                                        ]
                                                                    },
                                                                    contextMenu:[
                                                                        {
                                                                            component: {
                                                                                name: 'ue-button-goto',
                                                                                settings: {
                                                                                    label: 'редактировать',
                                                                                    state: 'edit.modal_edit'
                                                                                }
                                                                            }
                                                                        },
                                                                        {
                                                                            separator: true,
                                                                            component: {
                                                                                name: 'ue-button-service',
                                                                                settings: {
                                                                                    label: 'Удалить2',
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
                },
                {
                    name: 'edit.modal_edit',
                    url: '/staff/:pk',
                    component: {
                        name: 'ue-modal',
                        settings: {
                            size: {
                                width: '70%',
                                height: '60%'
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
                }
            ]
        }
    ]
});
