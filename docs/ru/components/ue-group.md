## ue-group

Компонент предназначен для визуальной группировки компонентов.

```javascript
{
    component: {
        name: 'ue-group',
        settings: {
            label: 'Group 1',
            name: 'fullName',
            dataSource: formDataSource,
            countInLine: 2,
            fields: [
                'firstName', 
                'secondName'
           ]
        }
    }
}
```

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| name | string | Название копонента | + | - |
| settings | object | Объект настройки компонента | + | - |
| settings[dataSource] | object | Объект настройки компонента по работе с бекендом | - | Передается из родительского компонента |
| settings[label] | string | Заголовок группы | - | - |
| settings[countInLine] | integer | Количество элементов в строке | - | - |
| settings[name] | string | Имя поля, в которое будет группироваться выходное значение объекта | - | - |
| settings[fields] | array[string или object] | Имена, группируемых полей из параметра dataSource | - | - |

Выходное значение для примера выше будет 

```javascript
{
    fullName: {
        firstName: "value1",
        secondName: "value2"
    }
}
```

В случае отсутствия параметра компонента __name__ выходное значение будет передаваться как обычный одноуровневый объект. 

```javascript
{
    firstName: "value1",
    secondName: "value2"
}
```

В этом случае компонент используется для визуальной группировки компонентов, при чем параметром __countInLine__ есть
возможность контролировать количество элементов в строке.

Если параметр __dataSource__ не указан, то редактор попытается извлечь его из родительской формы.