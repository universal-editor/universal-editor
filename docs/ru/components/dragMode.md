# Перетаскивание элементов в компоненте ue-grid

Компонент `ue-grid` включает возможность перетаскивать записи, реализована на базе библиотеки https://github.com/marceljuenemann/angular-drag-and-drop-lists.
Параметр `dragMode` позволяет программно описать поведение компонента при перетаскивании его частей. 
Параметр включает 6 коллбеков:
* `start` – функция вызывается, когда пользователь кликает на элемент, непосредственно перед перетаскиванием;
* `over` – функция вызывается при перетаскивании (когда удерживается левая кнопка мыши), пока сам элемент находится над списком;
* `drop` – функция вызывается по завершении перетаскивания (когда отпускается левая кнопка мыши), при отпускании элемента;
    Если функция вернет `true`, то элемент будет перенесен, если `false` – перенос будет отменен.

* `dragDisable` – функция возвращает логическое значение. Значение `false` запрещает перенос элемента, `true` – разрешает;
* `containerName` – функция возвращает строковое значение, и задает группу переносимых элементов. Допускается прописать обычное константное значение, если коллбек не нужен;
* `allowedContainers` – функция возвращает массив типов (названий групп), которые возможно перенести внутрь текущего элемента. Допускается прописать обычное константное значение, если коллбек не нужен;
* `expand` – функция возвращает Promise объект. Является обработчиком иконки для раскрытия узлов. Доступные аргументы `parentElement` – родительский объект, для которого подгружаются дочерние узлы, `dataSource` – текущий конфиг ресурса.
* `dragIcon` – флаг наличия иконки для перетаскивания. Иконка расположена в конце. Перетаскивать узел можно только с помощью неё.

Опции `containerName` и `allowedContainers` описывают возможный обмен между разными контейнерами. Например, в компонент `A` с `containerName: "phones"` нельзя будет перенести записи компонента `B` с `containerName: "fax"` и компонента `C` c `containerName: "mobiles"`. Но такой обмен записями станет возможным есть указать принимаемый тип в параметре `allowedContainers`.

```javascript
var A = {
    component: {
        name: 'ue-grid',
        settings: {            
            dataSource: source,
            dragMode: {
                    containerName: 'phones',
                    allowedContainers: ['fax', 'mobiles']
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
                    containerName: 'fax'
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
                    containerName: 'mobiles'
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
                    start: function(e, element, collection) {
                    },
                    over: function(e, element, destElement, collection) {
                    },
                    drop: function(e, element, destElement, collection) {
                        return true;
                    },
                    dragDisable: function(element, collection) {
                        return element.active === 1;
                    },
                    containerName: function(element, collection) {
                        return element.fieldType;
                    },
                    allowedContainers: function(element, collection) {
                        return element.allowedType;
                    },
                    expand: function(dataSource, parentElement) {
                        return $http.get('/assets/dragAndDrop.childs.json').then(function(response) {
                            return response.data.items;
                        });
                    },
                    dragIcon: true                    
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

