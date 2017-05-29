# Компоненты

* [Общие настройки](main.md)
* [Режимы работы](mode.md)
* [Шаблоны](templates.md)
* [Управление отображением](visualization.md)
* Штатные компоненты Универсального редактора:
    * [ue-grid](ue-grid.md)
    * [ue-filter](ue-filter.md)
    * [ue-pagination](ue-pagination.md)
    * [ue-form](ue-form.md)
    * [ue-form-tab](ue-form-tab.md)
    * [ue-group](ue-group.md)
    * [ue-string](ue-string.md)
    * [ue-textarea](ue-textarea.md)
    * [ue-autocomplete](ue-autocomplete.md)
    * [ue-dropdown](ue-dropdown.md)
    * [ue-colorpicker](ue-colorpicker.md)
    * [ue-date](ue-date.md)
    * [ue-radiolist](ue-radiolist.md)
    * [ue-checkbox](ue-checkbox.md)
    * [ue-button](ue-button.md)

## Создание новых компонентов

Angular располагает инструментами для создания компонентов 
(см. https://docs.angularjs.org/guide/component). Далее созданный компонент 
можно включить в состав редактора. Компонент – DOM-элемент, который 
снабжается определенной логикой Angular-приложения. Компонент обладает 
поведением и имеет собственные настройки, задаваемые в конфиге в разделе 
`settings`. Поведение компонента определяет контроллер, в котором заключена 
основная логика. Контроллер передает данные в представление компонента 
(визуальная часть элемента в виде HTML-разметки). Т. е. создание нового 
компонента заключается в регистрации компонента, написании контроллера 
и представления.  

Все подключаемые компоненты рекомендуется группировать в Angular-модули 
и подключеть как дочерние к внешнему приложению  (как показано в примере ниже). 

```javascript
angular.module('moduleWithComponents', [])
    // Объявление компонента и задание его переменных
    .component('ueCustomComponent',{
        bindings : {
            setting: '=',
            options: '='
        },
        template : ['$templateCache', function ($templateCache) {
            return '<input type="text" data-ng-disabled="vm.readonly" ng-style="{\'color\': vm.colorText, \'width\': vm.widthField}" name="{{vm.name}}" data-ng-click="vm.clickHandler($event)" data-ng-model="vm.fieldValue" class="form-control input-sm"/>';
        }],
        controller: 'ueCustomComponentController',
        controllerAs : 'vm'
    })

    // Подключение контроллера компонента
    .controller('ueCustomComponentController', ['$scope', '$controller', function($scope, $controller) {
        var vm = this;
        vm.$onInit = function() {
            var baseController = $controller('FieldsController', {$scope: $scope, $element: $element});
            var settings = vm.setting.component.settings;
            angular.extend(vm, baseController);
            

            // Пример переопределения $scope-события
            vm.listeners.push($scope.$on('ue:componentDataLoaded', function(e, data) {
                $scope.onLoadDataHandler(e, data);
                // Логика
            }));

            vm.widthField = settings.widthField;
            vm.colorText = settings.colorText;

            vm.clickHandler = function(e) { 
                // Логика
                alert('Clicked to component.');
            };
        }
    }]);

    // Подключение модуля с компонентами к основному приложению
    angular.module('testApp', ['universal.editor', 'moduleWithComponents']);
```

Вся логика будущего компонента закладывается в контроллере. Подключение 
базового контроллера `FieldsController` обеспечивает заполнение модели 
`vm` основными [настройками и обработчиками](component.md).

* `vm` – основная модель компонента;
* `vm.getFieldValue` – функция получения объекта вида {<имя_компонента>: <значение_компонента>}, которая извлекает значение компонента;
* `vm.clear` – функция очищения значения компонента.
* `vm.listeners` – массив обработчиков $scope. Сюда следует добавлять все обработчики связанные с компонентом.
* `vm.<настройка конфига>` – имя настройки из свойства __settings__ конфигурационныого файла.
* `vm.fieldValue` – значение компонента компонента;
* `vm.error` – массив текстов ошибок.

На компоненте можно события:

* серверная валидация – событие `ue:componentError` (по-умолчанию функция-обработки `$scope.onErrorApiHandler`)

Созданный компонент подключается в конфигурации редактора: 

```javascript 
{
    component: {
        name: 'ue-custom-component',
        settings: {
            // Настройки компонента
            readonly: false,
            colorText: '#445866',
            widthField: '400px'
        }
    }
}
```

В итоге в HTML-разметке должен появиться следующий DOM-элемент:

```html 
<component-wrapper>
    <ue-custom-component>
        <!-- Шаблон компонента -->
    </ue-custom-component>
<component-wrapper>
```

> Если возникнет необходимость написанный на Angular2 компонент использовать 
> в приложении на Angular1.x, см. статью [Using Angular 2 Components from Angular 1 Code](https://angular.io/docs/ts/latest/guide/upgrade.html#!#using-angular-2-components-from-angular-1-code).

## Наследование логики контроллеров

Существует базовый контроллер `BaseController`, содержащий общую логику 
всех компонентов Универсального редактора. Под общей логикой понимается 
функциональность, связанная с обработкой настроек полей, вотчерами, 
обработчиками $scope-событий и т.д.

Кроме того, существуют базовые реализации контроллеров компонентов-полей 
и компонентов-кнопок, содержащие специфичную для их предметной области логику:

**BaseController** → **FieldController**  → {{Все контроллеры компонентов-полей}}

**BaseController** → **ButtonController** → {{Все контроллеры компонентов-кнопок}}

При описании собственных компонентов рекомендуется наследоваться от 
базовых контроллеров для уменьшения количества кода и экономии времени. 

Пример наследования:

```javascript
    angular.module('universal.editor').controller('BaseController', ['$scope', function($scope){
      /** 
        общая логика полей
      */
    }]);

    // Контроллер компонента
    angular.module('universal.editor').controller('ComponentController', ['$controller', '$scope', function($controller, $scope, $element) {
      
      // Расширяем контроллер и получаем экземпляр для дальнейшего использования
      var BaseController = $controller('BaseController', {
          $scope: $scope,
          $element: $element
      });

      // Логика компонента
   }]);
```
