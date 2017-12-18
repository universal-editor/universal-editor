## ue-form

Компонент ue-form представляет собой форму для редактирования/создания записи. 
В компонент на основе конфигурации могут встраиваются другие компоненты. 
При инициализации компонентов полей происходит регистрация их экземпляров 
в EditEntityStorage. Последующий вызов кнопок сохранения (presave), 
добавления (add) или обновления (update) вызовут методы EditEntityStorage, 
который соберет все значения полей и распространит событие. Angular-cервис по 
работе с сервером поймает события и пошлет запрос в RESTful-сервис.

```javascript
var formDataSource = {        
    standard: 'YiiSoft',
    transport: {
        url: '//universal-backend.dev/rest/v1/staff'
    },        
    sortBy: {
        id: 'desc'
    },
    primaryKey: 'id',
    parentField: 'parent_id',
    fields: [
        {
            name: 'id',
            component: {
                name: 'ue-string',
                settings: {
                    label: '№',
                    validators: [
                        {
                            type: 'number'
                        }
                    ]
                }
            }
        }
    ]
};

var config = {
    name: 'ue-form',
    settings: {
        dataSource: formDataSource,
        primaryKeyValue: function() {
            return $state.params.element_id;
        },
        header: {
            toolbar: [
                {
                    component: {
                        name: 'ue-button',
                        settings: {
                            label: 'Назад',
                            useBackUrl: true
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
                                label: 'Tab 1',
                                fields: [
                                    {
                                        'id',
                                        component: {
                                            name: 'ue-group',
                                            settings: {
                                                label: 'Group 1',
                                                name: 'fullName',
                                                countInLine: 2,
                                                fields: ['firstName', 'secondName']
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
            toolbar: [ // Кнопки под формой. Если `toolbar` не описан, выводим кнопки по-умолчанию.
                {
                    component: {
                        name: 'ue-button',
                        settings: {
                            label: 'Добавить/обновить',
                            action: 'save',
                            useBackUrl: true
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
                },
                {
                    component: {
                        name: 'ue-button',
                        settings: {
                            label: 'Удалить',
                            action: 'delete',
                            useBackUrl: true
                        }
                    }
                }
            ]
        }
    }
};
```

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| name | string | Название копонента. | + | - |
| settings | object | Объект настрокйки компонента. | + | - |
| settings[header] | object | Объект настройки "шапки" формы. | + | - |
| settings[header][toolbar] | array | Массив компонентов, выводимых в "шапке" формы. | + | - |
| settings[primaryKeyValue] | function или string или number | Значение идентификатора записи, за которым будет отправляться запрос к API. Если значение не задано, то никаких запросов отправляться не будет, компонент будет пустым. | - | - |
| settings[dataSource] | object | Объект настройки компонента по работе с сервером [DataSource](data-source.md). Если форма не имеет `dataSource`, то следует указать значение `dataSource: false`, иначе компонент попытается прокинуть его в дочерние компоненты.  | + | Передается из родительского компонента |
| settings[body] | array | Массив настроек компонентов встраиваемых в форму. | + | - |
| settings[footer] | object | Содержит настройки "подвала" формы. | + | - |
| settings[footer][toolbar] | array | Перечень компонентов, выводимые в нижнем блоке формы.| - | - |