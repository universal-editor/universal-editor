
//(function($){
//    $.ajax({
//        url: '/assets/json/config.json',
//        type: 'GET'
//    }).done(function(data) {
//        var editor = new UniversalEditor('universal-editor', data);
//    });
//})(jQuery);

var personDataSource = {
    type: 'REST',
    url: 'https://manage.new.tech.mos.ru/api/structure/v1/backend/json/ru/person',
    sortBy: '-id',
    primaryKey: 'id',
    parentField: 'parent_id',
    fields: [
        {
            name: 'name',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'Имя',
                    validators: []
                }
            }
        },
        {
            name: 'surname',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'Фамилия',
                    validators: []
                }
            }
        },
        {
            name: 'sort',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'Сортировка',
                    validators: [
                        // @todo Примеры
                    ]
                }
            }
        }
    ]
};


var categoriesDataSource = {
    type: 'REST',
    url: 'https://manage.new.tech.mos.ru/api/advisor/v5/backend/json/ru/category',
    sortBy: '-id',
    primaryKey: 'id',
    parentField: 'parent_id',
    fields: [
        {
            name: 'title',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'Название',
                    validators: []
                }
            }
        },
        {
            name: 'local_id',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'Символьный код',
                    validators: []
                }
            }
        },
        {
            name: 'sort',
            component: {
                name: 'ue-string',
                settings: {
                    label: 'Сортировка',
                    validators: [
                        // @todo Примеры
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
            name: 'staff',
            label: 'Категории',
            states: [
                {
                    name: 'index',
                    url: '/staff',
                    component: {
                        name: 'ue-table',
                        settings: {
                            dataSource: categoriesDataSource,
                            header: [
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
                                            label: 'This is button!!!',
                                            request: {
                                                url: '//ya.ru'
                                            }
                                        }
                                    }
                                },
                                {
                                    component: {
                                        name: 'ue-button-request',
                                        settings: {
                                            label: 'This is button!!!',
                                            request: {
                                                url: '//ya.ru'
                                            }
                                        }
                                    }
                                },
                                {
                                    component: {
                                        name: 'ue-button-target-blank',
                                        settings: {
                                            label: 'This is button!!!',
                                            request: {
                                                url: 'http://333v.ru/uploads/12/12182eaff9b46ef1848fe409b0fa9ed5.jpg'
                                            }
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
                            columns: ['title', 'local_id', 'sort'],
                            contextMenu: [
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
                                            label: 'This is button!!!',
                                            request: {
                                                url: '//ya.ru'
                                            }
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
                            dataSource: categoriesDataSource,
                            body: [
                                {
                                    component: {
                                        name: 'ue-form-tab',
                                        settings: {
                                            label: 'Tab 1',
                                            fields: [
                                                {
                                                    name: "time",
                                                    component: {
                                                        name: 'ue-table',
                                                        settings: {
                                                            label: 'Таблица Персон',
                                                            dataSource: personDataSource,
                                                            header: [
                                                                {
                                                                    component: {
                                                                        name: 'ue-button-create',
                                                                        settings: {
                                                                            label: 'создать'
                                                                        }
                                                                    }
                                                                }
                                                            ],
                                                            columns: ['name', 'surname', 'sort'],
                                                            contextMenu: [
                                                                {
                                                                    component: {
                                                                        name: 'ue-button-edit',
                                                                        settings: {
                                                                            label: 'Редактировать',
                                                                            state: 'edit'
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
                                        name: 'ue-button-presave',
                                        settings: {
                                            label: 'Сохранить'
                                        }
                                    }
                                },
                                {
                                    component: {
                                        name: 'ue-button-request',
                                        settings: {
                                            label: 'This is button!!!',
                                            request: {
                                                url: '//ya.ru'
                                            }
                                        }
                                    }
                                },
                                {
                                    component: {
                                        name: 'ue-button-target-blank',
                                        settings: {
                                            label: 'This is button!!!',
                                            request: {
                                                url: 'http://333v.ru/uploads/12/12182eaff9b46ef1848fe409b0fa9ed5.jpg'
                                            }
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
        }]});