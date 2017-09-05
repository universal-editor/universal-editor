# Общие настройки всех компонентов редактора

```javascript
{
    name: 'ue-string',
    settings: {
        label: 'String label',
        hint: 'Это текстовое поле',
        multiple: true,
        multiname: 'new_value',
        depend: 'other_field_name',
        width: 6,
        useable: function(data) {
			return data.field === 'value1';
		},
		readonly: function(data) {
			return data.field === 'value2';
		}
        templates: {
            preview: '<span> {{value}} </span>',
            edit: function(scope) {
                scope.clickHandler = function(e) { /* логика */ };
                return '<input type="text" data-ng-disabled="readonly" name="{{name}}" data-ng-click="clickHandler($event)" data-ng-model="value" class="form-control input-sm"/>'
            },
            filter: 'module/components/templates/filterTemplate.html'
        },
        defaultValue: 'bla-bla-bla',
        validators: [
            {
                type: 'string',
                min: 10,
                max: 50
            },
            {
                type: 'mask',
                mask: '(999) 999 - 99 - 99'
            }
        ]
    }
}
```

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| name | string | Название компонента. | + | - |
| settings | object | Объект настройки компонента | + | - |
| settings[label] | string | Название поля (выводится в интерфейсе редактора) | + | - |
| settings[hint] | string | Текстовая информационная подсказка, выводимая слева от заголовка поля. | - | - |
| settings[multiple] | bool | Параметр отвечает за указание возможности поля принимать множественные значения. | - | false |
| settings[required] | bool | Выделяет заголовок поля жирным, говоря об обязательности заполнения. | - | false |
| settings[readonly] | bool или function | Параметр отвечает за указание активности компонента с точки зрения взаимодействия с пользователем. см. [Управление отображением](visualization.md). | - | false |
| settings[useable] | function | Параметр отвечает за отображение элемента и отправку его значения на сервер.  см. [Управление отображением](visualization.md) | - | - |
| settings[disabled] | bool | Параметр отвечает за возможность изменения значения поля и его отображение при создании/редактировании. см. [Управление отображением](visualization.md) | - | false |
| settings[templates] | object | Объект для настройки шаблонов. | - | - |
| settings[templates][preview] | string или function | Строка с HTML-кодом шаблона, функция, возвращающая шаблон, или путь до шаблона в режиме просмотра (например отображение в таблице). | + | - |
| settings[templates][edit] | string или function  | Строка с HTML-кодом шаблона, функция, возвращающая шаблон, или путь до шаблона в режиме редактирования (например отображение на форме редактирования). | + | - |
| settings[templates][filter] | string или function  | Строка с HTML-кодом шаблона, функция, возвращающая шаблон, или путь до шаблона в режиме фильтра (например, отображение в фильтре). | + | - |
| settings[multiname] | string | Ключ, который будет использован для создания массива в запросе к бекенду в том случае, если поле работает в множественном режиме. Если ключ не установлен, то на бекенд отправится массив вида `['value1', 'value2', 'value3']`. Если ключ установлен, например: `multiname:"value"`, то на бекенд отправится массив вида `[["value"=>"value1"], ["value"=>"value2"], ["value"=>"value3"]]` | - | - |
| settings[width] | int | Ширина поля в единицах bootstrap-сетки, принимаемое значении от 1 до 6. | - | 6 |
| settings[defaultValue] | string | Значение поля по-умолчанию. | - | - |
| settings[validators] | array | Массив, содержащий настройки для валидации компонента (см. [Валидаторы полей](validators) | - | - |
| settings[depend] | string | Параметр отвечает за зависимость данного поля от поля с именем other_field_name. Если у компонентов, для которых требуется делать запрос для получения значений по API, в поле адреса запроса указаны `:dependField` и `:dependValue`(например, `/api/service/v1/json/categories?filter={:dependField::dependValue}`) , то они заменятся на имя поля указанного в depend и значение этого поля соответственно. | - | - |


## Идентификатор компонента

Все компоненты, обрабатываемые редактором, снабжаются идентификатором. Он либо автоматически генерируется в ядре редактора, либо берется из конфигурации компонента. Если указать идентификатор в конфигурации компонента, то редактором он генерироваться не будет. Указать идентификатор компонента можно в свойстве `component[$id]` (как в примере ниже).

```javascript
{
    name: 'text',
    component: { 
        $id: 'text_id',
        name: 'ue-string'
        settings: {
            label: 'Адрес'
        }
    }
}
```

Как правило в событиях, инициируемые компонентами, содержится идентификатор этого компонента, передаваемый событию. Например, 

```javascript
    $scope.$on('ue:componentDataLoaded', function(e, data) {
        console.log('Компонент, вызвавший событие имеет идентификатор ' + data.$id);
    });
```

## Задание сложных имен компонентам

Параметр `name` в корне конфигурации компонента хранит имя, которое используется при формировании и обработке ответов API, чтобы компонент корректно отдавал и примал данные при взаимодействии с сервером.
Имя может быть разделено через точку, если данные сокрыты в объекте. Например, если поле описано следующим образом 

```javascript
{
    name: 'root.child1.child2.child3',
    component: { /* ... */ }
}
```

, тогда на сервер уйдет объект вида 

```javascript
{
    root: {
        child1: {
            child2: {
                child3: 'Значение поля'
            }
        }
    }
}

// В окне запросов браузера данные уйдут в виде root[child1][child2][child3]: Значение поля

```

Если возникает необходимость описать массив однотипных объектов, то можно воспользоваться возможностями компонента `ue-group` в режиме multiple, который поможет визуализировать повторяющиеся блоки с данными. Но при описании конфигурации компонентов в часть имени, которая описывает массив нужно прописать постфикс `[]`, чтобы редактор знал что это массив, когда будет парсить имя и формировать выходной объект с данными.
Например, API возвращает массив объектов вида:
```javascript
{
    photos: [
        {
            title: 'Картика1',
            src: '/api/image1.jpg'
        },
        {
            title: 'Картика2',
            src: '/api/image2.jpg'
        }
    ]
}
```
Соответствующие конфигурации компонентов в dataSource объекте и конфигурация формы должны выглядеть так: 

```javascript
    var dataSource = {
            standard: 'YiiSoft',
            transport: {
              url: '//universal-backend.dev/rest/v1/photos'
            },
            fields: [
                {
                    name: 'photos[].title',
                    component: { 
                        name: 'ue-string'
                        settings: {
                            label: 'Заголовок'
                        }
                    }
                },
                {
                    name: 'photos[].src',
                    component: { 
                        name: 'ue-string'
                        settings: {
                            label: 'Адрес'
                        }
                    }
                }
            ]
        };

        var config = {
            component: {
                name: 'ue-form',
                settings: {
                    dataSource: dataSource,
                    body: [
                        {
                            name: 'photos',
                            component: { 
                                name: 'ue-group'
                                settings: {
                                    label: 'Фотографии',
                                    multiple: true,
                                    fields: ['title', 'src']
                                }
                            }
                        }
                    ]
                }
            }
        };

```

Компоненту `ue-group` тоже сообщается имя. Это необходимо чтобы при получении данных `ue-group` сначала определил количество блоков, поместил их на форму (компоненты должны пройти регистрацию в редакторе) и только потом инициировал событие загрузки данных. Внутренние поля группы перечисляются без учета группового имени (`photos.title => title, photos.src => src`).

# Получение модели компонента

Для обращения непосредственно к компоненту, чтобы изъять значение из компонента, можно воспользоваться сервисом `EditEntityStorage`.
Получение модели компонента по его настройкам возможно с помощью метода `getComponentBySetting`. 
Пример, 

```javascript

 var settings =  {
        name: 'title',
        component: { 
            name: 'ue-string'
            settings: {
                label: 'Заголовок'
            }
        }
 }

 var model = EditEntityStorage.getComponentBySetting(settings);
```

