# JSON API

В сборку редактора входит сервис для обработки запросов спецификации [JSONAPI](http://jsonapi.org/format/). `JSON API` – один из стандартов разработки вебсервисов, который в настоящее время набирает популярность.
Функционал сервиса работает согласно документации по настройке взаимодействия с API. 

Замечание. Спецификация стандарта диктует обязательность параметра `standard`. Для этих целей в конфигурацию `dataSource`, а также в конфигурацию компонентов со сложным именем добавлен параметр `resourceType`.

### Инструкция для разворачивания тестового сервера
В качестве тестового API-сервера используется [jsonapi-server](https://github.com/holidayextras/jsonapi-server).

Для запуска:
1. Клонировать репозиторий в папку;
2. Открыть консоль из корня папки;
3. Выполнить npm i;
4. Выполнить npm run start;

Сервер запуститься на http://localhost:16006.
В демо-версии есть вкладка Articles. В ней сконфигурирован редактор, работающий с этим тестовых сервером.

### Переопределение фильтрации и пагинации

У `JSON API` нет строгой спецификации на [фильтрацию](http://jsonapi.org/format/#fetching-filtering) и [пагинацию](http://jsonapi.org/format/#fetching-pagination). В редакторе по-умолчанию используется пагинация со смещением (based-offset).

Действующий сервис для работы с JSON API (JSONAPIApiTypeService) логику по заданию фильтров осуществляет в рамках функции `setFiltering`, а пагинации – в рамках функции `setPagination`. Обе функции в качестве аргумента принимают объект `config`, описанный в разделе [Правила взаимодействия с API](typeOfApi.md);

Чтобы переопределить правила задания фильтрации и пагинации рекомендуется воспользоваться декорированием методов сервиса в Angular (https://docs.angularjs.org/guide/decorators).
Пример: 

```javascript
  angular.module('MyEditor', ['universal-editor'])
    .config(function($provide) {
      $provide.decorator('JSONAPIApiTypeService', function($delegate) {

        $delegate.setFiltering = function(config) {
          config.params.filter = { /* Содержимое фильтра */};
        };

        $delegate.setPagination = function(config) {
          config.params.page = { /* Объект пагинации */};
        };

        return $delegate;
      });
    });
```
