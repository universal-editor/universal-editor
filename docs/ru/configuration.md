# Описание конфигурации

## Способы подключения

Инициализация редактора происходит посредствам создания объекта класса.

```javascript
    var editor = new UniversalEditor('universal-editor', config);
```

Где __'universal-editor'__ id html элемента на месте которого развернется редактор, __config__ - конфигурация.
Конфигурация представляет из себя javascript-объект.

Конфигурация может быть получен несколькими способами:
* Формированием javascript-объекта
* Получение json файла с конфигурацией от backend.

### Формирование javascript-объекта

Формируем javascript-объект конфигурации и передаем его при инициализации

```javascript
    var config = {};
    var news = {
            "name": "news",
            "label": "Новости",
            "backend": {
                "url": "http://universal-backend.dev/rest/v1/news",
                "sortBy": "-id",
                "fields": {
                    "primaryKey": "id",
                    "parent": "parent_id"
                }
            },
            "tabs": [
                {
                    "label": "Новость",
                    "fields": [
                        {
                            "name": "published",
                            "type": "checkbox",
                            "list": true,
                            "label": "Опубликовано",
                            "values": {
                                "1": ""
                            }
                        },
                        {
                            "name": "published_at",
                            "type": "datetime",
                            "list": true,
                            "label": "Дата публикации"
                        }
                    ]
                },
                {
                    "label": "Место",
                    "fields": [
                        {
                            "name": "coordinates",
                            "type": "map",
                            "label": "Местоположение события"
                        }
                    ]
                }
            ],
            "contextMenu": [
                {
                    "label": "Раскрыть",
                    "type": "open"
                },
                {
                    "label": "Редактировать",
                    "type": "edit"
                },
                {
                    "label": "Удалить",
                    "type": "delete"
                }
            ],
            "listHeaderBar": [
                {
                    "type": "create",
                    "label": "Создать"
                }
            ],
            "editFooterBar": [
                {
                    "type": "update",
                    "label": "Сохранить"
                },
                {
                    "type": "presave",
                    "label": "Применить"
                },
                {
                    "type": "delete",
                    "label": "Удалить"
                }
            ]
        };
    config.entities = [];
    config.entities.push(news);
    var editor = new UniversalEditor('universal-editor', config);
```

### Получение json файла с конфигурацией от backend.

Объект конфигурации можно получить с backend и передать для инициализации приложения

```javascript
    (function($){
        $.ajax({
            url: 'assets/json/config.json',
            type: 'GET'
        }).done(function(data){
            var editor = new UniversalEditor('universal-editor', data);
        });
    })(jQuery);
```

__Важно!__ Инициализация редактора должна находиться ниже создания модуля приложения. Генерация конфигурации и
инициализация редактора должна находиться либо в index.html, либо в папке src в config.js.

```javascript
    angular.module('unEditor',['universal.editor']);
```

## Формат

