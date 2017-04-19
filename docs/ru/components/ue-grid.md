## ue-grid

Компонент, который отображает список данных в виде таблицы и предоставляет 
функционал для взаимодействия с ними.

```javascript
name: 'ue-grid',
settings: {
    routing: {
        paramsPrefix: 'mix'
    }
    dataSource: {        
        standard: 'YiiSoft',
        url: '//universal-backend.dev/rest/v1/staff',
        sortBy: '-id',
        primaryKey: 'id',
        parentField: 'parent_id',
        fields: [
            {
                name: 'id',
                component: {
                    name: 'ue-number',
                    settings: {
                        label: '№',
                        validators: []
                    }
                }
            },
            {
            ...
            }
        ]
    },
    header: {
        filter: false, 
        toolbar: [ 
            {
                component: {
                    name: 'ue-button',
                    settings: {
                        label: 'Создать',
                        sref: 'create'
                    }
                }
            }
        ]
    },
    columns: ['name', 'email'],
    contextMenu: [
        {
            component: {
                name: 'ue-button',
                settings: {
                    label: 'Создать',
                    sref: 'create'
                }
            }
        }
    ],
    footer: {
        pagination: {
            component: {
                name: 'ue-pagination',
                settings: {
                    dataSource: formDataSource,
                    maxSize: '5'
                    label: {
                        last: 'last',
                        next: 'next',
                        first: 'first',
                        previous: 'previous'
                    }
                }
            }
        }
    }
}
```

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| name | string | Название копонента. | + | - |
| settings | object | Объект настройки компонента. | + | - |
| settings[routing] | object | Объект настройки взаимодествия компонента с URL. | - | - |
| settings[routing][paramsPrefix] | object | Префикс, который добавляеться к query параметрам(parent, filter, sort, page), требующим для работы компонента. | - | - |
| settings[dataSource] | object | Объект настройки компонента по работе с бекендом. | + | - |
| settings[dataSource][standard] | string | Cтиль построения архитектуры.  | + | - |
| settings[dataSource][childrenField] | string | Имя поля для указания дочерних узлов (нужен для отображения в режиме дерева). | + | - |
| settings[dataSource][childrenCountField] | string | Имя поля для указания количества дочерних узлов (нужен для отображения в режиме дерева). | + | - |
| settings[dataSource][selfField] | string | Имя поля для указания объекта сущности, к которому привязан узел (нужен для отображения в режиме дерева). | + | - |
| settings[dataSource][url] | string | URL в RESTful-сервисе. | + | - |
| settings[dataSource][sortBy] | string | Поле для сортировки по-умолчанию. Направление asc задаётся знаком - перед именем поля. | - | - |
| settings[dataSource][primaryKey] | string | Имя поля с первичным ключом, по которому редактор идентифицирует записи. | + | - |
| settings[dataSource][parentField] | string | Имя поля с идентификатором родительской записи. Данный параметр требуется указывать, если поле является разделом», т. е. может иметь дочерние объекты, которые будут связаны по этому полю. Можно использовать в связке со смешанным режимом. | - | - |
| settings[dataSource][fields] | array | Массив настроек полей, используемых при создании и редактировании записи. | + | - |
| settings[header] | object | Содержит настройки верхнего блока в компоненте.  | + | - |
| settings[header][filter] | object, false | Содержит компонент фильтра.  | - | - |
| settings[header][toolbar] | object | Содержит компоненты для верхнего блока ue-grid.  | + | - |
| settings[dragMode] | object | Объект для настройки перетаскивания элементов в компоненте [drag&drop](dragMode.md)  | - | - |
| settings[pagination] | object | Содержит компонент пагинации в нижнем блоке. | + | - |
| settings[columns] | array | Массив имен столбцов которые нужно выводить. | + | - |
| settings[contextMenu] | array | Массив кнопок для меню у записей со смешанного ресурса. | - | - |


## Смешанный режим отображения данных

Смешанный режим позволяет отображать, а также редактировать сразу два типа записей с разных ресурсов.
Например, показать в одном списке одновременно новости и категории новостей.

### Конфигурация

Смешанный режим работает в рамках одного компонента __ue-grid__.
В конфигурации ue-grid есть настройка mixedMode, которая позволяет сообщить данные о смешиваемом ресурсе.
Свойство __collectionType__ несет идентификатор ресурса, которым должны быть снабжены все записи со смешаного источника.
Свойство __fieldType__ задает имя поля, куда записан этот идентификатор.

