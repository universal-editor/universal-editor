## Unit-тесты

## Используемые библиотеки

* [Karmajs](http://karma-runner.github.io/2.0/index.html)
* [Jasminejs](https://jasmine.github.io/)
* [Karma-webpack](https://github.com/webpack-contrib/karma-webpack)
* [Karma-jasmine](https://www.npmjs.com/package/karma-jasmine)
* [Karma-chrome-launcher](https://www.npmjs.com/package/karma-chrome-launcher)

## KarmaJS

KarmaJS - это консольный инструмент для запуска тестов, который умеет следить за изменениями исходного кода. Настраивается с помощью конфигурационного файла karma.conf.js, в котором нужно указать пути к файлам, которые будут тестироваться, и пути к файлам, содержащие тесты. Описание настроек запуска можно найти в [официальной документации](http://karma-runner.github.io/2.0/config/configuration-file.html).

## JasmineJS

JasmineJS – фреймворк для написания js-тестов.

Основной синтаксис фреймворка:

describe() - оборачивает тесты в test-suite;

beforeEach() и afterEach() - соответственно запускаются для каждого теста;

it('название теста', function(){}) - сам тест.

### Схема написания тестов в проекте

Unit-тесты для всего проекта расположены в корневом каталоге `test`. Идеале пулл тестов пишется для каждого файла. Например, рассмотрим как написаны тесты для `Base.controller.js`.

1. Создается каталог `/test/controllers/BaseController`, который будет включать все тесты, связанные с его функциональностью.

2. Создается каталог `/test/controllers/BaseController/scenarios`, который будет включать файлы самих тестов.

3. Создается файл `/test/controllers/BaseController/test.spec.js`, который предназначен для включения все файликов с тестами из каталога `scenarios`. Также в этом файле можно совершить разного рода подготовительные действия для теста всего функционала. Например в данном случае, инициализируется сам модуль и класс `ToolsService`, который прокидывается в каждый тест. Класс включает самописные средства для работы с тестами, общие конфиги, метод создания компонента редактора по его конфигурации, Angular-сервис для получения зависимостей и т.д.

Каждый тест в каталоге `scenarios` должен иметь следующую структуру:

```javascript

module.exports = {
  runTest: function(tools) {
    it('Title of test', function() {
      // логика теста
    });
  }
};

```

На выходе должен получиться объект с методом `runTest`, который будет запускать тест в файле `test.spec.js` родительского каталога (`tools` – объект класса `ToolsService`).
Файл не обязывает писать только один тест. Возможно в один файл включить несколько логически связных тестов (на усмотрение разработчика).

Покажем общую структура каталога:

```javascript
-TestCatalog
--test.spec.js
--scenarios
---test1.it.js
---test2.it.js
---test3.it.js
...
---test4.it.js
```

## Ссылки на tutorial

1. [Тестирование AngularJS сервиса с помощью Jasmine и Karma ($httpBackend-сервис)](https://www.simplecoding.org/personal-maps-testirovanie-angularjs-servisa-s-pomoshhyu-jasmine-i-karma-chast-5.html); 
2. [Тестирование сервисов и контроллеров](https://rav.pw/unit-testing-angularjs-applications/);
3. [Официальная документация по unit-тестированию](https://docs.angularjs.org/guide/unit-testing);
4. [Как тестировать отложенные вызовы $timeout-сервиса](http://www.bradoncode.com/blog/2015/06/11/unit-testing-code-that-uses-timeout-angularjs/);
