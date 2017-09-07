## ue-form-tab

Компонент предназначен для группировки полей по разделам. Разделы отображаются в виде вкладок.

```javascript
var formTabComponent = {
        component: {
            name: 'ue-form-tabs',
            settings: {
                tabs: [
                    {
                        label: 'Tab 1',
                        fields: [
                            {
                                'id',
                                component: {
                                    name: 'ue-group',
                                    settings: {
                                        label: 'Group 1',
                                        name: 'fullName',
                                        countInLine: 2,
                                        fields: ['firstName', 'secondName']
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        }
    };
```

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| name | string | Название копонента. | + | - |
| settings | object | Объект настройки компонента | + | - |
| settings[label] | string | Название вкладки | + | - |
| settings[dataSource] | object | Объект настройки компонента по работе с серверу. Если компонент не имеет `dataSource`, то следует указать значение `dataSource: false`, иначе компонент попытается прокинуть его в дочерние компоненты. | - | Передается из родительского компонента |
| settings[tabs] | array[object] | Массив объектов, описывающие табы | + | - |
| settings[label] | string | Заголовок таба | - | Пустая строка |
| settings[fields] | array[object или string] | Массив, включаемых полей и компонентов | - | - |

В параметре __fields__ возможна вставка имени поля(тогда информация о поле извлекается из параметра __dataSource__) или копонента (__ue-grid__, __ue-group__ и т. д.).
Если параметр __dataSource__ не указан, то редактор попытается извлечь его из родительского компонента.
