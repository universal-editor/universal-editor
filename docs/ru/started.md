# Начало работы

Для успешной интеграции Универсального редактора в существующую страницу 
необходимо совершить ряд следующих действий:

1. Подключить все библиотеки из файла bower.json.
1. Подключить зависимости редактора - javascript-файла `ue.min.js`, находящийся в каталоге dist.
1. В Angular-приложение подключить модуль редактора:

```html
<script type="text/javascript">
    angular.module('<nameApp>', ['universal-editor']);
</script>
```

\<nameApp\> - название Angular-приложения, внутри которого подключается редактор.

В том месте документа, в котором предполагается расположить редактор, 
необходимо разместить Angular-компонент:

```html
<universal-editor ue-config="config"></universal-editor>
```

Где ue-config - объект конфигурации редактора.

## Конфигурация редактора

```javascript
{
    ui: {
        assetsPath: '/assets'
    },
    component: {
        name: 'ue-grid',
        settings: {
            dataSource: {
                standard: 'YiiSoft',
                transport: {
                    url: '//universal-backend.test/rest/v1/staff'
                }
                sortBy: {
                    id: 'desc'
                },
                primaryKey: 'id',
                fields: [
                    {
                        name: 'id',
                        component: {
                            name: 'ue-string',
                            settings: {
                                label: '№'
                            }
                        }
                    },
                    {
                        name: 'parent_id',
                        component: {
                            name: 'ue-string',
                            settings: {
                                label: 'Начальник'
                            }
                        }
                    },
                    {
                        name: 'name',
                        component: {
                            name: 'ue-string',
                            settings: {
                                label: 'Имя',
                                validators: [
                                    {
                                        type: 'string',
                                        min: 10,
                                        max: 50
                                    }
                                    // @todo Примеры
                                ]
                            }
                        }
                    },
                    {
                        name: 'email',
                        expandable: true,
                        component: {
                            name: 'ue-string',
                            settings: {
                                label: 'Эл. почта',
                                validators: [
                                    {
                                        type: 'string',
                                        contentType: 'email'
                                    }
                                ]
                            }
                        }
                    }
                ]
            },
            header: {
                filter: false, // Если `filter` не описан, по-умолчанию выводим фильтр.
                toolbar: [ // кнопки справа над таблицей
                    {
                        component: {
                            name: 'ue-button',
                            settings: {
                                label: 'Создать',
                                sref: 'create'
                            }
                        }
                    },
                    {
                        component: {
                            name: 'ue-button',
                            settings: {
                                label: 'Создать категорию',
                                sref: 'create'
                            }
                        }
                    }
                ]
            },
            body: {
                columns: ['name', 'email'],
                contextMenu: { // Если `contextMenu` не описан, выводим меню по-умолчанию.
                    items: [
                        {
                            component: {
                                name: 'ue-button',
                                settings: {
                                    label: 'Редактировать',
                                    sref: 'edit'
                                }
                            }
                        },
                        {
                            separator: true, // Разделитель строк меню.
                            component: {
                                name: 'ue-button',
                                settings: {
                                    label: 'Удалить'
                                    action: 'delete',
                                    sref: 'index'
                                }
                            }
                        }
                    ]
                },
            },
            footer: {
                toolbar: [
                    component: {
                        name: 'ue-pagination',
                        settings: {
                            maxSize: '5',
                            label: {
                                last: 'last',
                                next: 'next',
                                first: 'first',
                                previous: 'previous'
                            }
                        }
                    }
                ]
            }
        }
    }
};

```

### UI

Параметры секции `ui`.

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| language | object | Объект локализации интерфейса редактора. | - | - |
| language[code] |string|  <код> локализации (JSON-файл должен находиться по пути `assets/json/language/<код>.json`.| - | ru |
| language[path] | string | Путь до файла локализации, например: `json/language/ru.json`  | - | - |

Функция по локализации редактора в начале смотрит на параметр language[path] 
и устанавливает язык, если его нет,то устанавливается язык по language[code].

### component

В секции component описан корневой компонент редактора, который отобразиться 
в блоке `<universal-editor ue-config="config"></universal-editor>`.
