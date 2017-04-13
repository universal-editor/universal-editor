# Перетаскивание элементов в компоненте ue-grid

Компонент `ue-grid` включает возможность перетаскивать записи, реализована на базе библиотеки https://github.com/marceljuenemann/angular-drag-and-drop-lists.
Параметр `dragMode` позволяет программно описать поведение компонента при перетаскивании его частей. 
Параметр включает 6 коллбеков:
* `start` – функция вызывается, когда пользователь кликает на элемент, непосредственно перед перетаскиванием;
* `over` – функция вызывается при перетаскивании (когда удерживается левая кнопка мыши), пока сам элемент находится над списком;
* `drop` – функция вызывается по завершении перетаскивания (когда отпускается левая кнопка мыши), при отпускании элемента;

    Данный коллбек может возвращать Promise или логическое значение. Если был передан Promise, то результат перетаскивания отобразится после его выполнения, 
    а в случае его отклонения перемещение элемента не состоится.
    Если функция вернет `true`, то элемент будет перенесен, если `false` – перенос будет отменен.

* `dragDisable` – функция возвращает логическое значение. Значение `false` запрещает перенос элемента, `true` – разрешает;
* `type` – функция возвращает строковое значение, и задает группу переносимых элементов. Допускается прописать обычное константное значение, если коллбек не нужен;
* `allowedTypes` – функция возвращает массив типов (названий групп), которые возможно перенести внутрь текущего элемента. Допускается прописать обычное константное значение, если коллбек не нужен;

Опции `type` и `allowedTypes` описывают возможный обмен между разными контейнерами. Например, в компонент `A` с `type: "phones"` нельзя будет перенести записи компонента `B` с `type: "fax"` и компонента `C` c `type: "mobiles"`. Но такой обмен записями станет возможным есть указать принимаемый тип в параметре `allowedTypes`.

```javascript
var A = {
    component: {
        name: 'ue-grid',
        settings: {            
            dataSource: source,
            dragMode: {
                    type: 'phones',
                    allowedTypes: ['fax', 'mobiles']
                },
            columns: ['...']
        }
    }
}

var B = {
    component: {
        name: 'ue-grid',
        settings: {            
            dataSource: source,
            dragMode: {
                    type: 'fax'
                },
            columns: ['...']
        }
    }
}

var C = {
    component: {
        name: 'ue-grid',
        settings: {            
            dataSource: source,
            dragMode: {
                    type: 'mobiles'
                },
            columns: ['...']
        }
    }
}
```

Пример со всеми настройками параметра `dragMode`:

```javascript
{
    component: {
        name: 'ue-grid',
        settings: {            
            dataSource: {
                standard: 'YiiSoft',
                url: '//universal-backend.dev/rest/v1/staff',
                sortBy: '-id',
                primaryKey: 'id',
                fields: []
            },
            dragMode: {
                    start: function(e, element, destElement, collection) {
                        // начало переноса элемента
                    },
                    over: function(e, element, destElement, collection) {
                        // срабатывает на протяжении переноса элемента
                    },
                    drop: function(e, element, destElement, collection) {
                        var defer = $q.defer();
                        // срабатывает при отпускании.
                        defer.resolve();
                        return defer.promise;
                    },
                    dragDisable: function(element, collection) {
                        // Делает переносимыми только активные записи.
                        return element.active === 1;
                    },
                    type: function(element, collection) {
                        return element.fieldType;
                    },
                    allowedTypes: function(element, collection) {
                        return element.allowedType;
                    }
                    
                },
            columns: []
        }
    }
}
```

## Описание аргументов коллбеков

| Имя аргумента | Тип | Описание |
| --- | --- | --- |
| event | object | Объект события, передаваемый браузером (https://developer.mozilla.org/en-US/docs/Web/Events/dragstart) |
| element | object | Объект данных, который переносится |
| destElement | object | Объект данных, который принимает переносимые данные |
| collection | array | Полный список элементов компонента |

