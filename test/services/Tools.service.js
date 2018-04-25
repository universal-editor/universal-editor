import BaseToolsService from "../BaseTools.service";

/**
   * Instrumental tools for unit-tests.
   * You can add supported methods and use it in test logic.
   * Just you need to import the module.
   * @param  {$injector} $injector Angular service for injects of the dependences
   */
export default class ToolsService extends BaseToolsService {
  constructor($injector) {
    super($injector);
  }

  getUeFormConfiguration() {
    return {
      component: {
        name: 'ue-form',
        $id: 'form',
        settings: {
          dataSource: false,
          body: [
            {
              name: 'list',
              component: {
                $id: 'list',
                name: 'ue-dropdown',
                settings: {
                  valuesRemote: {
                    fields: {
                      value: 'id',
                      label: 'title'
                    },
                    url: '/rest/v1/news/categories'
                  }
                }
              }
            }
          ]
        }
      }
    }
  }

  getUeFormConfiguration2() {
    return {
      component: {
        name: 'ue-form',
        $id: 'form',
        settings: {
          dataSource: false,
          body: [
            {
              name: 'string.field',
              component: {
                name: 'ue-string',
                $id: 'field_string_id',
                settings: {
                  defaultValue: 'value',
                }
              }
            },
            {
              name: 'list',
              component: {
                $id: 'list',
                name: 'ue-autocomplete',
                settings: {
                  defaultValue: 1,
                  valuesRemote: {
                    fields: {
                      value: 'id',
                      label: 'title'
                    },
                    url: '/rest/v1/news/categories'
                  }
                }
              }
            }
          ]
        }
      }
    };
  }

  getUePaginationConfiguration() {
    return  {
      component: {
        name: 'ue-pagination',
        settings: {
          pageSizeOptions: [10, 20, 30, 40, 50, 100],
          pageSize: 30,
          maxSize: '6',
          label: {
            last: 'last',
            next: 'next',
            first: 'first',
            previous: 'previous'
          }
        }
      }
    };
  }

  getUeGridConfiguration() {
    return {
      component: {
        name: 'ue-grid',
        settings: {
          dataSource: {
            standard: 'YiiSoft',
            transport: {
              url: '/rest/v1/news/categories'
            },
            fields: [
              {
                name: 'id',
                component: {
                  name: 'ue-string',
                  settings: {
                    label: 'ID',
                    validators: [
                      {
                        type: 'number'
                      }
                    ]
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
              }
            ]
          },
          header: {
            toolbar: [
              {
                component: {
                  name: 'ue-filter'
                }
              }
            ]
          },
          columns: ['id', 'title'],
          footer: {
            toolbar: [
              this.getUePaginationConfiguration()
            ]
          }
        }
      }
    };
  }

  getExtendedUeGridConfiguration() {
    return {
      component: {
        name: 'ue-grid',
        settings: {
          routing: {
            paramsPrefix: 'prefix'
          },
          dataSource: {
            standard: 'YiiSoft',
            transport: {
              url: '/rest/v1/news/categories'
            },
            fields: [
              {
                name: 'id',
                component: {
                  name: 'ue-string',
                  settings: {
                    label: 'ID',
                    validators: [
                      {
                        type: 'number'
                      }
                    ]
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
                name: 'type',
                component: {
                  name: 'ue-checkbox',
                  settings: {
                    values: [
                      'v1',
                      'v2',
                      'v3'
                    ]
                  }
                }
              },
              {
                name: 'fired',
                component: {
                  name: 'ue-checkbox',
                  settings: {
                    trueValue: 1,
                    falseValue: 0
                  }
                }
              },
              {
                name: 'created',
                component: {
                  name: 'ue-date',
                  settings: {
                    label: 'Created',
                    validators: [{
                      type: 'date',
                      format: 'DD.MM.YYYY'
                    }]
                  }
                }
              }
            ]
          },
          header: {
            toolbar: [
              {
                component: {
                  name: 'ue-filter'
                }
              }
            ]
          },
          columns: ['id', 'title'],
          footer: {
            toolbar: [
              this.getUePaginationConfiguration()
            ]
          }
        }
      }
    };
  }

  getDataSource() {
    return {
      standard: 'YiiSoft',
      transport: {
        url: '/rest/v1/news/categories'
      },
      fields: [
        {
          name: 'id',
          component: {
            name: 'ue-string',
            settings: {
              label: 'ID',
              validators: [
                {
                  type: 'number'
                }
              ]
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
        }
      ]
    };
  }
};
