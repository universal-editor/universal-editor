## ue-grid

Компонент, который отображает список данных в виде таблицы и предоставляет 
функционал для взаимодействия с ними.

```javascript
var grid = {
    name: 'ue-grid',
    settings: {
        routing: {
            paramsPrefix: 'mix'
        },
        dataSource: {        
            standard: 'YiiSoft',
            sortBy: {
                id: 'desc'
            },
            multisorting: false,
            primaryKey: 'id',
            parentField: 'parent_id',
            tree: {
                    childrenField: 'childs',
                    childrenCountField: 'childs_count',
                    selfField: 'self'
            },
            transport: {
                url: '//universal-backend.test/rest/v1/staff'
            },
            fields: [
                {
                    name: 'id',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: '№',
                            validators: [
                                {
                                    type: 'number',
                                    step: 1
                                }
                            ]
                        }
                    }
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
        columns: ['id', 'name', 'email'],
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
            toolbar: [
                {
                    component: {
                        name: 'ue-pagination'
                    }
                }
            ]
        }
    }
};
```

| Параметр | Тип | Описание | Обязательный параметр? | Значение по умолчанию |
| --- | --- | --- | --- | --- |
| name | string | Название копонента. | + | - |
| settings | object | Объект настройки компонента. | + | - |
| settings[routing] | object | Объект настройки взаимодествия компонента с URL. | - | - |
| settings[routing][paramsPrefix] | object | Префикс, который добавляеться к query параметрам(parent, filter, sort, page), требующим для работы компонента. | - | - |
| settings[dataSource] | object | Объект настройки компонента по работе с сервером [dataSource](data-source.md). Если компонент не имеет `dataSource`, то следует указать значение `dataSource: false`, иначе компонент попытается прокинуть его в дочерние компоненты. | + | Передается из родительского компонента |
| settings[header] | object | Содержит настройки верхнего блока в компоненте.  | + | - |
| settings[header][filter] | object, false | Содержит компонент фильтра.  | - | - |
| settings[header][toolbar] | array | Содержит массив объектов компонентов для верхнего блока. | - | - |
| settings[displayHeaderColumns] | boolean | Флаг отображения блока с заголовками колонок.  | - | true |
| settings[dragMode] | object | Объект для настройки перетаскивания элементов в компоненте [drag&drop](ue-grid-drag-mode.md)  | - | - |
| settings[columns] | array или string | Массив объектов для описания столбцов или имя поля из конфигурации ресурса.  | + | - |
| settings[columns][name] | string | Имя поля из конфигурации ресурса (dataSource). | + | - |
| settings[columns][width] | string | Длина колонки в % или px. | + | 100% – означает, что все колонки будут равные по длине. (разделены в соотношении 1 к 1) |
| settings[columns][sortable] | boolean | Разрешает / запрещает сортировку данных по столбцу | - | true |
| settings[contextMenu] | array | Массив кнопок для меню у записей со смешанного ресурса. | - | - |
| settings[footer] | object | Содержит настройки нижнего блока в компоненте.  | - | - |
| settings[footer][toolbar] | array | Содержит массив объектов компонентов для нижнего блока.  | - | - |

## Многоуровневая сортировка (sortBy)

Настройка sortBy позволяет задать сортировку по-умолчанию. Представляет собой объект, имена свойств которого являются названия полей, по которым осуществляется сортировка, а значениями свойств – направление сортировки в виде символьного обозначения (`asc` – по возрастанию, `desc` – по убыванию).
Например, 

```
sortBy: {
    field1: 'asc',
    field2: {
        field3: 'desc'
    }
}
```
все значения сначала отсортируются по возрастанию по полю `field1`, а затем каждая группа записей с одинаковым значением в поле `field1` отсортируется по убыванию по полю `field2.field3` независимо от других групп.
Визуальная часть работает по следующему сценарию:
1. Столбец неактивен;
1. Кликнули, включилась сортировка по убыванию (отображается иконка с классами `glyphicon glyphicon-sort-by-attributes-alt`);
1. Кликнули ещё раз — включилась сортировка по возрастанию (отображается иконка с классами `glyphicon glyphicon-sort-by-attributes`);
1. Кликнули снова — отключилась сортировка (отображается иконка с классами `glyphicon glyphicon-sort-by-attributes`);
1. Столбцы с отключенной сортировкой имеют CSS-класс `glyphicon glyphicon-sort`.

