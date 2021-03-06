# Краткое описание работы модулей и приложения в целом (для разрабов)

Сборка редактора осуществляется на `webpack`.
Точка входа в приложение располагается в файле `src/main.js`. 

## Стили
В случае локальной сборки и запуска подтагиваются стили bower-зависимостей (`src/bootstrap-inject.scss`), которые должны быть подключены извне, если используется продовая минифицированная версия редактора.

## Генерация html-шаблонов
Приложение использует pug-шаблонизатор для написания шаблонов. Все шаблоны генерируются в файлике `src/module/templates.module.js` и упаковываются в отдельный модуль `universal-editor.templates`. Чтобы получить доступ к разметке какого-либо шаблона используется angular-сервис `$templateCache`. Например, 

```javascript
 let ueStringHtml = $templateCache.get('module/components/ueString/ueString.html');
```

## Локализация
Локалицация приложения осуществляется посредством библиотеки `angular-translate` и настраивается в файле `src/module/localization.configFile.js`. JSON-объект с соответствующими переводами отдается сервису `$translateProvider`.

## Основной модуль
Инициализация основного модуля редактора `universal-editor` происходит в файле `src/module/universal-editor.module.js`. В основном модуле подключаются модули необходимых редактору библиотек. Здесь же находится интерсептор `EditorHttpInterceptor` – сервис, через который проходят все запросы, и логика метода `run` приложения. Этот метод срабатывает ДО инициализации приложения, точнее после загрузки инжектором всех модулей, но до их выполнения. В методе `run` вешаются обработчики событий смены стейтов, такие как `$stateChangeStart` и `$stateChangeSuccess`.

## Bootstrap частей приложения
Контроллеры, сервисы, фабрики, компоненты и директивы импортируются посредством ES-модулей и собираются в рамках angular-приложения в `module/bootstrap/bootstrap.js`. 

## Базовый компонент.

Жизнь редактора начинается при объявлении компонента `universal-editor` и передачей через атрибут `ue-config` всей конфигурации. Например, 

```html
<universal-editor ue-config="config"></universal-editor>
```

Внутри этого тега будут сгенерированы все компоненты, описанные в конфиге. Файлики компонента находятся в каталоге в каталоге `src/module/components/universalEditor`.
Логика компонента заключается в следующем: 
1. конфигурация представляет собой объект. Компонент рекурсивно осуществляет поиск компонентов и каждый из них снабжает уникальным `$id` в формате `xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx` в секции `component`. То есть имея конфигурацию компонента `config`, можно получить уникальный ключ компонента `config.component.$id`. Сам редактор активно ими пользуется для идентификации. 
2. Затем происходит извлечение языкового кода из `configuration.ui.language.code`, чтобы сообщить сервису локализации и `momentjs` текущий язык. По умолчанию используется `en`. 
3. Компонент генирирует рутовый компонент-обёртку `<component-wrapper data-setting="settings" data-options="options" ></component-wrapper>`

### Компонент обёртка component-wrapper

В рамках приложения помимо объявления компонентов напрямую по имени компонента типа `<ue-string data-setting='setting'>` действует компонент-обёртка, который ожидает только конфигурацию компонента и самостоятельно генерирует имя компонента. Например,

```html
<component-wrapper data-setting="{component: {name: 'ue-string', settings: {...}}}"></component-wrapper>
```

Файлы компонента лежат в каталоге `src/module/components/componentWrapper`.

Для генерации элементов используется фабрика `ComponentBuilder`. Сервис имеет один метод `build`, который возвращает разметку элемента.

Рекомендуется использовать именно этот способ вывода компонентов редактора, потому что `component-wrapper` также автоматически генерирует уникальный ключ компонентов, если такового по каким-то причинам нет, например, если компонент добавляется в DOM динамически. 
Уникальный ключ добавляется в html-атрибут `id`.

## Базовые контроллеры
Базовые контроллеры включают в себя общую логику компонентов: получение значений, обработка событий и т.д. 
Чтобы унаследовать логику контроллеров, нужно воспользоваться сервисом `$controller` следующим образом

```javascript
$controller('FieldsController', { $scope: $scope, $element: $element })
```

Подробнее о написании [новых компонентов](components/README.md).

## Класс DataSource 

Класс располагается в файле `src/module/classes/dataSource.js`. Для создания источника данных с конфигурацией `configuration` (описание можно найти в [Конфигурация источника данных](components/data-source.md)) нужно вызвать конструктор `new DataSource(configuration)`. Объект класса предлагает ряд методов:
1. getURL(action, entity) – получение урла по `action`-параметру, который является одним из ключиков секции `transport` в конфигурации.
2. getHeaders(action, entity) – получение заголовков (если были заданы). 
3. getMethod(action, entity) – получение типа запроса ('GET', 'PUT'...)  (если были заданы).
4. getData(action, entity) – получение данных запроса  (если были заданы).
5. getParams(action, entity) – получение данных запроса  (если были заданы).
6. getHandlers(action) – получение набора коллбэков запроса (success, error, complete, before)  (если были заданы).

Помимо методов напрямую из объекта доступна вся конфигурация переданная в конструктор.

## Сервисы приложения

В редакторе действует группа сервисов для взаимодействия с АПИ, фильтрации, пагинации и работы с компонентами.

