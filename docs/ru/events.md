# События

Универсальный редактор использует событийную модель взаимодействий компонентов, 
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

### ue:beforeComponentDataLoaded

Событие перед отправкой запроса на получение данных с API.
Доступные свойства аргумента `data`:

+ `$id` – id компонента, которое инициирует отправку запроса на чтение данных;

```javascript
$rootScope.$on('ue:beforeComponentDataLoaded', function(e, data) {
   // data.$id – идентификатор компонента
});
```

### ue:componentDataLoaded

Событие вызывается после загрузки данных с API.

### ue:componentError

Событие вызывается при ошибочных запросах для вывода сообщений серверной валидации.

### ue:errorLoadingData

Событие вызывается при ошибочном запросе на получение данных.

### ue-grid:contextMenu

Событие инициируется при клике по контекстному меню в компоненте `ue-grid`
Доступные свойства аргумента `data`:

+ `primaryKey` – имя поля с идентификатором;
+ `record` – полная запись из компонента, на которой вызвано меню;

```javascript
$rootScope.$on('ue-grid:contextMenu', function(e, data) {
   var record = data.record;
   var primaryKey = data.primaryKey;
});
```

### ue:componentValueChanged

Событие вызывается при изменениях в модели данных в `ue-form` компоненте, но слушается всеми компонентами включенные в компонент формы. Оно предназначено для обновления таких динамичных свойств, как useable и readonly (если они заданы с помощью коллбеков).
Событие принимает параметр `data` – измененное значение компонента `ue-form`. Вместе с тем `data.$componentId` хранит id компонента вызвавшее событие (а именно компонента формы)

```javascript

vm.ueConfig = {
    component: {
        $id: 'form_id',
        name: 'ue-form',
        settings: {
            dataSource: false,
            primaryKeyValue: null,
            body: [
                    {
                    name: 'id',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'ID',
                            validators: [
                                {
                                    type: 'number'
                                }
                            ],
                            disabled: true
                        }
                    }
                },
                {
                    name: 'title',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'Title'
                        }
                    }
                }
            ]
        }
    }
};

$scope.$on('ue:componentValueChanged', function(event, data) {
    if(data.$componentId === 'form_id') {
        // обработка события
        /** 
            Пример объекта 
                data = {
                    $componentId: 'form_id',
                    id: 2568,
                    title: 'Название категории'
                }
        */
    } 
});
```

### ue-group:forceUseable и ue-group:forceReadonly

Событие вызывается при принудительной установке значений параметров `useable` и `readonly` у компонентов внутри контейнера `ue-group`.
Если у компонента `ue-group` установлен коллбек на эти параметры, то вызов этих событий инициируется группой для смены тех же самых параметров у всех ее дочерних компонентов. "Принудительная установка" означает выставление значения настройки компонента без учета его собственных значений. То есть параметры `readonly` и `useable` родительского `ue-group` приоритетнее и его дочерние компоненты повторяют поведение родительского.
