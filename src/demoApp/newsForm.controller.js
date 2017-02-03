(function () {
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
            fields: [
                {
                    name: 'published',
                    component: {
                        name: 'ue-checkbox',
                        settings: {
                            label: 'Published',
                            trueValue: 1,
                            falseValue: 0
                        }
                    }
                },
                {
                    name: 'published_at',
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: 'Publication date'
                        }
                    }
                },
                {
                    name: 'category_id',
                    component: {
                        name: 'ue-dropdown',
                        settings: {
                            label: 'Category',
                            valuesRemote: {
                                fields: {
                                    value: 'id',
                                    label: 'title'
                                },
                                url: 'http://universal-backend.dev/rest/v1/news/categories'
                            },
                            search: true
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
                    name: 'description',
                    component: {
                        name: 'ue-textarea',
                        settings: {
                            label: 'Text'
                        }
                    }
                },
                {
                    name: 'authors',
                    component: {
                        name: 'ue-autocomplete',
                        settings: {
                            label: 'Authors',
                            valuesRemote: {
                                fields: {
                                    value: 'id',
                                    label: 'name'
                                },
                                url: 'http://universal-backend.dev/rest/v1/staff'
                            },
                            multiple: false,
                            expandable: true,
                            multiname: 'staff_id'
                        }
                    }
                },
                {
                    name: 'tags',
                    component: {
                        name: 'ue-autocomplete',
                        settings: {
                            label: 'Tags',
                            valuesRemote: {
                                fields: {
                                    value: 'id',
                                    label: 'name'
                                },
                                url: 'http://universal-backend.dev/rest/v1/tags'
                            },
                            multiple: false,
                            expandable: true
                        }
                    }
                },
                {
                    name: 'created_at',
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: 'Created'
                        }
                    }
                },
                {
                    name: 'updated_at',
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: 'Updated'
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
                                        sref: 'news',
                                        useBackUrl: true,
                                        template: function($scope) {
                                            return '<div class="close-editor" ng-click="vm.click()"> </div>';
                                        }
                                        label: 'Back to news list',
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
                                            label: 'Description',
                                            fields: [
                                                'published',
                                                'published_at',
                                                'category_id',
                                                'title',
                                                'description'
                                            ]
                                        },
                                        {
                                            label: 'Place',
                                            fields: [
                                                'authors',
                                                'tags'
                                            ]
                                        },
                                        {
                                            label: 'System',
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
                                        label: 'Save',
                                        action: 'save',
                                        sref: 'news'
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
                                        sref: 'news'
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