```json
{
  "ui": {
    "language": "ru"
  },
  "mixedMode": [
      {
          "entities" : ["articles", "categories"],
          "fieldType" : "type"
      }
  ],
  "entities" : [
    {
          "name": "news",
          "label": "Новости",
          "backend": {
            "url": "http://universal-backend.dev/rest/v1/news",
            "sortBy": "-id",
            "fields": {
              "primaryKey": "id",
              "parent": "parent_id"
            }
          },
          "tabs": [
            {
              "label": "Новость",
              "fields": [
                {
                  "name": "published",
                  "type": "checkbox",
                  "list": true,
                  "label": "Опубликовано",
                  "values": {
                    "1": ""
                  }
                },
                {
                  "name": "published_at",
                  "type": "datetime",
                  "list": true,
                  "label": "Дата публикации"
                },
                {
                  "name": "category_id",
                  "type": "select",
                  "label": "Категория",
                  "list": true,
                  "filterable": true,
                  "valuesRemote": {
                    "fields": {
                      "value": "id",
                      "label": "title"
                    },
                    "url": "http://universal-backend.dev/rest/v1/news/category"
                  },
                  "search": true,
                  "tree": {
                    "parentField": "parent_id",
                    "childCountField": "child_count",
                    "selectBranches": true
                  }
                },
                {
                  "name": "title",
                  "type": "string",
                  "list": true,
                  "label": "Заголовок",
                  "required": true
                },
                {
                  "name": "description",
                  "type": "textarea",
                  "list": true,
                  "label": "Краткое описание",
                  "required": true
                },
                {
                  "name": "text",
                  "type": "wysiwyg",
                  "label": "Текст"
                }
              ]
            },
            {
              "label": "Место",
              "fields": [
                {
                  "name": "coordinates",
                  "type": "map",
                  "label": "Местоположение события"
                }
              ]
            },
            {
              "label": "Служебное",
              "fields": [
                {
                  "name": "created_at",
                  "type": "datetime",
                  "readonly": true,
                  "label": "Дата создания"
                },
                {
                  "name": "updated_at",
                  "type": "datetime",
                  "readonly": true,
                  "label": "Дата обновления"
                }
              ]
            }
          ],
          "contextMenu": [
            {
              "label": "Раскрыть",
              "type": "open"
            },
            {
              "label": "Редактировать",
              "type": "edit"
            },
            {
              "label": "Удалить",
              "type": "delete"
            }
          ],
          "actions": [
            {
              "type": "create",
              "label": "Создать"
            },
            {
              "type": "add",
              "label": "Добавить"
            },
            {
              "type": "update",
              "label": "Обновить"
            },
            {
              "type": "delete",
              "label": "Удалить"
            }
          ],
          "listHeaderBar": [
            {
              "type": "create",
              "label": "Создать"
            }
          ],
          "editFooterBar": [
            {
              "type": "update",
              "label": "Сохранить"
            },
            {
              "type": "presave",
              "label": "Применить"
            },
            {
              "type": "delete",
              "label": "Удалить"
            }
          ]
        }
  ]
}
```

### Параметры

#### UI

Параметры секции `ui`.

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| language | string | Локализация интерфейса редактора. Значение может быть двух видов: 1) <код> локализации (JSON-файл должен находиться по пути `assets/json/language/<код>.json`; 2) путь до файла, например: `http://site.ru/language/kz.json` | - | ru |

#### Смешанный режим

Параметры секции `mixedMode`.

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| entities | array | Cписок объединяемых сущностей. Обе сущности будут использоваться как сущности, которые будут отображены в списке редактора. Сущности должны быть описаны как отдельные сущность редактора. При их редактировании будут использоваться отдельные формы. | + | - |
| fieldType | string | Имя поля, содержащее строковое имя сущности для различия одной сущности от другой (категории от элемента, принадлежащего к категории). | + | - |

#### Сущности