### ApiService
Сервис используется компонентами редактора для формирования и отправки запросов, а также парсинга урлов и сохранения кеша компонентов с удаленными данными.

Работа с сущностями (абстрактными данными, которыми редактор обменивается с АПИ) компонентами такими как `ueGrid`, `ueForm` осуществляется методами, которые 
 1. Читают сущности(ь) – getItemsList, getItemById.
 Особенностью этих методов является вызов события `ue:componentDataLoaded` и передача при помощи него компонентам полученные данные сервисом.
 2. Создают сущность – addNewItem.
 3. Обновляют сущность – updateItem, presaveItem.
 4. Удаляют сущность – deleteItemById.
Все методы возвращают Promise.

Механизм действия всех указанных выше методов сводится к следующей схеме: 
1. Метод получает объект, который содержит информацию об урле, параметрах, данных и т.д.
2. Эти данные преобразуются в объект, описанный в [объект config](./server/README.md). Данная конвертация происходит в методе `getContextAnswer` текущего сервиса.
3. В методе `getAjaxOptionsByTypeService` формируются настройки будущего запроса. Логика учитывает конфигурацию dataSource компонента и объект полученный в п.2 проводится через [сервис взаимодействия с АПИ](./server/README.md) (по умолчанию `YiiSoftApiService`).
4. Сформированные настройки запроса передаются в $http-сервис.

### EditEntityStorage

Сервис используется для регистрации(addFieldController) и удаления(deleteFieldController) компонентов, извлечения компонентов по id или конфигурации (getComponentBySetting), обновления значения компонента по его параметрам (updateValueOfComponent).

### FilterFieldsStorage
Для наглядного примера допустим, что в компоненте `ue-grid` c id grid_id включена фильтрация.
Сервис используется для 
1. Регистрации(addFilterFieldController) и удаления компонентов(deleteFilterFieldController);
2. Регистрации(registerFilterController) и удаления(unRegisterFilterController) самого компонента фильтра (`ueFilter`)
3. Вычисление значения компонента фильтра по id компонента, в котором фильтр содержится. Например, получить значение фильтра можно как FilterFieldsStorage.calculate('grid_id');
4. Применить фильтрацию соответствующего компонента FilterFieldsStorage.apply('grid_id');
5. Очистить фильтр соответствующего компонента. Пример, FilterFieldsStorage.clear('grid_id');
6. Получить текущее значение фильтра компонента по его id в формате

```json
    {
        "<fieldName>": [
            { 
                "operator": "<string>", 
                "value": "<value>"
            } 
            ...
        ]
    }
```
позволяет метод FilterFieldsStorage.getFilterObject('grid_id').
Такой формат легко обрабатывать. Это объект, ключами которого являются имена полей, а значениями группа объектов, каждый из которых представляет собой пару 'оператор'-'значение'. Стоит учитывать, что оператор является маской, в которую вставляется значение. Если оператор включает в себя подстроку `:key`, то с помощью оператора будет формироваться имя поля в фильтре. Если оператор включает в себя подстроку `:value`, то с помощью оператора будет формироваться значение поля в фильтре. Например, объекту

```json
    {
        "id": [
            {
                "operator": ":value",
                "value": 5
            }
        ],
        "title": [
            {
                "operator": "%:value%",
                "value": "Title1"
            }
        ],
        "created": [
            {
                "operator": ">=:key",
                "value": "12.05.2012"
            },
            {
                "operator": "<=:key",
                "value": "12.05.2015"
            }
        ]
    }
```
соответствует значение фильтра  `{"id":5,"title":"%Title1%",">=created":"12.05.2012","<=created":"12.05.2015"}`

7. Производить преобразование объекта фильтра в query-строку (метод convertFilterToString).

8. Заполнять фильтр значениями по query-строке (fillFilterComponent). Например,
`FilterFieldsStorage.fillFilterComponent('grid_id', '{"id":5,"title":"%Title1%","type":"v1","fired":0,">=created":"12.01.2007","<=created":"12.01.2012"}')` – заполнит фильтр в компоненте c id `grid_id` соответствующими значениями, переданными во втором аргументе.

### MessagesService

Сервис создавался для вывода сообщений. 
Располагает методами 
1. success(translateName, replaceKeys) – Вывод сообщения на зеленом фоне.
2. error(translateName, replaceKeys) – Вывод сообщения на красном фоне.
3. warning(translateName, replaceKeys) – Вывод сообщения на желтом фоне.
4. consoleError(translateName, replaceKeys) – Вывод сообщения на красным шрифтом в консоле.
5. httpStatusMsg(status) – Вывод сообщения в зависимости от статуса. Сообщения для соответствующих статусов можно заложить в файлике локализации с ключиками: 
RESPONSE_ERROR.N<status>: 'Сообщение'.

Сообщения пунктов 1-4 выводятся из локали по ключику из аргумента `translateName` и подстроками для замены. 
Пример, MessagesService.success('ERROR.FIELD.NAME', { '%field': 'fieldName' }) – Сходит в файлик локализации, найдет значение сообщения и заменит все подстроки '%field' на значение 'fieldName'.

### YiiSoftApiService
Сервис имеет типовую структуру описанную в [сервис взаимодействия с АПИ](./server/README.md).

### [Unit-тесты](tests.md)










