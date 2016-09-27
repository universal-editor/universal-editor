//(function($){
//    $.ajax({
//        url: '/assets/json/config.json',
//        type: 'GET'
//    }).done(function(data) {
//        var editor = new UniversalEditor('universal-editor', data);
//    });
//})(jQuery);

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
        }
    ]
};

var messagesDataSource = {
    type: 'REST',
    url: '//universal-backend.dev/rest/v1/messages',
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
            name: 'text',
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
                                    name: 'ue-button-create',
                                    settings: {
                                        label: 'создать'
                                    }
                                },
                                {
                                    name: 'ue-button-download',
                                    settings: {
                                        label: 'создать',
                                        url: ''
                                    }
                                },
                                {
                                    name: 'ue-button-create',
                                    settings: {
                                        label: 'создать'
                                    }
                                }
                            ],
                            columns: ['name', 'email']
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
                                                {
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
                                                            dataSource: messagesDataSource
                                                        }
                                                    }
                                                },
                                                {
                                                    component: {
                                                        name: 'ue-button',
                                                        settings: {
                                                            label: 'This is button!!!11',
                                                            request: {
                                                                url: '//ya.ru'
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            ],
                            footer: {
                                "default-data-controls": true,
                                component: {
                                    name: 'my-super-component'
                                }
                            }
                        }
                    }
                }
            ]
        }
    ]
});