Секция `entities` содержит массив сущностей. У каждой сущности описываются правила взаимодействия с бекендом и 
конфигурация интерфейса.

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| name | string | Символьный код сущности. | + | - |
| label | string | Название сущности (отображается в интерфейсе). | + | - |
| backend | object | Правила взаимодействия с бекендом. | + | - |
| backend[url] | string | URL сущности в RESTful-сервисе. | + | - |
| backend[sortBy] | string | Поле для сортировки по-умолчанию. Направление asc задаётся знаком `-` перед именем поля. | - | - |
| backend[fields] | array | Названия основных полей в API. | + | - |
| backend[fields][primaryKey] | string | Имя поля с первичным ключом, по которому редактор идентифицирует записи. | + | - |
| backend[fields][parent] | string | Имя поля с идентификатором родительской записи. Данный параметр требуется указывать, если поле является разделом», т. е. может иметь дочерние объекты, которые будут связаны по этому полю. Можно использовать в связке со смешанным режимом. | - | - |
| backend[keys] | array | Названия основных полей, отдаваемых бекендом. | - | - |
| backend[keys][items] | array | Название поля с записями. | - | items |
| backend[keys][meta] | array | Название поля с метаданными: количество записей, страниц, информация о текущей странице. | - | _meta |
| backend[pagination] | bool | Постраничная навигация. | - | true |
| tabs | array | Массив объектов, описывающих табы (для формы создания и редактирования записей) и их поля. | + | - |
| tabs[label] | string | Название таба. | - | - |
| tabs[fields] | array | Поля для таба. Далее описаны только общие параметры. Полный список см. в описании конкретного типа поля | + | - |
| tabs[fields][name] | string | Название поля. | + | - |
| tabs[fields][label] | string | Имя поля, отображаемое в интерфейсе. | + | - |
| tabs[fields][hint] | string | Подсказка с описанием поля, выводится в интерфейсе. | - | - |
| tabs[fields][type] | string | Тип поля. | + | - |
| tabs[fields][multiple] | bool | Множественный режим поля. | - | false |
| tabs[fields][multiname] | string | Ключ, который будет использован для создания объекта в том случае, если поле работает в множественном режиме (`"multiple": true`). Если ключ не установлен, то на бекенд придет массив вида `['value1', 'value2', 'value3']`. Если ключ установлен, например, `"multiname": "key"`, то на бекенд придет массив вида `[["key" => "value1"], ["key" => "value2"], ["key" => "value3"]` | - | - |
| tabs[fields][list] | bool | Отображение поля в списке записей. | - | false |
| tabs[fields][required] | bool | Поле обязательно для заполонения. | - | false |
| tabs[fields][filterable] | bool | По полю можно производить фильтрацию. | - | false |
| tabs[fields][expandable] | bool | Поле должно запрашиваться у бекенда дополнительно, через GET-параметр `?expand=<field>`. | - | false |
| tabs[fields][showOnly] | string | отображение поля только при редактированнии или только при создании записи (значение "edit" или "create") | - | - |
| contextMenu | array | Контекстное меню в списке записей, отображающее кнопки. | - | - |
| contextMenu[type] | string | Тип кнопки. | + | - |
| contextMenu[label] | string | Название кнопки, выводится в интерфейсе. | + | - |
| listHeaderBar | array | Кнопки над списком записей. | - | - |
| listHeaderBar[type] | string | Тип кнопки. | + | - |
| listHeaderBar[label] | string | Название кнопки, выводится в интерфейсе. | + | - |
| editFooterBar | array | Кнопки под формой редактирования записи. | - | - |
| editFooterBar[type] | string | Тип кнопки. | + | - |
| editFooterBar[label] | string | Название кнопки, выводится в интерфейсе. | + | - |

#### Кнопки

Кнопки могут быть отображены в контекстом меню (`contextMenu`), над списком записей (`listHeaderBar`) и под формой 
редактирования записи (`editFooterBar`).

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| label | string | Название кнопки, выводится в интерфейсе. | + | - |
| type | string | Тип кнопки<sup>1</sup>. | + | - |
| request | array | Настройки отправки HTTP-запроса при нажатии на кнопку. | - | - |
| request[url] | string | URL, на который будет отправлен запрос. Допускается указание в URL переменной `:id`, которая будет заменена на идентификатор записи, на которой находится кнопка. | - | - |
| request[method] | string | Метод HTTP-запроса (POST, GET, DELETE и т. п.). | - | - |
| request[params] | array | Массив с параметрами, передаваемыми вместе с запросом. | - | - |

<sup>1</sup> Существуют следующие типы кнопок:
* edit — открыть страницу редактирования записи.
* download — перейти к скачиванию файла с удалённого ресурса.
* request — отправить HTTP-запрос. После совершения запроса и при успешном ответе бекенда список записей автоматически 
будет обновлён.
* targetBlank — открыть URL в новом окне браузера.
