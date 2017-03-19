(function() {
    'use strict';

    angular
        .module('demoApp')
        .controller('ArticlesFormController', ArticlesFormController);

    function ArticlesFormController() {
        var vm = this;
        var articlesDataSource = {
            standard: 'JSONAPI',
            resourceType: 'articles',
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
                            label: 'Title'
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
                                "published": "Published",
                                "draft": "Draft"
                            }
                        }
                    }
                },
                {
                    name: 'author',
                    component: {
                        name: 'ue-component',
                        settings: {
                            expandable: true
                        }
                    }
                },
                {
                    name: 'comments',
                    component: {
                        name: 'ue-component',
                        settings: {
                            expandable: true
                        }
                    }
                },
                {
                    name: 'views',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'Views'
                        }
                    }
                },
                {
                    name: 'content',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'Text'
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
                                            label: 'Main tab',
                                            fields: ['id', 'title', 'created', 'status', 'views', 'content',
                                                {
                                                    name: 'author',
                                                    resourceType: 'people',
                                                    component: {
                                                        name: 'ue-group',
                                                        settings: {
                                                            fields: [{
                                                                name: 'id',
                                                                component: {
                                                                    name: 'ue-dropdown',
                                                                    settings: {
                                                                        label: 'Author',
                                                                        valuesRemote: {
                                                                            fields: {
                                                                                key: 'id',
                                                                                label: 'firstname'
                                                                            },
                                                                            url: 'http://localhost:16006/rest/people'
                                                                        }
                                                                    }
                                                                }
                                                            }]
                                                        }
                                                    }
                                                },
                                                {
                                                    name: 'comments',
                                                    resourceType: 'comments',
                                                    component: {
                                                        name: 'ue-group',
                                                        settings: {
                                                            multiple: true,
                                                            label: 'Comments',
                                                            fields: [
                                                            {
                                                                name: 'id',
                                                                component: {
                                                                    name: 'ue-dropdown',
                                                                    settings: {
                                                                        valuesRemote: {
                                                                            fields: {
                                                                                key: 'id',
                                                                                label: 'body'
                                                                            },
                                                                            url: 'http://localhost:16006/rest/comments'
                                                                        }
                                                                    }
                                                                }
                                                            }]
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
