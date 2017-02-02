(function() {
    'use strict';

    angular
        .module('demoApp')
        .controller('NewsFormController', NewsFormController);

    NewsFormController.$inject = [];

    function NewsFormController() {
        var vm = this;
        var newsDataSource = {
            type: 'REST',
            url: '//universal-backend.dev/rest/v1/news',
            sortBy: '-id',
            primaryKey: 'id',
            parentField: 'parent_id',
            keys: {
                items: 'items',
                meta: '_meta'
            },
            fields: [
                {
                    name: "published",
                    component: {
                        name: 'ue-checkbox',
                        settings: {
                            label: "Опубликовано",
                            trueValue: 1,
                            falseValue: 0
                        }
                    }
                },
                {
                    name: "published_at",
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: "Дата публикации"
                        }
                    }
                },
                {
                    name: "category_id",
                    component: {
                        name: "ue-dropdown",
                        settings: {
                            label: 'Категория',
                            valuesRemote: {
                                fields: {
                                    value: "id",
                                    label: "name",
                                    "parent": "parent_id",
                                    "childCount": "child_count"
                                },
                                url: "http://universal-backend.dev/rest/v1/staff"
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
                        settings: {
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
                        settings: {
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
        vm.ueConfig = {
            component: {
                name: 'ue-form',
                settings: {
                    dataSource: newsDataSource,
                    header: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Назад',
                                        sref: 'news',
                                        useBackUrl: true,
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
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Сохранить/обновить',
                                        action: 'save',
                                        sref: 'news'
                                    }
                                }
                            },
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Удалить',
                                        action: 'delete',
                                        sref: 'news'
                                    }
                                }
                            },
                            {
                                component: {
                                    name: 'ue-button',
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
        };
    }
})();
