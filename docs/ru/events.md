# События

Универсальный редактор использует событий модель взаимодействий компонентов, 
построенную на базе $emit, $broadcast и $on.

Для написания своей логики в событии у контроллера, унаследованного от `FieldController` или от `BaseController`, имеются методы: 

* `isParentComponent` – проверяет является ли компонент, обрабатывающий событие, родительским по отношению к компоненту, инициировавшему событие. Например, событие `ue:componentDataLoaded` инициируется компонентом формы (ue-form), обрабатывается дочерними компонентами полей (ue-string, ue-dropdown и т. д.);
* `isComponent` – проверяет является ли компонент, обрабатывающий событие, компонентом, инициировавший это событие.

Пример использования события:

``` javascript

$scope.$on('ue:componentDataLoaded', function(e, data) {
    if (vm.isParentComponent(data)) {
        // обработает все дочерние компоненты
    }

    if (vm.isComponent(data)) {
        // обработает только сам компонент
    }
});

```

## События ядра редактора

### ue:beforeEntityCreate

Событие вызывается перед созданием записи.

### ue:beforeEntityUpdate

Событие вызывается перед обновлением записи.

### ue:beforeEntityDelete

Cобытие вызывается перед удалением записи.

### ue:afterEntityCreate

Событие вызывается после создания записи.

### ue:afterEntityUpdate

Событие вызывается после обновления записи.

### ue:afterEntityDelete

Событие вызывается после удаления записи.

### ue:componentDataLoaded

Событие вызывается после загрузки данных с API.

### ue:componentError

Событие вызывается при ошибочных запросах для вывода сообщений серверной валидации.

### ue:errorLoadingData

Событие вызывается при ошибочном запросе на получение данных.

### ue-grid:ContextMenu

Событие инициируется при клике по контекстному меню в компоненте `ue-grid`
Доступные аргументы аргумента `data`:

+ `id` – идентификатор записи в таблице;
+ `primaryKey` – имя поля с идентификатором;
+ `records` – полный перечень записей;

```javascript
$rootScope.$on('ue-grid:ContextMenu', function(e, data) {
   var contextRecordId = data.id;
   var primaryKey = data.primaryKey;
   var records = data.records;
});
```
