# Шаблоны компонентов

В рамках шаблона можно оперировать настройками текущего компонента. 

* vm – объект модели, из которой доступны настройки.
* vm.<настройка конфига> – имя настройки из конфигурационныого файла.
* vm.fieldValue – переменная со значением компонента.
* vm.data – объект api-сущности, в рамках которой действует компонент.

Текст шаблона должен представлять собой HTML-разметку с Angular-директивами, также доступны Bootstrap-стили.
В Angular-директивы, начинающиеся c __ng-__, переменные следует передавать без двойных фигурных скобок (например, vm.fieldValue), в остальных случаях – они необходимы (например, {{vm.fieldValue}}).
Если переменная указывается в Angular-директивы, то она указывается без скобок.
### Путь к шаблону

Помимо html-разметки можно указать путь к шаблону.
Редактор извлекает верстку через сервис __$templateCache__. Подробнее см. [$templateCache](https://docs.angularjs.org/api/ng/service/$templateCache).
Чтобы задействовать этот сервис в новом приложении, как правило для каждого сборщика есть соответствующие плагины, которые нужно задействовать в процессе сборки.
Если в качестве сборщика используется Gulp, в консоле нужно выполнить команду 'npm install --save gulp-ng-html2js' и затем подключать включить gulp-таску в файл сборки: 

```javascript
var gulp = require('gulp'),
    ngHtml2Js = require("gulp-ng-html2js"),
    root = './src/';

gulp.task('html2js', function () {
    return gulp.src([root + '**/*.html'])
        .pipe(ngHtml2js({
            moduleName: "universal-editor.templates"
        }))
        .pipe(plugins.rename({
            suffix: '.tpl'
        }))
        .pipe(gulp.dest(root));
});
```

Плагин создаст js-файлы c постфиксом '.tpl.js'. Этот код в рамках Angular-приложения в сервисе $templateCache кэширует html-разметку с ключом в виде адреса к файлу.
Путь к шаблонам будет формироваться как относительный адрес из указанного корневого каталога. 
Например, для файла './src/module/components/templates/filterTemplate.html' валидным станет путь 'module/components/templates/filterTemplate.html' т.к. каталог './src' в скрипте обозначен корневым (переменная root).
Таким образом, путь к шаблону является виртуальным и о нем знает только сервис $templateCache, поэтому наличие файла в скомпилированной сборке по адресу 'module/components/templates/filterTemplate.html' необязательно.
Для сборщика grunt имеется аналогичный плагин [grunt-html2js](https://github.com/karlgoldstein/grunt-html2js), webpack располагает инструментом [ngtemplate-loader](https://github.com/WearyMonkey/ngtemplate-loader)

В случае с Webpack нужно подключить __ngtemplate-loader__ в конфиг для сборки бандла. В примере ниже предполагается, что используется препроцессор jade.

```javascript
module.exports = {
  module: {
    loaders: [
      {
        test: /\.jade$/,
        loader: 'ngtemplate?relativeTo=./src/!jade'
      }
    ]
  }
};
```

### Функция для шаблона

Возможно задавать функцию, возвращающую шаблон. В качестве аргумента ей доступен __scope__ (контекстная область с переменными и функциями) компонента. 
Как видно из примера ниже можно писать собственные обработчики и применять их в шаблоне.

```javascript
 templates: {
            preview: '<span> {{vm.fieldValue}} </span>',
            edit: function(scope) {
                scope.vm.clickHandler = function(e) { /* логика */ };
                return '<input type="text" data-ng-disabled="vm.readonly" name="{{vm.name}}" data-ng-click="vm.clickHandler($event)" data-ng-model="vm.fieldValue" class="form-control input-sm"/>'
            },
            filter: 'module/components/templates/filterTemplate.html'
        }
```

Связывание разметки, заданной в шаблоне, с приложением ангуляр будет производиться через сервис __$compile__ c последующей передачей скоупа и встраиванием в разметку компонента.
Сам параметр __template__ в настройках конфигурации является необязательным.

```javascript
element.append($compile(angular.element(template))($scope));
```

## Создание простейших компонентов c шаблонами

Если стоит задача включения в конфиг примитивного компонента, необремененного сложной логикой и шаблоном, то чтобы не создавать новый компонент можно воспользоваться __ue-component__,
универсальный компонент, который выводит заданные шаблоны как они есть в таблицу, фильтр, форму...

В качестве контроллера используется __BaseController__.

Пример использования – переключатель блокировки в таблице:

```javascript
{
    name: 'ue-component',
    settings: {
        label: 'Переключатель',
        templates: {
            preview: function(scope) {
                scope.vm.lockTrigger = function(e) { /* логика */ };
                return '<span data-ng-click="vm.lockTrigger($event)" data-ng-class="{locked: vm.data.locked, unlocked: !vm.data.locked}" class="lock"></span>'
            }
        }
    }
}
```

В противном случае создается [новый компонент](README.md).