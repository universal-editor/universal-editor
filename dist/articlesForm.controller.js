(function() {
    'use strict';

    angular
        .module('demoApp')
        .controller('ArticlesFormController', ArticlesFormController);

    function ArticlesFormController() {
        var vm = this;
        var articlesDataSource = {
            standard: 'JSONAPI',
            type: 'articles',
            url: 'http://localhost:16006/rest/articles',
            sortBy: '-id',
            primaryKey: 'id',
            parentField: 'parent_id',
            keys: {
                meta: 'meta'
            },
            fields: [
                {
                    name: 'id',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'ID',
                            readonly: true
                        }
                    }
                },
                {
                    name: 'title',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'Заголовок'
                        }
                    }
                },
                {
                    name: 'status',
                    component: {
                        name: 'ue-dropdown',
                        settings: {
                            label: 'Статус.',
                            values: {
                                "published": "Опубликовано",
                                "draft": "Черновик"
                            }
                        }
                    }
                },
                {
                    name: 'views',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'Показы'
                        }
                    }
                },
                {
                    name: 'author',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'Автор',
                            expandable: true
                        }
                    }
                },
                {
                    name: 'content',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'Текст'
                        }
                    }
                },
                {
                    name: 'created',
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: 'Created',
                            disabled: true,
                            readonly: true,
                            validators: [{
                                type: 'date',
                                format: 'YYYY-MM-DD'
                            }]
                        }
                    }
                }
            ]
        };

        vm.ueConfig = {
            component: {
                name: 'ue-form',
                settings: {
                    dataSource: articlesDataSource,
                    header: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        sref: 'articles',
                                        useBackUrl: true,
                                        template: '<div class="close-editor" ng-click="vm.click()"> </div>'
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
                                            label: 'Основной таб',
                                            fields: ['id', 'title', 'created', 'status', 'views', 'content']
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
                                        label: 'Save',
                                        action: 'save',
                                        sref: 'articles'
                                    }
                                }
                            },
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Apply',
                                        action: 'presave'
                                    }
                                }
                            },
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Delete',
                                        action: 'delete',
                                        sref: 'articles'
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
