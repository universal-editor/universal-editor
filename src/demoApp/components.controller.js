
(function() {
    'use strict';

    angular
        .module('demoApp')
        .controller('ComponentsController', ComponentsController);

    ComponentsController.$inject = [];

    function ComponentsController() {
        var demoDataSource = {
            type: 'REST',
            url: '//universal-backend.dev/rest/v1/staff',
            fields: [
                {
                    name: 'title',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'Title'
                        }
                    }
                },
                {
                    name: 'status',
                    component: {
                        name: 'ue-radio',
                        settings: {
                            label: 'Status',
                            values: {
                                0: 'Draft',
                                10: 'Archived',
                                100: 'Published',
                            }
                        }
                    }
                },
                {
                    name: 'date',
                    component: {
                        name: 'ue-datetime',
                        settings: {
                            label: 'Date of publication'
                        }
                    }
                }
            ]
        };
        var vm = this;
        vm.ueConfig = {
            component: {
                name: 'ue-group',
                settings: {
                    label: 'Components',
                    fields: [
                        {
                            component: {
                                name: 'ue-group',
                                settings: {
                                    label: 'String',
                                    fields: [
                                        {
                                            component: {
                                                name: 'ue-custom-component',
                                                settings: {
                                                    readonly: false,
                                                    colorText: '#445866',
                                                    widthField: '400px'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'Простое поле string'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'string c trim->true',
                                                    validators: [
                                                        {
                                                            type: 'string',
                                                            trim: true
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'string c ограничеме по длинне minLength = 2, maxLength = 25',
                                                    validators: [
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
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'string c ограничеме по длинне minLength = 2, maxLength = 25, trim',
                                                    validators: [
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
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'string contentType = url',
                                                    validators: [
                                                        {
                                                            type: 'string',
                                                            contentType: 'url'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'string contentType = email',
                                                    validators: [
                                                        {
                                                            type: 'string',
                                                            contentType: 'email'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'string contentType = password',
                                                    validators: [
                                                        {
                                                            type: 'string',
                                                            contentType: 'password'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'string pattern = [0-9][a-z]',
                                                    validators: [
                                                        {
                                                            type: 'string',
                                                            pattern: '[0-9][a-z]'
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            component: {
                                name: 'ue-group',
                                settings: {
                                    label: 'Textareas',
                                    fields: [
                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'Простое поле textarea'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'textarea c trim->true',
                                                    validators: [
                                                        {
                                                            type: 'string',
                                                            trim: true
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'textarea c ограничеме по длинне minLength = 2, maxLength = 25',
                                                    validators: [
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
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'textarea c ограничеме по длинне minLength = 2, maxLength = 25, trim',
                                                    validators: [
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
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'textarea pattern = [0-9][a-z]',
                                                    validators: [
                                                        {
                                                            type: 'string',
                                                            pattern: '[0-9][a-z]'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'textarea multiple',
                                                    validators: [
                                                        {
                                                            type: 'string'
                                                        }
                                                    ],
                                                    multiple: true
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            component: {
                                name: 'ue-group',
                                settings: {
                                    label: 'Numbers',
                                    fields: [
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'просто number',
                                                    validators: [
                                                        {
                                                            type: 'number'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'number c шагом(step) 10',
                                                    validators: [
                                                        {
                                                            type: 'number',
                                                            step: 10
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'number c ограничением min = 0 и max = 100',
                                                    validators: [
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
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'number c ограничением min = 0 и max = 100 и шагом 10',
                                                    validators: [
                                                        {
                                                            type: 'number',
                                                            min: 0,
                                                            max: 100,
                                                            step: 10
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            component: {
                                name: 'ue-group',
                                settings: {
                                    label: 'Dates',
                                    fields: [
                                        {
                                            component: {
                                                name: 'ue-date',
                                                settings: {
                                                    label: 'date'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-date',
                                                settings: {
                                                    label: 'date max = 10.12.2016',
                                                    validators: [
                                                        {
                                                            type: 'date',
                                                            maxDate: '10.12.2016'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-date',
                                                settings: {
                                                    label: 'date min = 10.11.2016',
                                                    validators: [
                                                        {
                                                            type: 'date',
                                                            minDate: '10.11.2016'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-date',
                                                settings: {
                                                    label: 'date min = 10.11.2016, max = 10.12.2016',
                                                    validators: [
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
                                            component: {
                                                name: 'ue-date',
                                                settings: {
                                                    label: 'date min = 10.11.2016, max = 10.12.2016',
                                                    validators: [
                                                        {
                                                            type: 'date',
                                                            format: 'YYYY-DD-MM'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-date',
                                                settings: {
                                                    label: 'date min = 10.11.2016, max = 10.12.2016',
                                                    validators: [
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
                                            component: {
                                                name: 'ue-datetime',
                                                settings: {
                                                    label: 'datetime'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-datetime',
                                                settings: {
                                                    label: 'datetime max = 10.12.2016 15:55:00',
                                                    validators: [
                                                        {
                                                            type: 'date',
                                                            maxDate: '10.12.2016 15:55:00'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-datetime',
                                                settings: {
                                                    label: 'datetime min = 10.11.2016 15:40:00',
                                                    validators: [
                                                        {
                                                            type: 'date',
                                                            minDate: '10.11.2016 15:40:00'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-datetime',
                                                settings: {
                                                    label: 'datetime min = 10.11.2016 15:40:00, max = 10.12.2016 15:55:00',
                                                    validators: [
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
                                            component: {
                                                name: 'ue-datetime',
                                                settings: {
                                                    label: 'datetime min = 10.11.2016, max = 10.12.2016',
                                                    validators: [
                                                        {
                                                            type: 'date',
                                                            format: 'YYYY-DD-MM HH:mm'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-datetime',
                                                settings: {
                                                    label: 'datetime min = 10.11.2016, max = 10.12.2016',
                                                    validators: [
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
                                            component: {
                                                name: 'ue-time',
                                                settings: {
                                                    label: 'time'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-time',
                                                settings: {
                                                    label: 'time max = 15:55',
                                                    validators: [
                                                        {
                                                            type: 'date',
                                                            maxDate: '15:55'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-time',
                                                settings: {
                                                    label: 'time min 15:40:00',
                                                    validators: [
                                                        {
                                                            type: 'date',
                                                            minDate: '15:40'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-time',
                                                settings: {
                                                    label: 'time min = 15:40, max = 15:55',
                                                    validators: [
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
                                            component: {
                                                name: 'ue-time',
                                                settings: {
                                                    label: 'time format = mm:HH',
                                                    validators: [
                                                        {
                                                            type: 'date',
                                                            format: 'mm:HH'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-time',
                                                settings: {
                                                    label: 'time min = 15:40, max = 15:55 format = mm:HH',
                                                    validators: [
                                                        {
                                                            type: 'date',
                                                            format: 'mm:HH',
                                                            minDate: '15:40',
                                                            maxDate: '15:55'
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            component: {
                                name: 'ue-group',
                                settings: {
                                    label: 'Checkboxes',
                                    fields: [
                                        {
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
                                            component: {
                                                name: 'ue-checkbox',
                                                settings: {
                                                    label: 'checkbox с данными в конфиге value=array, defaultValue = "Variable 1"',
                                                    values: [
                                                        "Variable 1",
                                                        "Variable 2",
                                                        "Variable 3"
                                                    ],
                                                    defaultValue: ["Variable 1"]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-checkbox',
                                                settings: {
                                                    label: 'checkbox с данными в конфиге,  defaultValue = ["a", "b"]',
                                                    values: {
                                                        "a": "Variable 1",
                                                        "b": "Variable 2",
                                                        "c": "Variable 3"
                                                    },
                                                    defaultValue: ["a", "b"]
                                                }
                                            }
                                        },
                                        {
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
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            component: {
                                name: 'ue-group',
                                settings: {
                                    label: 'Radio buttons',
                                    fields: [
                                        {
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
                                            component: {
                                                name: 'ue-radiolist',
                                                settings: {
                                                    label: 'radiolist с данными в конфиге value=array, defaultValue = "Variable 1"',
                                                    values: [
                                                        "Variable 1",
                                                        "Variable 2",
                                                        "Variable 3"
                                                    ],
                                                    defaultValue: "Variable 1"
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-radiolist',
                                                settings: {
                                                    label: 'radiolist с данными в конфиге,  defaultValue = "b"',
                                                    values: {
                                                        "a": "Variable 1",
                                                        "b": "Variable 2",
                                                        "c": "Variable 3"
                                                    },
                                                    defaultValue: "b"
                                                }
                                            }
                                        },
                                        {
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
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            component: {
                                name: 'ue-group',
                                settings: {
                                    label: 'Colorpicker',
                                    fields: [
                                        {
                                            component: {
                                                name: 'ue-colorpicker',
                                                settings: {
                                                    label: 'colorpicker'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-colorpicker',
                                                settings: {
                                                    label: 'colorpicker c defaultValue',
                                                    defaultValue: "#9C2525"
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-colorpicker',
                                                settings: {
                                                    label: 'colorpicker c defaultValue, multiple',
                                                    defaultValue: ['#9C2525'],
                                                    multiple: true
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-colorpicker',
                                                settings: {
                                                    label: 'colorpicker c multiple',
                                                    multiple: true
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            component: {
                                name: 'ue-group',
                                settings: {
                                    label: 'Dropdown',
                                    fields: [
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'Значения для списка прописаны в конфигурации поля.',
                                                    values: {
                                                        "1": "Яблоко",
                                                        "2": "Апельсин",
                                                        "3": "Груша",
                                                        "4": "Дыня",
                                                        "5": "Арбуз"
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
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
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'select с данными в конфиге value=array, defaultValue = "Variable 1"',
                                                    values: [
                                                        "Variable 1",
                                                        "Variable 2",
                                                        "Variable 3"
                                                    ],
                                                    defaultValue: ["Variable 1"]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'select с данными в конфиге,  defaultValue = "Variable 1"',
                                                    values: {
                                                        "1": "Яблоко",
                                                        "2": "Апельсин",
                                                        "3": "Груша",
                                                        "4": "Дыня",
                                                        "5": "Арбуз"
                                                    },
                                                    defaultValue: ["1", "2"]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
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
                                            component: {
                                                name: "ue-dropdown",
                                                settings: {
                                                    "label": "Множественный режим",
                                                    "filterable": true,
                                                    "values": {
                                                        "1": "Яблоко",
                                                        "2": "Апельсин",
                                                        "3": "Груша",
                                                        "4": "Дыня",
                                                        "5": "Арбуз"
                                                    },
                                                    "multiple": true
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: "ue-dropdown",
                                                settings: {
                                                    label: "Поиск",
                                                    filterable: true,
                                                    valuesRemote: {
                                                        fields: {
                                                            value: "id",
                                                            label: "name"
                                                        },
                                                        url: "http://universal-backend.dev/rest/v1/country"
                                                    },
                                                    placeholder: "Найти",
                                                    search: true
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: "ue-dropdown",
                                                settings: {
                                                    label: "Дерево",
                                                    valuesRemote: {
                                                        fields: {
                                                            value: "id",
                                                            label: "title"
                                                        },
                                                        url: "http://universal-backend.dev/rest/v1/news/categories?expand=child_count"
                                                    },
                                                    tree: {
                                                        selectBranches: false
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: "ue-dropdown",
                                                settings: {
                                                    label: "Дерево с ветвями",
                                                    valuesRemote: {
                                                        fields: {
                                                            value: "id",
                                                            label: "title"
                                                        },
                                                        url: "http://universal-backend.dev/rest/v1/news/categories?expand=child_count"
                                                    },
                                                    tree: {
                                                        parentField: "parent_id",
                                                        childCountField: "child_count",
                                                        selectBranches: true
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: "ue-dropdown",
                                                settings: {
                                                    label: "Множественное дерево",
                                                    multiple: true,
                                                    valuesRemote: {
                                                        fields: {
                                                            value: "id",
                                                            label: "title"
                                                        },
                                                        url: "http://universal-backend.dev/rest/v1/news/categories?expand=child_count"
                                                    },
                                                    tree: {
                                                        parentField: "parent_id",
                                                        childCountField: "child_count",
                                                        selectBranches: false
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: "ue-dropdown",
                                                settings: {
                                                    label: "Дерево с поиском",
                                                    search: true,
                                                    placeholder: "Найти",
                                                    valuesRemote: {
                                                        fields: {
                                                            value: "id",
                                                            label: "title"
                                                        },
                                                        url: "http://universal-backend.dev/rest/v1/news/categories?expand=child_count"
                                                    },
                                                    tree: {
                                                        parentField: "parent_id",
                                                        childCountField: "child_count",
                                                        selectBranches: false
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: "ue-dropdown",
                                                settings: {
                                                    label: "Множественное дерево с поиском и ветвями",
                                                    multiple: true,
                                                    search: true,
                                                    placeholder: "Найти",
                                                    valuesRemote: {
                                                        fields: {
                                                            value: "id",
                                                            label: "title"
                                                        },
                                                        url: "http://universal-backend.dev/rest/v1/news/categories?expand=child_count"
                                                    },
                                                    tree: {
                                                        parentField: "parent_id",
                                                        childCountField: "child_count",
                                                        selectBranches: true
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            component: {
                                name: 'ue-group',
                                settings: {
                                    label: 'Autocomplete',
                                    fields: [
                                        {
                                            component: {
                                                name: "ue-autocomplete",
                                                settings: {
                                                    label: "Поле autocomplete",
                                                    valuesRemote: {
                                                        fields: {
                                                            value: "id",
                                                            label: "name"
                                                        },
                                                        url: "http://universal-backend.dev/rest/v1/staff"
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: "ue-autocomplete",
                                                settings: {
                                                    label: "Поле autocomplete в режиме multiple",
                                                    valuesRemote: {
                                                        fields: {
                                                            value: "id",
                                                            label: "name"
                                                        },
                                                        url: "http://universal-backend.dev/rest/v1/staff"
                                                    },
                                                    multiple: true
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: "ue-autocomplete",
                                                settings: {
                                                    label: "Поле autocomplete с константными данными в виде объекта",
                                                    values: {
                                                        "1": "Яблоко",
                                                        "2": "Апельсин",
                                                        "3": "Груша",
                                                        "4": "Дыня",
                                                        "5": "Арбуз"
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: "ue-autocomplete",
                                                settings: {
                                                    label: "Поле autocomplete с константными данными в виде массива в multiple",
                                                    values: [
                                                        "Яблоко",
                                                        "Апельсин",
                                                        "Груша",
                                                        "Дыня",
                                                        "Арбуз",
                                                        "Мандарин",
                                                        "Помидор",
                                                        "Огурец",
                                                        "Морковь",
                                                        "Картошка",
                                                        "Тыква",
                                                        "Банан"
                                                    ],
                                                    multiple: true
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: "ue-autocomplete",
                                                settings: {
                                                    label: "Поле autocomplete с константными данными в виде объекта в multiple",
                                                    values: {
                                                        'a': 'Яблоко',
                                                        'b': 'Апельсин',
                                                        'c': 'Груша',
                                                        'd': 'Дыня',
                                                        'e': 'Арбуз',
                                                        'f': 'Мандарин',
                                                        'g': 'Помидор',
                                                        'q': 'Огурец',
                                                        'w': 'Морковь',
                                                        'r': 'Картошка',
                                                        't': 'Тыква',
                                                        'z': 'Банан'
                                                    },
                                                    multiple: true
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            component: {
                                name: 'ue-group',
                                settings: {
                                    label: 'Buttons',
                                    countInLine: 3,
                                    fields: [
                                        {
                                            component: {
                                                name: 'ue-button-goto',
                                                settings: {
                                                    label: 'Simple button'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-button-request',
                                                settings: {
                                                    label: 'Send request to server',
                                                    url: '//universal-backend.dev/rest/v1/staff',
                                                    method: 'GET',
                                                    beforeSend: function() {
                                                        alert('Before trigger');
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-button-request',
                                                settings: {
                                                    label: 'Open Yandex.com',
                                                    url: 'https://www.yandex.com',
                                                    target: '_blank'
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            component: {
                                name: 'ue-group',
                                settings: {
                                    label: 'Data management',
                                    fields: [
                                        {
                                            component: {
                                                name: 'ue-group',
                                                settings: {
                                                    label: 'Grid',
                                                    fields: [
                                                        {
                                                            component: {
                                                                name: 'ue-grid',
                                                                settings: {
                                                                    dataSource: demoDataSource,
                                                                    columns: ['title', 'status', 'date']
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-group',
                                                settings: {
                                                    label: 'Form',
                                                    fields: [
                                                        {
                                                            component: {
                                                                name: 'ue-form',
                                                                settings: {
                                                                    dataSource: demoDataSource,
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
                                                                                            label: 'Article',
                                                                                            fields: [
                                                                                                {
                                                                                                    component: {
                                                                                                        name: 'ue-radio',
                                                                                                        settings: {
                                                                                                            label: 'Status',
                                                                                                            values: {
                                                                                                                0: 'Draft',
                                                                                                                10: 'Archived',
                                                                                                                100: 'Published',
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                },
                                                                                                {
                                                                                                    component: {
                                                                                                        name: 'ue-string',
                                                                                                        settings: {
                                                                                                            label: 'Title'
                                                                                                        }
                                                                                                    }
                                                                                                },
                                                                                                {
                                                                                                    component: {
                                                                                                        name: 'ue-datetime',
                                                                                                        settings: {
                                                                                                            label: 'Date of publication'
                                                                                                        }
                                                                                                    }
                                                                                                },
                                                                                                {
                                                                                                    component: {
                                                                                                        name: 'ue-textarea',
                                                                                                        settings: {
                                                                                                            label: 'Text'
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        {
                                                                                            label: 'SEO',
                                                                                            fields: [
                                                                                                {
                                                                                                    component: {
                                                                                                        name: 'ue-string',
                                                                                                        settings: {
                                                                                                            label: 'Meta description'
                                                                                                        }
                                                                                                    }
                                                                                                },
                                                                                                {
                                                                                                    component: {
                                                                                                        name: 'ue-string',
                                                                                                        settings: {
                                                                                                            label: 'Meta keywords'
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
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        };
    }
})();
