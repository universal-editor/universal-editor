### Источник данных (dataSource)

Источник данных – центральная базовая структура, используемая Универсальным редактором при составлении конфигураций. DataSource имеет единый формат для описания работы с локальными и удаленными данными.

В возможности Источника данных входит:
1. Определение стандарта взаимодействия с API (standard);
2. Описание CRUD-операций (transport);
3. Задавать многоуровневую сортировку (поле, направление сортировки);
3. Описание схемы данных – перечень составляющих компонентов, определение поля с id, задание полей для описания родительских записей, количества дочерних записей и т. д.;

Общий вид dataSource:

```javascript
var dataSource = {
    standard: 'YiiSoft',
    sortBy: {
        id: 'desc'
    },
    primaryKey: 'id',
    parentField: 'parent_id',
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
                      validators: [{type: 'number'}],
                      disabled: true
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
                  name: 'ue-dropdown',
                  settings: {
                      label: 'Title',
                      dataSource: {
                          data: [
                              {id: 'type1', title: 'Тип1'},
                              {id: 'type2', title: 'Тип2'}
                          ]
                      }
                  }
              }
          },
          {
              name: 'total',
              component: {
                  name: 'ue-string',
                  settings: {
                      label: 'total',
                      validators: [{ type: 'number' }],
                      disabled: true
                  }
              }
          }
    ],
    transport: {
        create: {
            data: function(item) {
                return item
            },
            params: function(item) {
                return {};
            }
            method: 'POST',
            url: '/domain/entities/new',
            handlers: {
                before: function (config) {
                    return false; // this is canceled request
                },
                error: function (reject) {},
                success: function (response) {},
                complete: function (e) {}
            }
        },
        update: {
            data: function(item) {
                return item
            },
            method: 'PUT',
            url: '/domain/entities/:id',
            handlers: {
                before: function (config) { },
                error: function (reject) {},
                success: function (response) {},
                complete: function (e) {}
            }
        },
        destroy: {
            data: function(item) {
                return item
            },
            method: 'DELETE',
            url: function(item) { 
                return '/domain/entities/' + item.id; 
            }
        },
        read: {
            data: function(item) {
                return item
            },
            headers:  function(item) {
                return item
            },
            params: function(item) {
                return {};
            },
            method: 'GET',
            url: '/domain/entities'
        },
        one: {
            data: function(item) {
                return item
            },
            headers:  function(item) {
                return item
            },
            params: function(item) {
                return {};
            },
            method: 'GET',
            url: '/domain/entities/:id'
        }
    }
}

```

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| standard | string | Веб-протокол (стандарт) API для доступа к данным.  | + | - |
| sortBy | object | Объект, именами свойств которого являются названия полей, по которым осуществляется сортировка, а значениями свойств – направление сортировки в виде символьного обозначения (`asc` – по возрастанию, `desc` – по убыванию).  | - | - |
| transport | object | Описание CRUD-операций.  | - | - |
| transport.url | string | URL-запроса. Используется по-умолчанию в запросах, если в секциях `read`, `create`, `update`, `destroy` не указан URL.  | - | Устанавливается сервисом, определяющим стиль построения архитектуры. |
| transport.read | object | Описание READ-запроса для получения массива записей (например, в ue-grid).  | - | - |
| transport.create | object | Описание CREATE-запроса.  | - | - |
| transport.update | object | Описание UPDATE-запроса.  | - | - |
| transport.destroy | object | Описание DELETE-запроса.  | - | - |
| transport.one | object | Описание READ-запроса для получения одной записи (например в ue-form).  | - | - |
| transport.{`read`,`create`,`update`,`destroy`, `one`}.method | string | Тип запроса (PUT, POST, UPDATE...).  | - | Устанавливается сервисом, определяющим стиль построения архитектуры. |
| transport.{`read`,`create`,`update`,`destroy`, `one`}.headers | function или object | Коллбек возвращающий заголовки запроса или непосредственно json-объект с заголовками. Коллбек принимает в качестве аргумента объект с данными, определяемые компонентом. | - | Устанавливается сервисом, определяющим стиль построения архитектуры. |
| transport.{`read`,`create`,`update`,`destroy`, `one`}.data | function | Коллбек возвращающий тело запроса в виде json-объекта. Коллбек принимает в качестве аргумента объект с данными, определяемые компонентом.  | - | - |
| transport.{`read`,`create`,`update`,`destroy`, `one`}.params | function | Коллбек возвращающий query-параметры запроса или непосредственно json-объект. Query-параметры отправлются как часть адреса в запросе. Коллбек принимает в качестве аргумента объект с данными, определяемые компонентом.    | - | - |
| transport.{`read`,`create`,`update`,`destroy`, `one`}.url | string или function | URL-запроса или коллбек возвращающий URL. Коллбек принимает в качестве аргумента объект с данными, определяемые компонентом.  | - | Наследуется из `transport.url` |
| transport.{`read`,`create`,`update`,`destroy`, `one`}.handlers | object | Пред- и пост-обработчики запроса.  | - | - |
| transport.{`read`,`create`,`update`,`destroy`, `one`}.handlers.before | function | Обработчик, вызываемый перед отправкой запроса. Имеется возможность при необходимости отменить запрос. | - | - |
| transport.{`read`,`create`,`update`,`destroy`, `one`}.handlers.error | function | Обработчик, вызываемый в случае ошибочного запроса. Полезен для дополнительной обработки ошибок.  | - | - |
| transport.{`read`,`create`,`update`,`destroy`, `one`}.handlers.success | function | Обработчик, вызываемый в случае удачного запроса.   | - | - |
| transport.{`read`,`create`,`update`,`destroy`, `one`}.handlers.complete | function | Обработчик, вызываемый после окончании запроса.  | - | - |
| settings[dataSource][primaryKey] | string | Имя поля с первичным ключом, по которому редактор идентифицирует записи. | + | - |
| settings[dataSource][parentField] | string | Имя поля с идентификатором родительской записи. Данный параметр требуется указывать, если поле является разделом», т. е. может иметь дочерние объекты, которые будут связаны по этому полю. Можно использовать в связке со смешанным режимом. | - | - |
| settings[dataSource][fields] | array | Массив настроек полей, используемых при создании и редактировании записи. | + | - |
| settings[dataSource][tree] | object | Секция конфига для задания имен полей, используемы при выводе иерархического дерева в компоненте.  | + | - |
| settings[dataSource][tree][childrenField] | string | Имя поля c перечнем дочерних узлов.  | - | - |
| settings[dataSource][tree][childrenCountField] | string | Имя поля с количеством дочерних узлов.  | - | - |
| settings[dataSource][tree][selfField] | string | Если узлы содержат сущность в отдельном поле и эта сущность выводится в дереве. Пример узла, {id: 1, self: { сущность дерева }, children: [  массив узлов ]} | - | - |

