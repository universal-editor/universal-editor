# Взаимодействие с сервером

Редактор по-умолчанию подчиняется определенным правилам взаимодействия с API, которые стануть непригодными, если стиль архитектуры сервера будет координально отличаться от предполагаемого. 
Для того, чтобы редактор мог гибко работать с API, реализующими разные стандарты, предполагается наличие возможности подключать свои модули к редактору, реализующие стандарты взаимодействия с API, чтобы потом просто в параметрах dataSource указывать этот стандарт.

## Подключение отдельных модулей

Если для работы с сервером подключается сторонний модуль, то сервис, отвечающий за стандарт взаимодействия с API обязан подчиняться некоторому интерфейсу, набору функций, используемых для взаимодействия с редактором.
Предполагается, что модуль способен решать следующие задачи:

* Задавать типы метода для запросов (GET, PUT, POST..);
* Формировать URL запроса должным образом;
* Обрабатывать отправляемые параметры для серверной сортировки, фильтрации, пагинации и смешанного режима;
* Определять нотацию, в которой отправляются массивы и объекты (json, formData);
* Добавлять и заменять заголовки запроса (headers);
* Обрабатывать ответы от сервера;

Интерфейс взаимодействия редактора с сервисом следующий:
1. Название сервиса {standard}ApiService, где {standard} – кодовое имя стандарта, используемое в конфигурации dataSource (свойство standard).
2. Функции сервиса:
    * getHeaders(config) – обрабатывает заголовки запроса, возвращает объект типа { 'key1': 'value1', 'key2': 'value2'...};
    * getMethod(config) – задает тип запроса ('GET', 'PUT', 'POST'..);
    * getData(config) – обрабатывает данные, отправляемые данные запроса, возвращает объект с данными;
    * getParams(config) – обрабатывает данные запроса, передаваемые в URL запроса, возвращает объект с данными;
    * getURL(config) – обрабатывает URL запроса, возвращает строку;
    * processResponse(response, success, fail) – обрабатывает ответ от сервера;  

В ядре редактора по заданной маске ({standard}ApiService) будет производиться инжект сервиса. При отправке данные запроса обрабатываются этим сервисом, оперируя выше приведенным интерфейсом, а затем исполняются. 
Все функции сервиса имеют необязательный характер и, в случае отсутствия, не вызываются (исполняется логика по-умолчанию).
Полученный ответ передается в функцию для обработки ответа `processResponse`.
В рамках контекста(исполнения) `processResponse` доступны функции `fail` и `success` (передаются из редактора при вызове `processResponse`). Функция `success` вызывается при удачной обработке ответа, а `fail` – при неудачной.
Ниже приведен пример создания модуля и способ его внедрения в редактор:

```javascript

// Модуль с подключаемым сервисом
angular.module('ModuleWithService', []).service('NewFormatApiService', function() {
  var self = this;

  self.getHeaders = getHeaders;

  function getHeaders(config) { 
    var headers = {};
    headers["Content-Type"] = 'application/json';
    angular.merge(headers, config.headers)
    return headers;
  }

  function processResponse(response, success, fail) { 
    if(response.error) {
      fail(response);
    }
    if(response.success) {
      success(response);
    }
    return headers;
  }
})

// Приложение, куда подключается редактор и сервис 
angular.module('demoApp', ['universal-editor', 'ModuleWithService'])
  .controller('NewsController', function () {
      var vm = this;
      var newsDataSource = {
          standard: 'NewFormat',  // задаем тип API (Имя Сервиса будет складываться как 'NewFormatApiService')
          transport: {
            url: '//universal-backend.dev/rest/v1/news'
          },
          fields: [ /* fields */ ]
      };
    });    
    ...

```

### Свойства объекта config
Параметр __config__ – вспомогательный объект, содержащий информацию о запросе.

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| action | string | Тип запроса в рамках редактора ('list', 'one', 'create', 'update', 'delete'). | - | - |
| url | string | URL сервера из конфигурации dataSource. | - | - |
| headers | object | Заголовки запроса. | - | - |
| data | object | Данные, отправляемые в запросе. | - | - |
| params | object | Параметры, отправляемые в запросе через URL (search-параметры). | - | - |
| filter | object | Объект с данными, передаваемые в фильтре. | - | - |
| filter[\<field\>] | array | Массив объектов поля `<field>` | - | - |
| filter[\<field\>][N][operator] | string | Значение оператора для поля `<field>` в фильтре. | - | - |
| filter[\<field\>][N][value] | string | Значение поля `<field>` в фильтре. | - | - |
| sortFieldName | string | Имя поля для сортировки. | - | - |
| pagination | object | Объект с данными серверной пагинации. | - | - |
| pagination[page] | integer | Номер текущей страницы. | - | - |
| pagination[perPage] | integer | Количество записей на странице. | - | - |
```javascript

var config = {
    action: 'list',
    url: 'http://universal-editor.dev/staff',
    headers: {
        "Content-Type": "application/json"
    },
    data: {},
    params: {
      back: 'index'
    },
    pagination: {
      page: 5,
      perPage: 50
    },
    filter: {
        name1: [
          {
            operator: '>=:key',
            value: 5
          },
          {
            operator: '<=:key',
            value: 10
          }
        ],
        name2: [
          {
            operator: '%:value%',
            value: 'МФЦ'
          }
        ]  
      },
    sortFieldName: 'title'       
  }
```
