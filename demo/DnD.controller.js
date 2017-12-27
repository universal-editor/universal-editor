(function() {
    'use strict';

    angular
        .module('demoApp')
        .controller('DnDController', DnDController);

    function DnDController($http) {
        'ngInject';
        var vm = this;
        var newsDataSource = {
            standard: 'YiiSoft',
            transport: {
                url: '/assets/dragAndDrop.1.json'
            },
            sortBy: {
                id: 'desc'
            },
            primaryKey: 'id',
            tree: {
                childrenField: 'childs',
                childrenCountField: 'childs_count',
                selfField: 'self'
            },
            fields: [
                {
                    name: 'id',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'ID',
                            template: '',
                            validators: [
                                {
                                    type: 'number'
                                }
                            ]
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
                                url: 'http://universal-backend.test/rest/v1/staff'
                            },
                            multiple: true,
                            expandable: true,
                            multiname: 'staff_id'
                        }
                    }
                },
                {
                    name: 'tags',
                    component: {
                        name: 'ue-dropdown',
                        settings: {
                            label: 'Tags',
                            valuesRemote: {
                                fields: {
                                    value: 'id',
                                    label: 'name'
                                },
                                url: 'http://universal-backend.test/rest/v1/tags'
                            },
                            multiple: true,
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
                                url: 'http://universal-backend.test/rest/v1/news/categories'
                            },
                            search: true
                        }
                    }
                }
            ]
        };

        vm.ueConfig = {
            component: {
                name: 'ue-grid',
                settings: {
                    dataSource: newsDataSource,
                    dragMode: {
                        start: function(e, element, collection) {
                            console.log('Dragging is started');
                        },
                        over: function(e, element, destElement, collection) {
                            console.log('Dragging is proccessing');
                        },
                        drop: function(e, element, destElement, collection) {
                            console.log('Element is droped');
                            return true;
                        },
                        inserted: function(e, index, element, destElement, collection) {
                            console.log('Element is inserted');
                        },
                        containerName: 'news',
                        allowedContainers: ['news'],
                        expand: function(dataSource, element) {
                            return $http.get('/assets/dragAndDrop.childs.json').then(function(response) {
                                return response.data.items;
                            });
                        },
                        dragIcon: true
                    },
                    columns: [
                        {
                            name: 'title',
                            width: '50%'
                        },
                        {
                            name: 'authors',
                            width: '300px',
                            sortable: false
                        },
                        {
                            name: 'category_id',
                            width: '200px',
                            sortable: false
                        }],
                    contextMenu: [
                        {
                            component: {
                                name: 'ue-button',
                                settings: {
                                    label: 'Delete',
                                    action: 'delete'
                                }
                            }
                        }
                    ],
                    footer: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-pagination'
                                }
                            }
                        ]
                    }
                }
            }
        };
    }
})();
