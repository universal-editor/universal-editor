import BaseToolsService from "../BaseTools.service";

/**
   * Instrumental tools for unit-tests.
   * You can add supported methods and use it in test logic.
   * Just you need to import the module.
   * @param  {$injector} $injector Angular service for injects of the dependences
   */
export default class ToolsService extends BaseToolsService  {
  constructor($injector) {
    super($injector);
  }

  getDefaultUeFormSettingsWithOneField(url = '/test/mock') {
    let dataSource = {
      standard: 'YiiSoft',
      primaryKey: 'id',
      transport: {
        one: {
          url: () => url
        },
        create: {
          url: () => url
        },
        update: {
          url: (item) => url + '/' + item[dataSource.primaryKey]
        },
        delete: {
          url: (item) => url + '/' + item[dataSource.primaryKey]
        }
      },
      fields: [
        {
          name: 'fio',
          component: {
            $id: '$fio',
            name: 'ue-string',
            settings: {
              label: 'FIO',
              useable: (data) => {
                return true;
              },
              readonly: false,
              regim: 'edit',
              hint: 'Hint',
              required: true,
              multiple: false
            }
          }
        }
      ]
    };

    return {
      component: {
        name: 'ue-form',
        $id: '$form',
        settings: {
          dataSource: dataSource,
          primaryKeyValue: () => null,
          body: ['fio']
        }
      }
    }
  }

  getDefaultUeFormSettingsWithTwoFields(url) {
    let dataSource = {
      standard: 'YiiSoft',
      transport: {
        one: {
          url: () => url
        },
        create: {
          url: () => url
        },
        update: {
          url: () => url
        }
      },
      fields: [
        {
          name: 'categories_id',
          component: {
            $id: '$categories_id',
            name: 'ue-dropdown',
            settings: {
              label: 'Categories',
              width: 10,
              defaultValue: 2,
              valuesRemote: {
                url: '/rest/v1/news/categories',
                fields: {
                  label: 'title',
                  value: 'id'
                }
              }
            }
          }
        },
        {
          name: 'fio',
          component: {
            $id: '$fio',
            name: 'ue-string',
            settings: {
              label: 'FIO',
              useable: (data) => {
                return true;
              },
              depend: 'categories_id',
              defaultValue: 'Petrov',
              readonly: false,
              regim: 'edit',
              hint: 'Hint',
              required: true,
              multiple: false,
              validators: [
                {
                  type: 'string',
                  minLength: 3,
                  maxLength: 10,
                  trim: true
                }
              ]
            }
          }
        }
      ]
    };

    return {
      component: {
        name: 'ue-form',
        $id: '$form',
        settings: {
          dataSource: dataSource,
          primaryKeyValue: function() {
            return null;
          },
          body: ['fio', 'categories_id']
        }
      }
    }
  }

  getConfigWithValidators() {
    return {
      component: {
        name: 'ue-form',
        settings: {
          dataSource: false,
          primaryKeyValue: () => null,
          body: [
            {
              name: 'test',
              component: {
                $id: '$test_string',
                name: 'ue-string',
                settings: {
                  label: 'Test string',
                  validators: [
                    {
                      type: 'string',
                      minLength: 3,
                      maxLength: 300,
                      pattern: '^[A-Za-z]+$',
                      trim: true,
                      contentType: 'text'
                    },
                    {
                      type: 'number',
                      min: 3,
                      max: 300,
                      step: 2
                    },
                    {
                      type: 'date',
                      minDate: '3-10-2012',
                      maxDate: '8-12-2014',
                      minView: 'day',
                      maxView: 'year',
                      view: 'month',
                      format: 'DD-MM-YYYY'
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
};