```javascript
component: {
    name: 'ue-grid',
    settings: {
        mixedMode: {
            collectionType : 'categories',
            fieldType : 'type',
            prependIcon : 'title',
            dataSource: {
                standard: 'YiiSoft',
                url: '//universal-backend.dev/rest/v1/staff',
                sortBy: '-id',
                primaryKey: 'id',
                parentField: 'parent_id',
                fields: [
                    {
                        name: 'id',
                        component: {
                            name: 'ue-number',
                            settings: {
                                label: '№',
                                validators: []
                            }
                        }
                    },
                    {
                    ...
                    }
                ]
            },
            contextMenu: [
                {
                    component: {
                        name: 'ue-button',
                        settings: {
                            label: 'Создать',
                            sref: 'create'
                        }
                    }
                }
            ]
        },
        dataSource: staffDataSource,
        header: {
            toolbar: []
        },
        columns: ['title', 'sort', 'local_id', 'menu_color'],
        contextMenu: [
            {
                component: {
                    name: 'ue-button',
                    settings: {
                        label: 'редактировать',
                        sref: 'edit'
                    }
                }
            },
            {
                separator: true,
                component: {
                    name: 'ue-button',
                    settings: {
                        label: 'Удалить',
                        action: 'delete',
                        sref: 'index'
                    }
                }
            },
            {
                separator: true,
                component: {
                    name: 'ue-button',
                    settings: {
                        label: 'Раскрыть',
                        action: 'open'
                    }
                }
            }
        ],
        footer: {

        }
    }
}
```

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| collectionType | string | Идентификатор ресурса. | + | - |
| fieldType | string | Название поля в ответе API, указывающее на идентификатор ресурса, к которой относится запись. | + | - |
| prependIcon | string | Параметр, указывающий к какому полю прикрепить иконку смешаного режима. | + | - |
| contextMenu | array | Массив кнопок для меню у записей со смешанного ресурса. | - | - |
| dataSource | object | Объект настройки по работе с сервером. | + | - |
| dataSource[standard] | string | Cтиль построения архитектуры. | + | - |
| dataSource[url] | string | URL в RESTful-сервисе. | + | - |
| dataSource[primaryKey] | string | Имя поля с первичным ключом, по которому редактор идентифицирует записи. | + | - |

### API

При включенном смешанном режиме запросы к серверу отправляются с GET-параметром `?mixed=<название-ресурса>`.
У записей со смешаного источника имеется свой набор кнопок в контекстном меню,
а значит для редактирования подобных записей можно указать соответствующий стейт с необходимыми для данного источника настройками полей и кнопок, который построит нужную форму.

#### Пример

На основе выше приведённого примера конфигурации редактора при обращении к серверу по
URL `/rest/v1/news?mixed=categories`, в ответ клиент должен получить:

1. Смешанный список записей из двух источников (новости и категории);
2. Поле `type` содержит идентификатор источника записей `categories`, чтобы редактор мог отличать их.

```json
{
    "items": [
        {
            "id": 255,
            "title": "День города в Моске",
            "type": "news"
        },
        {
            "id": 111,
            "title": "Праздники",
            "type": "categories"
        },
        {
            "id": 211,
            "title": "Спорт",
            "type": "categories"
        },
        {
            "id": 755,
            "title": "Hewlett-Packard показала рюкзак-аккумулятор для зарядки гаджетов",
            "type": "news"
        },
        {
            "id": 211,
            "title": "Транспорт",
            "type": "categories"
        }
    ],
    "_links": {
        "self": {
            "href": "/rest/v1/news?mixed=categories&page=1"
        },
        "next": {
            "href": "/rest/v1/news?mixed=categories&page=2"
        },
        "last": {
            "href": "/rest/v1/news?mixed=categories&page=8"
        }
    },
    "_meta": {
        "totalCount": 50,
        "pageCount": 10,
        "currentPage": 1,
        "perPage": 5
    }
}
```

---

## Вложенный режим

Вложенный режим ue-grid, это режим когда одна запись может быть группирующей для нескольких записей.
В таком случае на сервер отправлялся запрос содержащий query-параметр.

Пример:

```
/staff?filter={"parent_id":"9032"}
```

Ключ __parent_id__ - имя поля указывающее по какому полю на сервере должна производиться фильтрация. Берется из параметра __parentField__ конфигурационного файла.

Значение __9032__  - значение по которому будет производиться фильтрация. То есть будут выбраны только те сущности у которых есть "родитель" с идентификатором 9032.

Роль "раскрытия" записи выполняет кнопка ue-button с параметром action: 'open':

```javascript
{
    component: {
        name: 'ue-button',
        settings: {
            action: 'open'
        }
    }
}
```

При раскрытие в URL добавляется query-параметр parent или, если в ue-grid прописана настройка routing.paramsPrefix, <routing.paramsPrefix>-parent:

```
/staff?parent=9032

/staff?<routing.paramsPrefix>-parent=9032
```

События, относящиеся к компоненту
* ue:collectionRefresh – событие вызывается для обноления записей в таблице;
* ue:beforeParentEntitySet – событие вызвается при переходе по записям ue-grid во вложенном режиме.
