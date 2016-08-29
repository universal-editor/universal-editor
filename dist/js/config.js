(function($){
    var config = {};
    config.entities = [];
    var staff = {
        "name": "staff",
        "label": "Сотрудники",
        "backend": {
            "url": "http://universal-backend.dev/rest/v1/staff",
            "sortBy": "-id",
            "fields": {
                "primaryKey": "id",
                "parent": "parent_id"
            }
        },
        "tabs": [
            {
                "label": "Карточка",
                "fields": [
                    {
                        "name": "name",
                        "type": "string",
                        "list": true,
                        "label": "Имя",
                        "required": true,
                        "defaultValue": "c92723"
                    },
                    {
                        "name": "email",
                        "type": "string",
                        "list": true,
                        "label": "Эл. почта",
                        "required": true
                    },
                    {
                        "name": "gender",
                        "type": "radiolist",
                        "list": true,
                        "label": "Пол",
                        "filterable": true,
                        "values": {
                            "male" : "Мужской",
                            "female" : "Женский"
                        },
                        "defaultValue": "female"
                    },
                    {
                        "name": "country",
                        "type": "select",
                        "list": true,
                        "label": "Страна",
                        "filterable": true,
                        "values": {
                            "1": "Россия",
                            "2": "Китай",
                            "3": "Япония"
                        },
                        "defaultValue": "3"
                    },
                    {
                        "name": "notes",
                        "label": "Заметки",
                        "type": "array",
                        "fields": [
                            {
                                "name": "color",
                                "type": "colorpicker",
                                "list": true,
                                "label": "Любимый цвет",
                                "defaultValue": "#c92723"
                            },
                            {
                                "name": "text",
                                "type": "textarea",
                                "label": "Дополнительные заметки",
                                "defaultValue": "c92723"
                            }
                        ]
                    }
                ]
            },
            {
                "label": "Служебное",
                "fields": [
                    {
                        "name": "fired",
                        "type": "checkbox",
                        "label": "Уволен",
                        "values": {
                            "1": ""
                        }
                    },
                    {
                        "name": "created_at",
                        "type": "time",
                        "label": "Дата создания"
                    },
                    {
                        "name": "updated_at",
                        "type": "datetime",
                        "readonly": true,
                        "label": "Дата обновления"
                    }
                ]
            }
        ],
        "contextMenu": [
            {
                "label": "Раскрыть",
                "type": "open"
            },
            {
                "label": "Редактировать",
                "type": "edit"
            },
            {
                "label": "Удалить",
                "type": "delete"
            }
        ],
        "listHeaderBar": [
            {
                "type": "create",
                "label": "Создать"
            }
        ],
        "editFooterBar": [
            {
                "type": "update",
                "label": "Сохранить"
            },
            {
                "type": "presave",
                "label": "Применить"
            },
            {
                "type": "delete",
                "label": "Удалить"
            }
        ]
    };
    var news = {
        "name": "news",
        "label": "Новости",
        "backend": {
            "url": "http://universal-backend.dev/rest/v1/news",
            "sortBy": "-id",
            "fields": {
                "primaryKey": "id",
                "parent": "parent_id"
            }
        },
        "tabs": [
            {
                "label": "Новость",
                "fields": [
                    {
                        "name": "published",
                        "type": "checkbox",
                        "list": true,
                        "label": "Опубликовано",
                        "values": {
                            "1": "Россия",
                            "2": "Китай",
                            "3": "Япония"
                        }

                    },
                    {
                        "name": "published_at",
                        "type": "datetime",
                        "list": true,
                        "label": "Дата публикации"
                    },
                    {
                        "name": "category_id",
                        "type": "select",
                        "label": "Категория",
                        "list": true,
                        "filterable": true,
                        "valuesRemote": {
                            "fields": {
                                "value": "id",
                                "label": "title"
                            },
                            "url": "http://universal-backend.dev/rest/v1/news/category"
                        },
                        "search": true,
                        "tree": {
                            "parentField": "parent_id",
                            "childCountField": "child_count",
                            "selectBranches": true
                        }
                    },
                    {
                        "name": "title",
                        "type": "string",
                        "list": true,
                        "label": "Заголовок",
                        "required": true
                    },
                    {
                        "name": "description",
                        "type": "textarea",
                        "list": true,
                        "label": "Краткое описание",
                        "required": true
                    },
                    {
                        "name": "text",
                        "type": "wysiwyg",
                        "label": "Текст",
                        "expandable" : true
                    }
                ]
            },
            {
                "label": "Место",
                "fields": [
                    {
                        "name": "coordinates",
                        "type": "map",
                        "label": "Местоположение события",
                        "expandable" : true,
                        "multiple": true,
                        "defaultValue" : "37.617313,55.756039"
                    }
                ]
            },
            {
                "label": "Служебное",
                "fields": [
                    {
                        "name": "created_at",
                        "type": "time",
                        "label": "Дата создания"
                    },
                    {
                        "name": "updated_at",
                        "type": "datetime",
                        "readonly": true,
                        "label": "Дата обновления"
                    }
                ]
            }
        ],
        "contextMenu": [
            {
                "label": "Раскрыть",
                "type": "open"
            },
            {
                "label": "Редактировать",
                "type": "edit"
            },
            {
                "label": "Удалить",
                "type": "delete"
            }
        ],
        "listHeaderBar": [
            {
                "type": "create",
                "label": "Создать"
            }
        ],
        "editFooterBar": [
            {
                "type": "update",
                "label": "Сохранить"
            },
            {
                "type": "presave",
                "label": "Применить"
            },
            {
                "type": "delete",
                "label": "Удалить"
            }
        ]
    };
    config.entities.push(staff);
    config.entities.push(news);
    var editor = new UniversalEditor('universal-editor', config);
})(jQuery);