## Многоуровневая сортировка (sortBy)

Настройка sortBy позволяет задать сортировку по-умолчанию. Представляет собой объект, имена свойств которого являются названия полей, по которым осуществляется сортировка, а значениями свойств – направление сортировки в виде символьного обозначения (`asc` – по возрастанию, `desc` – по убыванию).
Например, 

``` javascript
sortBy: {
    field1: 'asc',
    field2: {
        field3: 'desc'
    }
}
```
все значения сначала отсортируются по возрастанию по полю `field1`, а затем каждая группа записей с одинаковым значением в поле `field1` отсортируется по убыванию по полю `field2.field3` независимо от других групп.

## Описание CRUD-операций (transport)

Конфигурация предназначена для описания запросов на создание, обновление, чтение и удаления данных. Секции create (создание), read (чтение), update (обновление) и delete (удаление) устроены однотипно и наполняют соответствующие запросы параметрами contentType, method, headers, params, data (подробнее описание этих параметров можно найти https://docs.angularjs.org/api/ng/service/$http#usage).
Секция `handlers` передает обработчики событий запроса.

Настройка `handlers.before` дает возможность поймать момент до отправки запроса. Аргумент `config` - это объект с настройками, который используется для генерации HTTP-запроса (подробнее [здесь](https://docs.angularjs.org/api/ng/service/$http#usage). Для отмены запроса нужно вернуть в качестве значение before-коллбека `false` (как в примере ниже).

```javascript
handlers: {
  before: function (config) {
      return false; // отмена запроса
  }
}
```

Функция `handlers.success` вызывается, если запрос получил успешный ответ от сервера (включает статусы ответов 200 – 299), который обработчик данного события получает в качестве аргумента.
Функция `handlers.error` вызывается, если запрос получил ошибочный ответ от сервера (любые статусы >299 и <200), который обработчик данного события получает в качестве аргумента.
Функция `handlers.complete` вызывается по окончанию запроса (не имеет значение ошибочный он или успешный).