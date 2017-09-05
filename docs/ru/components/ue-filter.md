## ue-filter

Компонент для фильтрации данных, отображаемых в другом компоненте (например, `ue-grid`).

```javascript
var filter = {
    component: {
        name: 'ue-filter',
        settings: {
            dataSource: staffDataSource,
            header: {
                label: 'Фильтр',
                toolbar: [
                    {
                        component: {
                            name: 'ue-button',
                            settings: {
                                label: 'Создать',
                                sref: 'create'
                            }
                        }
                    }
                ]
            },                
            fields: ['field1', 'field2'],
            footer: {
                toolbar: [ //если toolbar не описан, то по умолчанию выводим кнопки Применить и Очистить
                    {
                        component: {
                            name: 'ue-button',
                            settings: {
                                label: 'Очистить',
                                action: function(componentId) {
                                    FilterFieldsStorage.clear(componentId);
                                }
                            }
                        }
                    },
                    {
                        component: {
                            name: 'ue-button',
                            settings: {
                                label: 'Применить',
                                action: function(componentId) {
                                    FilterFieldsStorage.apply(componentId);
                                }
                            }
                        }
                    }                            
                ]
            }
        }
    }
};

var grid = {
    name: 'ue-grid',
    settings: {
        dataSource: staffDataSource,
        header: {                    
            filter: filter
        }
    }
}
```

Если в компоненте `ue-grid` не указана никакая информация о фильтрах, то по умолчанию подключается компонент `ue-filter` 
со всеми включенными полями из таблицы и кнопками по умолчанию.

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| name | string | Название копонента. | + | - |
| settings | object | Объект настройки компонента | + | - |
| settings[dataSource] | object | Объект настройки компонента по работе с бекендом | + | - |
| settings[header] | object | Объект описывающий шапку фильтра | - | - |
| settings[header][label] | string | Заголовок фильтра | - | "Фильтр" |
| settings[header][toolbar] | array | Массив для описания компонетов, которые выводятся правее кнопки "Фильтр" | - | - |
| settings[fields] | array | Массив имен столбцов, которые нужно фильтровать | - | Все поля основного компонента |
| settings[footer] | object | Объект, описывающий подвал окна | - | - |
| settings[footer][toolbar] | array | Объект для описания кнопок, выводимые в подвале фильтра. | - | Кнопки «Применить» и «Очистить» |

Поля фильтра реализованы через `componentWrapper` с передачей флага фильтра в качестве атрибута:

```html
<component-wrapper data-setting="component" data-filter="true"></component-wrapper>
```

Фильтр не должен существовать отдельно от основного компонента, поэтому для связности в него нужно передавать `$id` и `dataSource` основного компонента, 
чтобы `ue-filter` мог вызывать событие обновления, относящееся только к этому компоненту.

Флаг фильтра нужен для регистрации поля в `FilterFieldsStorage` (с учетом идентификатора основного компонента) и 
отличного от обычного поля представления фильтра (если необходимо).

Значения собираются сервисом `FilterFieldsStorage`.
