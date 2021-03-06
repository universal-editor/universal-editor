## ue-button

Компонент кнопки. Визуально представляет из себя обычную кнопку с настраиваемым поведением.

```javascript
{
	label: 'Text',
	action: 'save' | 'presave' | 'delete' | 'create' | 'open' | function(){}
	handlers: {
		before: function (config) {},
		error: function (response) {},
		success: function (response) {},
		complete: function () {}
	},
	sref: 'news.edit',
	href: '//ya.ru',
	useBackUrl: true,
	target: '_blank'
}
```

```javascript
var contextRecordId;
$rootScope.$on('ue-grid:contextMenu', function(e, data) {
	var record = data.record;
  var primaryKey = data.primaryKey;
	contextRecordId = record[primaryKey];
});
{
	label: 'Text',
	sref: {
			name: 'staff_edit',
			parameters: function() {
					return {'pk': contextRecordId};
			}
	},
	useBackUrl: true
}
```

Параметр `sref` может выглядеть как объект, описывающий переход к другому стейту. В объект можно передать символьное имя стейта(свойство `name`) и его параметры (свойство `parameters`). Свойство `parameters` может быть объектом, который без изменений прокинется в следующий стейт, или коллбеком, функции вызываемой при формировании параметров для стейта.

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| name | string | Название компонента | + | - |
| settings | object | Объект настройки компонента | + | - |
| settings[action] | string или function | Символьный код функции кнопки (см. описание ниже) | + | - |
| settings[label] | string | Название кнопки (отображается в интерфейсе) | - | - |
| settings[handlers] | object | Объект с коллбеками при работе с запросом. | - | - |
| settings[handlers][before] | function | Функция, вызываемая непосредственно при отправке запроса. `config` - это объект с настройками, который используется для генерации HTTP запроса (подробнее [здесь](https://docs.angularjs.org/api/ng/service/$http#usage)). Если коллбек вернет `false`, то произойдет отмена запроса. | - | - |
| settings[handlers][error] | function | Функция, вызываемая непосредственно при ошибке запроса. `response` - это объект, который пришел от сервера. | - | - |
| settings[handlers][success] | function | Функция, вызываемая непосредственно при удачно завершившемся запросе. `response` - это объект, который пришел от сервера. | - | - |
| settings[handlers][complete] | function | Функция, вызываемая непосредственно после всех обработчиков. | - | - |
| settings[sref] | string или object | Символьный код стейта, куда должен выполниться переход, или объект описывающий поведение при переходе на другой стейт. | - | - |
| settings[useBackUrl] | boolean | Флаг, который велит компоненту сначала изъять имя стейта из query-параметра back и, в случае его осутствия, обращаться к параметрам state и url соотвтественно. | - | false |
| settings[target] | string | Принимает значение, как атрибут «target» у ХТМЛ-тега `<a>`. Если указан, значит нужно открыть гиперссылку по указанному URL. | - | - |

Поле action имеет следующие возможные значения:
* save - кнопка, которая вызывает сервис для запроса на сохранение/обновление записи и делает переход на указанный стейт;
* presave - кнопка, которая вызывает сервис для запроса на сохранение/обновление записи;
* delete - кнопка, которая вызывает сервис для запроса на удаление записи и делает переход на указанный стейт;
* open - тип кнопки, употребляемый в контекстном меню, при работе с ue-grid. Предназначена для перехода к дочерним записям во вложенном и смешаном режимах;
* Если на месте параметра установлена функция, то она выполнится при клике на кнопку.

Если параметр `label` не задан, то для известных типов кнопок (save, presave, delete, open) значение берется из файла локализации.

Если расположить кнопку в компоненте, имеющий фильтр, то в качестве аргумента функции параметра action можно получить идентификатор компонента `componentId`, к которому относится фильтр. 
А через сервис `FilterFieldsStorage` доступны функции `apply(componentId)` (для инициации фильтра) и `clear(componentId)` (для очистки фильтра). То есть кнопку для отчистки фильтра можно задать следующим образом:

```javascript
{
	label: 'Очистить',
	action: function(componentId){
    FilterFieldsStorage.clear(componentId);
  }
}
```
