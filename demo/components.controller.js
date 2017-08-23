
(function() {
    'use strict';

    angular
        .module('demoApp')
        .controller('ComponentsController', ComponentsController);

    function ComponentsController() {
        var demoDataSource = {
            standard: 'YiiSoft',
            transport: {
                url: '//universal-backend.dev/rest/v1/staff'
            },
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
                        name: 'ue-date',
                        settings: {
                            label: 'Date of publication'
                        }
                    }
                }
            ]
        };
        var autocompleteSettingConnectedSingle = {
            component: {
                name: 'ue-autocomplete',
                settings: {
                    label: 'ue-autocomplete connected (single)',
                    values: {
                        'key1': 'value1',
                        'key2': 'value2',
                        'key3': 'value3',
                        'key4': 'value4',
                        'key5': 'value5',
                        'key6': 'value6'
                    }
                }
            }
        };
        var autocompleteSettingConnectedMultiple = {
            component: {
                name: 'ue-autocomplete',
                settings: {
                    label: 'ue-autocomplete connected (multiple)',
                    values: {
                        'key1': 'value1',
                        'key2': 'value2',
                        'key3': 'value3',
                        'key4': 'value4',
                        'key5': 'value5',
                        'key6': 'value6'
                    },
                    multiple: true
                }
            }
        };
        var autocompleteSettingRemotedConnectedSingle = {
            component: {
                name: 'ue-autocomplete',
                settings: {
                    label: 'ue-autocomplete connected  with remoted data (single)',
                    valuesRemote: {
                        fields: {
                            value: 'id',
                            label: 'name'
                        },
                        url: 'http://universal-backend.dev/rest/v1/country'
                    }
                }
            }
        };
        var autocompleteSettingRemotedConnectedMultiple = {
            component: {
                name: 'ue-autocomplete',
                settings: {
                    label: 'ue-autocomplete connected  with remoted data (multiple)',
                    valuesRemote: {
                        fields: {
                            value: 'id',
                            label: 'name'
                        },
                        url: 'http://universal-backend.dev/rest/v1/country'
                    },
                    multiple: true
                }
            }
        };

        var dropdownSettingConnectedSingle = {
            component: {
                name: 'ue-dropdown',
                settings: {
                    label: 'ue-dropdown connected (single)',
                    values: {
                        'key1': 'value1',
                        'key2': 'value2',
                        'key3': 'value3',
                        'key4': 'value4',
                        'key5': 'value5',
                        'key6': 'value6'
                    }
                }
            }
        };
        var dropdownSettingRemotedConnectedSingle = {
            component: {
                name: 'ue-dropdown',
                settings: {
                    label: 'ue-dropdown connected with remoted data (single)',
                    valuesRemote: {
                        fields: {
                            value: 'id',
                            label: 'name'
                        },
                        url: 'http://universal-backend.dev/rest/v1/country'
                    }
                }
            }
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
                                    countInLine: 2,
                                    fields: [
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'Title',
                                                    defaultValue: 'Example'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'Title',
                                                    multiple: true,
                                                    defaultValue: ['Example1', 'Example2']
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'Title',
                                                    readonly: true,
                                                    defaultValue: 'Example'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'Title',
                                                    readonly: true,
                                                    multiple: true,
                                                    defaultValue: ['Example1', 'Example2']
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'Title',
                                                    disabled: true,
                                                    hint: 'Text',
                                                    defaultValue: 'Example'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'Title',
                                                    disabled: true,
                                                    multiple: true,
                                                    hint: 'Text',
                                                    defaultValue: ['Example1', 'Example2']
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'string with limit by the length minLength = 4, maxLength = 25',
                                                    validators: [
                                                        {
                                                            type: 'string',
                                                            minLength: 4,
                                                            maxLength: 10
                                                        }
                                                    ]
                                                }
                                            }
                                        },

                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'string with limit by the length minLength = 2, maxLength = 25',
                                                    multiple: true,
                                                    validators: [
                                                        {
                                                            type: 'string',
                                                            minLength: 4,
                                                            maxLength: 10
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'string with limit by the length minLength = 2',
                                                    validators: [
                                                        {
                                                            type: 'string',
                                                            minLength: 2
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'string with limit by the length minLength = 2',
                                                    multiple: true,
                                                    validators: [
                                                        {
                                                            type: 'string',
                                                            minLength: 2
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'string with limit by the length maxLength = 25',
                                                    validators: [
                                                        {
                                                            type: 'string',
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
                                                    label: 'string with limit by the length maxLength = 25',
                                                    multiple: true,
                                                    validators: [
                                                        {
                                                            type: 'string',
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
                                                    label: 'string contentType = url',
                                                    defaultValue: 'http://yandex.ru',
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
                                                    label: 'string contentType = url',
                                                    multiple: true,
                                                    defaultValue: ['http://yandex.ru', 'http://yandex.ru'],
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
                                                    label: 'string contentType = url',
                                                    disabled: true,
                                                    defaultValue: 'http://yandex.ru',
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
                                                    label: 'string contentType = url',
                                                    disabled: true,
                                                    multiple: true,
                                                    defaultValue: ['http://yandex.ru', 'http://yandex.ru'],
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
                                                    label: 'string contentType = email',
                                                    multiple: true,
                                                    defaultValue: ['email@mail.ru', 'email@mail.ru'],
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
                                                    label: 'string contentType = password',
                                                    multiple: true,
                                                    defaultValue: ['password1', 'password2'],
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
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'string pattern = [0-9][a-z]',
                                                    multiple: true,
                                                    defaultValue: ['', ''],
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
                                    countInLine: 2,
                                    fields: [
                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'Title',
                                                    defaultValue: 'Example'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'Title',
                                                    multiple: true,
                                                    defaultValue: ['Example1', 'Example2']
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'Title',
                                                    readonly: true,
                                                    defaultValue: 'Example'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'Title',
                                                    readonly: true,
                                                    multiple: true,
                                                    defaultValue: ['Example1', 'Example2']
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'Title',
                                                    disabled: true,
                                                    hint: 'Text',
                                                    defaultValue: 'Example'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'Title',
                                                    disabled: true,
                                                    multiple: true,
                                                    hint: 'Text',
                                                    defaultValue: ['Example1', 'Example2']
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'textarea with the limits minLength = 2, maxLength = 25',
                                                    validators: [
                                                        {
                                                            type: 'string',
                                                            minLength: 4,
                                                            maxLength: 10
                                                        }
                                                    ]
                                                }
                                            }
                                        },

                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'textarea with the limits minLength = 2, maxLength = 25',
                                                    multiple: true,
                                                    validators: [
                                                        {
                                                            type: 'string',
                                                            minLength: 4,
                                                            maxLength: 10
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'textarea with the limits minLength = 2',
                                                    validators: [
                                                        {
                                                            type: 'string',
                                                            minLength: 2
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'textarea with the limits minLength = 2',
                                                    multiple: true,
                                                    validators: [
                                                        {
                                                            type: 'string',
                                                            minLength: 2
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'textarea with the limits maxLength = 25',
                                                    validators: [
                                                        {
                                                            type: 'string',
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
                                                    label: 'textarea with the limits maxLength = 25',
                                                    multiple: true,
                                                    validators: [
                                                        {
                                                            type: 'string',
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
                                                    label: 'string contentType = url',
                                                    defaultValue: 'http://yandex.ru',
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
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'string contentType = url',
                                                    multiple: true,
                                                    defaultValue: ['http://yandex.ru', 'http://yandex.ru'],
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
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'string contentType = url',
                                                    disabled: true,
                                                    defaultValue: 'http://yandex.ru',
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
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'string contentType = url',
                                                    disabled: true,
                                                    multiple: true,
                                                    defaultValue: ['http://yandex.ru', 'http://yandex.ru'],
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
                                                name: 'ue-textarea',
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
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'string contentType = email',
                                                    multiple: true,
                                                    defaultValue: ['email@mail.ru', 'email@mail.ru'],
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
                                                name: 'ue-textarea',
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
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'string contentType = password',
                                                    multiple: true,
                                                    defaultValue: ['password1', 'password2'],
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
                                                name: 'ue-textarea',
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
                                        },
                                        {
                                            component: {
                                                name: 'ue-textarea',
                                                settings: {
                                                    label: 'string pattern = [0-9][a-z]',
                                                    multiple: true,
                                                    defaultValue: ['', ''],
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
                                                    label: 'textarea with break lines.',
                                                    defaultValue: 'Text with line breaks.\nBreak.',
                                                    disabled: true
                                                }
                                            }
                                        },
                                    ]
                                }
                            }
                        },
                        {
                            component: {
                                name: 'ue-group',
                                settings: {
                                    label: 'Numbers',
                                    countInLine: 2,
                                    fields: [
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'Easy number',
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
                                                    label: 'Easy number',
                                                    multiple: true,
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
                                                    label: 'number with step 10',
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
                                                    label: 'number with step 10',
                                                    multiple: true,
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
                                                    label: 'number with limits min = 0 и max = 100',
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
                                                    label: 'number with limits min = 0 и max = 100',
                                                    multiple: true,
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
                                                    label: 'number with limits min = 0 и max = 100 и шагом 10',
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
                                        },
                                        {
                                            component: {
                                                name: 'ue-string',
                                                settings: {
                                                    label: 'number with limits min = 0 и max = 100 и шагом 10',
                                                    multiple: true,
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
                                    countInLine: 2,
                                    fields: [
                                        {
                                            component: {
                                                name: 'ue-date',
                                                settings: {
                                                    label: 'date',
                                                    defaultValue: '01.10.2014 23:22:00'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-date',
                                                settings: {
                                                    label: 'date',
                                                    multiple: true
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
                                                    label: 'date max = 10.12.2016',
                                                    multiple: true,
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
                                                    label: 'date min = 10.11.2016',
                                                    multiple: true,
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
                                                    multiple: true,
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
                                                    multiple: true,
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
                                                            minDate: '2016-10-10',
                                                            maxDate: '2016-10-12',
                                                            defaultValue: '2016-10-11'
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
                                                    multiple: true,
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
                                                name: 'ue-date',
                                                settings: {
                                                    label: 'time format = HH:mm',
                                                    validators: [
                                                        {
                                                            type: 'date',
                                                            format: 'HH:mm'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-date',
                                                settings: {
                                                    label: 'time format = HH:mm',
                                                    multiple: true,
                                                    validators: [
                                                        {
                                                            type: 'date',
                                                            format: 'HH:mm'
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-date',
                                                settings: {
                                                    label: 'time format = HH:mm disabled',
                                                    disabled: true,
                                                    validators: [
                                                        {
                                                            type: 'date',
                                                            format: 'HH:mm'
                                                        }
                                                    ],
                                                    defaultValue: '20:40'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-date',
                                                settings: {
                                                    label: 'time format = HH:mm disabled',
                                                    multiple: true,
                                                    disabled: true,
                                                    validators: [
                                                        {
                                                            type: 'date',
                                                            format: 'HH:mm'
                                                        }
                                                    ],
                                                    defaultValue: ['20:40', '21:10']
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
                                                    label: 'checkbox with local data, defaultValue: "a"',
                                                    values: {
                                                        'a': 'Variable 1',
                                                        'b': 'Variable 2',
                                                        'c': 'Variable 3'
                                                    },
                                                    defaultValue: ['a']
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-checkbox',
                                                settings: {
                                                    label: 'checkbox with local data value=array, defaultValue: "Variable 1"',
                                                    values: [
                                                        'Variable 1',
                                                        'Variable 2',
                                                        'Variable 3'
                                                    ],
                                                    defaultValue: ['Variable 1']
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-checkbox',
                                                settings: {
                                                    label: 'checkbox with local data value=array, defaultValue = "Variable 1"',
                                                    values: [
                                                        'Variable 1',
                                                        'Variable 2',
                                                        'Variable 3'
                                                    ],
                                                    defaultValue: ['Variable 1']
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-checkbox',
                                                settings: {
                                                    label: 'checkbox with local data,  defaultValue = ["a", "b"]',
                                                    values: {
                                                        'a': 'Variable 1',
                                                        'b': 'Variable 2',
                                                        'c': 'Variable 3'
                                                    },
                                                    defaultValue: ['a', 'b']
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
                                                            value: 'id',
                                                            label: 'name'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/country'
                                                    },
                                                    defaultValue: [1, 2]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-checkbox',
                                                settings: {
                                                    label: 'checkbox с valuesRemote without value',
                                                    valuesRemote: {
                                                        fields: {
                                                            value: 'id'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/country'
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
                                                    label: 'radiolist with local data ',
                                                    values: {
                                                        'a': 'Variable 1',
                                                        'b': 'Variable 2',
                                                        'c': 'Variable 3'
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-radiolist',
                                                settings: {
                                                    label: 'radiolist with local data  value=array',
                                                    values: [
                                                        'Variable 1',
                                                        'Variable 2',
                                                        'Variable 3'
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-radiolist',
                                                settings: {
                                                    label: 'radiolist with local data  value=array, defaultValue = "Variable 1"',
                                                    values: [
                                                        'Variable 1',
                                                        'Variable 2',
                                                        'Variable 3'
                                                    ],
                                                    defaultValue: 'Variable 1'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-radiolist',
                                                settings: {
                                                    label: 'radiolist with local data ,  defaultValue = "b"',
                                                    values: {
                                                        'a': 'Variable 1',
                                                        'b': 'Variable 2',
                                                        'c': 'Variable 3'
                                                    },
                                                    defaultValue: 'b'
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
                                                            value: 'id',
                                                            label: 'name'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/country'
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-radiolist',
                                                settings: {
                                                    label: 'radiolist с valuesRemote without value',
                                                    valuesRemote: {
                                                        fields: {
                                                            value: 'id'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/country'
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
                                    countInLine: 2,
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
                                                multiple: true,
                                                settings: {
                                                    label: 'colorpicker'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-colorpicker',
                                                settings: {
                                                    label: 'colorpicker with defaultValue',
                                                    defaultValue: '#9C2525'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-colorpicker',
                                                multiple: true,
                                                settings: {
                                                    label: 'colorpicker with defaultValue',
                                                    defaultValue: ['#9C2525']
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
                                                    label: 'ue-dropdown with local data value=array, defaultValue = "Variable 1"',
                                                    values: [
                                                        'Variable 1',
                                                        'Variable 2',
                                                        'Variable 3'
                                                    ],
                                                    defaultValue: 'Variable 1'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'ue-dropdown with local data value=array (defaultValue = ["Variable 1", "Variable 2"])',
                                                    values: [
                                                        'Variable 1',
                                                        'Variable 2',
                                                        'Variable 3'
                                                    ],
                                                    multiple: true,
                                                    defaultValue: ['Variable 1', 'Variable 2']
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'select с valuesRemote (defaultValue = "4")',
                                                    valuesRemote: {
                                                        fields: {
                                                            value: 'id',
                                                            label: 'name'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/country'
                                                    },
                                                    defaultValue: '4'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'select с valuesRemote (defaultValue = [4, 5])',
                                                    multiple: true,
                                                    valuesRemote: {
                                                        fields: {
                                                            value: 'id',
                                                            label: 'name'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/country'
                                                    },
                                                    defaultValue: [4, 5]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'ue-dropdown with local data.',
                                                    values: {
                                                        '1': 'Apple',
                                                        '2': 'Orage',
                                                        '3': 'Pear',
                                                        '4': 'Melon',
                                                        '5': 'Watermelon'
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'ue-dropdown with local data value=array',
                                                    values: [
                                                        'Variable 1',
                                                        'Variable 2',
                                                        'Variable 3'
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'ue-dropdown with local data value=array, defaultValue = "Variable 1"',
                                                    values: [
                                                        'Variable 1',
                                                        'Variable 2',
                                                        'Variable 3'
                                                    ],
                                                    defaultValue: ['Variable 1']
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'ue-dropdown with local data  defaultValue = "Variable 1"',
                                                    values: {
                                                        '1': 'Apple',
                                                        '2': 'Orage',
                                                        '3': 'Pear',
                                                        '4': 'Melon',
                                                        '5': 'Watermelon'
                                                    },
                                                    defaultValue: ['1', '2']
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
                                                            value: 'id',
                                                            label: 'name'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/country'
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'Multiple regim',
                                                    values: {
                                                        '1': 'Apple',
                                                        '2': 'Orage',
                                                        '3': 'Pear',
                                                        '4': 'Melon',
                                                        '5': 'Watermelon'
                                                    },
                                                    multiple: true
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'Search',
                                                    valuesRemote: {
                                                        fields: {
                                                            value: 'id',
                                                            label: 'name'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/country'
                                                    },
                                                    placeholder: 'Country',
                                                    search: true
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'Tree',
                                                    valuesRemote: {
                                                        fields: {
                                                            value: 'id',
                                                            label: 'title'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/news/categories?expand=child_count'
                                                    },
                                                    tree: {
                                                        selectBranches: false
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'Tree with branches',
                                                    valuesRemote: {
                                                        fields: {
                                                            value: 'id',
                                                            label: 'title'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/news/categories?expand=child_count'
                                                    },
                                                    tree: {
                                                        parentField: 'parent_id',
                                                        childCountField: 'child_count',
                                                        selectBranches: true
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'Tree without branches',
                                                    multiple: true,
                                                    valuesRemote: {
                                                        fields: {
                                                            value: 'id',
                                                            label: 'title'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/news/categories?expand=child_count'
                                                    },
                                                    tree: {
                                                        parentField: 'parent_id',
                                                        childCountField: 'child_count',
                                                        selectBranches: false
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'Tree with search',
                                                    search: true,
                                                    placeholder: 'Search',
                                                    valuesRemote: {
                                                        fields: {
                                                            value: 'id',
                                                            label: 'title'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/news/categories?expand=child_count'
                                                    },
                                                    tree: {
                                                        parentField: 'parent_id',
                                                        childCountField: 'child_count',
                                                        selectBranches: false
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-dropdown',
                                                settings: {
                                                    label: 'Tree with search and branches',
                                                    multiple: true,
                                                    search: true,
                                                    placeholder: 'Search',
                                                    valuesRemote: {
                                                        fields: {
                                                            value: 'id',
                                                            label: 'title'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/news/categories?expand=child_count'
                                                    },
                                                    tree: {
                                                        parentField: 'parent_id',
                                                        childCountField: 'child_count',
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
                                                name: 'ue-autocomplete',
                                                settings: {
                                                    label: 'ue-autocomplete with local data value=array, defaultValue = "Variable 1"',
                                                    values: [
                                                        'Variable 1',
                                                        'Variable 2',
                                                        'Variable 3'
                                                    ],
                                                    defaultValue: 'Variable 1'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-autocomplete',
                                                settings: {
                                                    label: 'ue-autocomplete with local data value=array (defaultValue = ["Variable 1", "Variable 2"])',
                                                    values: [
                                                        'Variable 1',
                                                        'Variable 2',
                                                        'Variable 3'
                                                    ],
                                                    multiple: true,
                                                    defaultValue: ['Variable 1', 'Variable 2']
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-autocomplete',
                                                settings: {
                                                    label: 'autocomplete с valuesRemote  (defaultValue = "4")',
                                                    valuesRemote: {
                                                        fields: {
                                                            value: 'id',
                                                            label: 'name'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/country'
                                                    },
                                                    defaultValue: '4'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-autocomplete',
                                                settings: {
                                                    label: 'autocomplete с valuesRemote  (defaultValue = [4, 5])',
                                                    multiple: true,
                                                    valuesRemote: {
                                                        fields: {
                                                            value: 'id',
                                                            label: 'name'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/country'
                                                    },
                                                    defaultValue: [4, 5]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-autocomplete',
                                                settings: {
                                                    label: 'Component autocomplete',
                                                    valuesRemote: {
                                                        fields: {
                                                            value: 'id',
                                                            label: 'name'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/staff'
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-autocomplete',
                                                settings: {
                                                    label: 'ue-autocomplete',
                                                    values: {
                                                        'key1': 'value1',
                                                        'key2': 'value2',
                                                        'key3': 'value3'
                                                    },
                                                    multiple: true
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-autocomplete',
                                                settings: {
                                                    label: 'Ue-autocomplete with multiple',
                                                    valuesRemote: {
                                                        fields: {
                                                            value: 'id',
                                                            label: 'name'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/staff'
                                                    },
                                                    multiple: true
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-autocomplete',
                                                settings: {
                                                    label: 'ue-autocomplete with local data',
                                                    values: {
                                                        '1': 'Apple',
                                                        '2': 'Orage',
                                                        '3': 'Pear',
                                                        '4': 'Melon',
                                                        '5': 'Watermelon'
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-autocomplete',
                                                settings: {
                                                    label: 'ue-autocomplete with local data in array (multiple)',
                                                    values: [
                                                        'Apple',
                                                        'Orange',
                                                        'Pear',
                                                        'Melon',
                                                        'Watermelon',
                                                        'Mandarin',
                                                        'Tomatoes',
                                                        'Cucumber',
                                                        'Carrot',
                                                        'Pumpkin',
                                                        'Banana'
                                                    ],
                                                    multiple: true
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-autocomplete',
                                                settings: {
                                                    label: 'ueautocomplete with local data in object (multiple)',
                                                    values: {
                                                        'a': 'Apple',
                                                        'b': 'Orange',
                                                        'c': 'Pear',
                                                        'd': 'Melon',
                                                        'e': 'Watermelon',
                                                        'f': 'Mandarin',
                                                        'g': 'Tomatoes',
                                                        'q': 'Cucumber',
                                                        'w': 'Carrot',
                                                        'r': 'potatoes ',
                                                        't': 'Pumpkin',
                                                        'z': 'Banana'
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
                                    label: 'Draggable autocomplete',
                                    fields: [
                                        {
                                            component: {
                                                name: 'ue-autocomplete',
                                                settings: {
                                                    label: 'ue-autocomplete with local data',
                                                    values: {
                                                        'key1': 'value1',
                                                        'key2': 'value2',
                                                        'key3': 'value3'
                                                    },
                                                    multiple: true,
                                                    draggable: true,
                                                    defaultValue: ['key2', 'key1']
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-autocomplete',
                                                settings: {
                                                    label: 'Ue-autocomplete with remote data',
                                                    valuesRemote: {
                                                        fields: {
                                                            value: 'id',
                                                            label: 'name'
                                                        },
                                                        url: 'http://universal-backend.dev/rest/v1/staff'
                                                    },
                                                    draggable: true,
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
                                    label: 'Relations of components',
                                    fields: [
                                        {
                                            component: {
                                                name: 'ue-group',
                                                settings: {
                                                    label: 'Related autocomplete',
                                                    fields: [
                                                        autocompleteSettingConnectedMultiple,
                                                        autocompleteSettingConnectedMultiple,
                                                        autocompleteSettingConnectedSingle,
                                                        autocompleteSettingConnectedSingle,
                                                        autocompleteSettingRemotedConnectedSingle,
                                                        autocompleteSettingRemotedConnectedSingle,
                                                        autocompleteSettingRemotedConnectedMultiple,
                                                        autocompleteSettingRemotedConnectedMultiple
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-group',
                                                settings: {
                                                    label: 'Related dropdown',
                                                    fields: [
                                                        dropdownSettingConnectedSingle,
                                                        dropdownSettingConnectedSingle,
                                                        dropdownSettingRemotedConnectedSingle,
                                                        dropdownSettingRemotedConnectedSingle
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
                                    label: 'Buttons',
                                    countInLine: 3,
                                    fields: [
                                        {
                                            component: {
                                                name: 'ue-button',
                                                settings: {
                                                    label: 'Simple button'
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-button',
                                                settings: {
                                                    label: 'Send request to server',
                                                    href: '//universal-backend.dev/rest/v1/staff',
                                                    handlers: {
                                                        before: function() {
                                                            alert('Before trigger');
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-button',
                                                settings: {
                                                    label: 'Send request to server and reject',
                                                    href: '//universal-backend.dev/rest/v1/staff',
                                                    handlers: {
                                                        before: function(config) {
                                                            return false;
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            component: {
                                                name: 'ue-button',
                                                settings: {
                                                    label: 'Open Yandex.com',
                                                    href: 'https://www.yandex.com',
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
                                                                    columns: [{ name: 'title', sortable: false }, 'status', 'date']
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
                                                                    dataSource: {
                                                                        standard: 'YiiSoft',
                                                                        url: '//universal-backend.dev/rest/v1/staff',
                                                                        fields: []
                                                                    },
                                                                    body: [
                                                                        {
                                                                            component: {
                                                                                name: 'ue-form-tabs',
                                                                                settings: {
                                                                                    tabs: [
                                                                                        {
                                                                                            label: 'Groups',
                                                                                            fields: [
                                                                                                {
                                                                                                    name: 'blocks',
                                                                                                    component: {
                                                                                                        name: 'ue-radiolist',
                                                                                                        settings: {
                                                                                                            label: 'Useable block',
                                                                                                            values: {
                                                                                                                'block1': 'Field Name',
                                                                                                                'block2': 'Contacts person №1',
                                                                                                                'block3': 'Contacts person №2'
                                                                                                            }
                                                                                                        }

                                                                                                    }
                                                                                                },
                                                                                                {
                                                                                                    name: 'readonlyBlocks',
                                                                                                    component: {
                                                                                                        name: 'ue-radiolist',
                                                                                                        settings: {
                                                                                                            label: 'Readonly block',
                                                                                                            values: {
                                                                                                                'block1': 'Field Name',
                                                                                                                'block2': 'Contacts person №1',
                                                                                                                'block3': 'Contacts person №2'
                                                                                                            }
                                                                                                        }

                                                                                                    }
                                                                                                },
                                                                                                {
                                                                                                    name: 'group.name',
                                                                                                    component: {
                                                                                                        name: 'ue-string',
                                                                                                        settings: {
                                                                                                            label: 'Name',
                                                                                                            useable: function(data) {
                                                                                                                return data.blocks === 'block1';
                                                                                                            },
                                                                                                            readonly: function(data) {
                                                                                                                return data.readonlyBlocks === 'block1';
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                },
                                                                                                {
                                                                                                    name: 'multipleRoot',
                                                                                                    component: {
                                                                                                        name: 'ue-group',
                                                                                                        settings: {
                                                                                                            label: 'Contacts person №1',
                                                                                                            readonly: function(data) {
                                                                                                                return data.readonlyBlocks === 'block2';
                                                                                                            },
                                                                                                            useable: function(data) {
                                                                                                                return data.blocks === 'block2';
                                                                                                            },
                                                                                                            multiple: true,
                                                                                                            fields: [
                                                                                                                {
                                                                                                                    name: 'multipleRoot[].phone',
                                                                                                                    component: {
                                                                                                                        name: 'ue-string',
                                                                                                                        settings: {
                                                                                                                            label: 'phone'
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    name: 'type',
                                                                                                                    component: {
                                                                                                                        name: 'ue-dropdown',
                                                                                                                        settings: {
                                                                                                                            values: {
                                                                                                                                phone: 'Телефон',
                                                                                                                                email: 'Эл. почта'
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            ]
                                                                                                        }
                                                                                                    }
                                                                                                },
                                                                                                {
                                                                                                    name: 'rootSingle',
                                                                                                    component: {
                                                                                                        name: 'ue-group',
                                                                                                        settings: {
                                                                                                            label: 'Contacts person №2',
                                                                                                            useable: function(data) {
                                                                                                                return data.blocks === 'block3';
                                                                                                            },
                                                                                                            readonly: function(data) {
                                                                                                                return data.readonlyBlocks === 'block3';
                                                                                                            },
                                                                                                            fields: [
                                                                                                                {
                                                                                                                    name: 'rootSingle.phone',
                                                                                                                    component: {
                                                                                                                        name: 'ue-string',
                                                                                                                        settings: {
                                                                                                                            label: 'Phone'
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    name: 'rootSingle.stringMultiple',
                                                                                                                    component: {
                                                                                                                        name: 'ue-string',
                                                                                                                        settings: {
                                                                                                                            label: 'String Multiple',
                                                                                                                            multiple: true
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    name: 'rootSingle.singleAutocomplete',
                                                                                                                    component: {
                                                                                                                        name: 'ue-autocomplete',
                                                                                                                        settings: {
                                                                                                                            label: 'Single Autocomplete',
                                                                                                                            values: {
                                                                                                                                'key1': 'value1',
                                                                                                                                'key2': 'value2',
                                                                                                                                'key3': 'value3',
                                                                                                                                'key4': 'value4'
                                                                                                                            },
                                                                                                                            useable: function(data) {
                                                                                                                                return data.readonlyBlocks === 'block1';
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    name: 'rootSingle.multipleAutocomplete',
                                                                                                                    component: {
                                                                                                                        name: 'ue-autocomplete',
                                                                                                                        settings: {
                                                                                                                            label: 'Multiple Autocomplete',
                                                                                                                            multiple: true,
                                                                                                                            values: {
                                                                                                                                'key1': 'value1',
                                                                                                                                'key2': 'value2',
                                                                                                                                'key3': 'value3',
                                                                                                                                'key4': 'value4'
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    name: 'rootSingle.singleDropDown',
                                                                                                                    component: {
                                                                                                                        name: 'ue-dropdown',
                                                                                                                        settings: {
                                                                                                                            label: 'Single DropDown',
                                                                                                                            values: {
                                                                                                                                'key1': 'value1',
                                                                                                                                'key2': 'value2',
                                                                                                                                'key3': 'value3',
                                                                                                                                'key4': 'value4'
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    name: 'rootSingle.multipleDropDown',
                                                                                                                    component: {
                                                                                                                        name: 'ue-dropdown',
                                                                                                                        settings: {
                                                                                                                            label: 'Multiple DropDown',
                                                                                                                            multiple: true,
                                                                                                                            values: {
                                                                                                                                'key1': 'value1',
                                                                                                                                'key2': 'value2',
                                                                                                                                'key3': 'value3',
                                                                                                                                'key4': 'value4'
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    name: 'rootSingle.checkbox',
                                                                                                                    component: {
                                                                                                                        name: 'ue-checkbox',
                                                                                                                        settings: {
                                                                                                                            label: 'Checkbox',
                                                                                                                            values: {
                                                                                                                                'key1': 'value1',
                                                                                                                                'key2': 'value2',
                                                                                                                                'key3': 'value3',
                                                                                                                                'key4': 'value4'
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    name: 'rootSingle.radiolist',
                                                                                                                    component: {
                                                                                                                        name: 'ue-radiolist',
                                                                                                                        settings: {
                                                                                                                            label: 'radiolist',
                                                                                                                            values: {
                                                                                                                                'key1': 'value1',
                                                                                                                                'key2': 'value2',
                                                                                                                                'key3': 'value3',
                                                                                                                                'key4': 'value4'
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    name: 'rootSingle.color',
                                                                                                                    component: {
                                                                                                                        name: 'ue-colorpicker',
                                                                                                                        settings: {
                                                                                                                            label: 'Colorpicker'
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    name: 'rootSingle.color',
                                                                                                                    component: {
                                                                                                                        name: 'ue-colorpicker',
                                                                                                                        settings: {
                                                                                                                            label: 'Multiple Colorpicker',
                                                                                                                            multiple: true
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    name: 'rootSingle.date',
                                                                                                                    component: {
                                                                                                                        name: 'ue-date',
                                                                                                                        settings: {
                                                                                                                            label: 'Date',
                                                                                                                            multiple: true
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    name: 'type',
                                                                                                                    component: {
                                                                                                                        name: 'ue-dropdown',
                                                                                                                        settings: {
                                                                                                                            values: {
                                                                                                                                phone: 'Телефон',
                                                                                                                                email: 'Эл. почта'
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
                                                                                        label: 'Apply',
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