## Смешанный режим отображения данных

Смешанный режим позволяет отображать, а также редактировать сразу два типа записей с разных ресурсов.
Например, показать в одном списке одновременно новости и категории новостей.

### Конфигурация

Смешанный режим работает в рамках одного компонента __ue-grid__.
В конфигурации ue-grid есть настройка mixedMode, которая позволяет сообщить данные о смешиваемом ресурсе.
Свойство __collectionType__ несет идентификатор ресурса, которым должны быть снабжены все записи со смешаного источника.
Свойство __fieldType__ задает имя поля, куда записан этот идентификатор.

```javascript
var grid = {
    name: 'ue-grid',
    settings: {
        mixedMode: {
            collectionType : 'categories',
            fieldType : 'type',
            prependIcon : 'title',
            dataSource: {
                standard: 'YiiSoft',
                url: '//universal-backend.test/rest/v1/staff',
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
        ]
    }
}
```

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| collectionType | string | Идентификатор ресурса. | + | - |
| fieldType | string | Название поля в ответе API, указывающее на идентификатор ресурса, к которой относится запись. | + | - |
| prependIcon | string | Параметр, указывающий к какому полю прикрепить иконку смешаного режима. | + | - |
| contextMenu | array | Массив кнопок для меню у записей со смешанного ресурса. | - | - |
| dataSource | object | Объект настройки компонента по работе с сервером [DataSource](dataSource.md).  | + | - |

### API

При включенном смешанном режиме запросы к серверу отправляются с GET-параметром `?mixed=<название-ресурса>`.
У записей со смешаного источника имеется свой набор кнопок в контекстном меню,
а значит для редактирования подобных записей можно указать соответствующий стейт с необходимыми для данного источника настройками полей и кнопок, который построит нужную форму.

#### Пример

На основе выше приведённого примера конфигурации редактора при обращении к серверу по
URL `/rest/v1/news?mixed=categories`, в ответ клиент должен получить:

1. Смешанный список записей из двух источников (новости и категории);
1. Поле `type` содержит идентификатор источника записей `categories`, чтобы редактор мог отличать их.

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
var button = {
    name: 'ue-button',
    settings: {
        action: 'open'
    }
};
```

При раскрытие в URL добавляется query-параметр parent или, если в ue-grid прописана настройка routing.paramsPrefix, <routing.paramsPrefix>-parent:

```
/staff?parent=9032

/staff?<routing.paramsPrefix>-parent=9032
```

События, относящиеся к компоненту
* ue:collectionRefresh – событие вызывается для обноления записей в таблице;
* ue:beforeParentEntitySet – событие вызвается при переходе по записям ue-grid во вложенном режиме.

* ue-grid:updateNodes – cобытие слушается компонентом в режиме `drag and drop`. Если отдать событию ссылку на какую-то из отрисованных записей, то он инициирует цепочку событий `ue:componentDataLoaded` в рамках этого элемента. Т.е. если в компоненте `ue-grid` c массивом записей `items` передать ссылку на 5 запись (к примеру, предварительно изменив одно из ее значений), то обновится только эта запись, но не вся таблица.

Обычный вызов события обновит все значения компонента.

``` javascript

vm.treeConfig = { /* конфигурация ue-grid */};

var treeModel = EditEntityStorage.getComponentBySetting(vm.treeConfig);
treeModel.items[5].title = 'Какое-то новое значение';
$scope.$broadcast('ue-grid:updateNodes', treeModel.items[5]); /*  обновит только 5-ый элемент */

$scope.$broadcast('ue-grid:updateNodes');  /*  обновит все элементы */

```

* ue-grid:updateHierarchy – cобытие слушается компонентом в режиме дерева. Если отдать событию ссылку на какой-то из отрисованных узлов, то он инициирует цепочку событий `ue-grid:updateNodes` в рамках этого элемента и его потомков.
Обычный вызов события обновит все значения компонента.

``` javascript

vm.treeConfig = { /* конфигурация ue-grid в режиме дерево */};

var treeModel = EditEntityStorage.getComponentBySetting(vm.treeConfig);

$scope.$broadcast('ue-grid:updateHierarchy', treeModel.items[5]); /*  обновит только 5-ый узел и все дочерние узлы */

$scope.$broadcast('ue-grid:updateHierarchy');  /*  обновит все узлы дерева */

```
