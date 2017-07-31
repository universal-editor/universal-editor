# Техрешение

## Механизм  блокировок
Механизм блокировок предназначен для невозможности редактировать абстрактную сущность на форме редактора одновременно двумя клиентами.
За события и механизм блокировок отвечает компонент `ue-lock`, который можно поместить в любое место формы, и сервис `LockService`, который будет "прослойкой" между компонентом блокировок и остальных компонентов для их взаимодействия.
Основной алгоритм:
1. При прогрузке компонента, содержащего компонент `ue-lock`, появляется прелоадер. 
2. `ue-lock` вызывает сервис ApiService и направляет запрос к серверу о попытке блокировки записи. 
3.1. Если сервер положительно ответил и разрешил редактирование записи, то прелоадер исчезает (если он есть) и форма свободна для дальнейшего редактирования.
3.2. Запускается таймер в N минут для повторного запроса. После истечения тайминга отправляется повторный запрос на продление блокировки. В случае смены стейта с перезагрузкой или закрытия окна браузера с помощью сервиса ApiService отправляется запрос для разблокировки записи.
4. Если сервер на запрос о блокировке записи не дал разрешение на редактирование записи, тогда прелоадер исчезает (если он есть) и `ue-lock` блокирует родственные компоненты (+ инициирует событие `ue-lock: lock`), а сам `ue-lock` отображается в виде сообщения о блокировке записи. Запускается таймер в N минут для повторного запроса. После истечения тайминга переходим к п. 2.

Общая блок-схема механизма  [Общая блок-схема блокировок](../images/Blocks.jpg)

Общий вид `dataSource`:

``` javascript
var dataSource = {
    standard: 'YiiSoft',
    primaryKey: 'id',
    sortBy: [ 'title'],
    transport: {
        create: {
            contentType: 'application/x-www-form-urlencoded',
            data: function(item) {
                return item
            },
            params: function(item) {
                return {};
            }
            method: 'POST',
            url: '/domain/entities/new',
            handlers: {
                before: function (config, e) {
                    e.preventDefault(); // this is canceled request
                },
                error: function (response, e) {},
                success: function (response, e) {},
                complete: function (e) {}
            }
        },
        update: {
            contentType: 'application/x-www-form-urlencoded',
            data: function(item) {
                return item
            },
            method: 'PUT',
            url: '/domain/entities/:id',
            handlers: {
                before: function (config, e) {
                    e.preventDefault(); // this is canceled request
                },
                error: function (response, e) {},
                success: function (response, e) {},
                complete: function (e) {}
            }
        },
        destroy: {
            contentType: 'application/x-www-form-urlencoded',
            data: function(item) {
                return item
            },
            method: 'DELETE',
            url: function(item) { 
                return '/domain/entities/' + item.id; 
            }
        },
        read: {
            contentType: 'application/x-www-form-urlencoded',
            data: function(item) {
                return item
            },
            headers:  function(item) {
                return item
            },
            params: function(item) {
                return {};
            }
            method: 'GET',
            url: '/domain/entities'
        },
        lock: {
            method: 'POST',
            url: '/domain/lock/:id'
        },
        unlock: {
            method: 'POST',
            url: function(item) { 
                return '/domain/unlock/' + item.id; 
            }
        }
    },
    fields: [
      {
          name: 'id',
          component: {
              name: 'ue-string',
              settings: {
                  label: 'ID',
                  validators: [{type: 'number'}],
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

var config = {
    name: 'ue-form',
    settings: {
        dataSource: dataSource,
        primaryKeyValue: function() {
            return $state.params.pk;
        } 
        header: {
            toolbar: [
                {
                    component: {   
                        id: 'backBtn',                 
                        name: 'ue-button',
                        settings: {
                            label: 'Назад',
                            useBackUrl: true
                        }
                    }
                }
            ]
        },
        body: [
          'id', 
          'title',
          {
            component: {
              name: 'ue-lock',
              settings: {
                unLockComponents: ['backBtn']
                timing: 15
              }
            }
          }
        ]
    }
}
```

## Компонент блокировок

Секция `dataSource[transport]` будет описывать CRUD-операции для ue-form и ue-grid, а также блокировок. В этом случае в разрезе блокировок форма будет работать бок о бок с dataSource.
Если какой-то компонент не нужно блочить, то предполагается передача его id компонента ue-lock, который исключит его из списка заблокированных.

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| unLockComponents | array | Массив id компонентов, которые не блокируются компонентом `ue-lock`. | - | пустой массив |
| lockComponents | array |  Массив id компонентов, которые блокируются компонентом `ue-lock`. | - | пустой массив |
| timing | number |  Время в минутах, на которое блокируются компоненты. | - | 15 |

Настройки компонента `ue-lock[unLockComponents]` и  `ue-lock[lockComponents]` являются взаимоисключающими.


## События

`ue-lock:lock` – событие блокировки, параметр `data` – объект вида { $componentId: , item: { /* заблокированная запись */}}.  Пример обработки

``` javascript

$scope.$on('ue-lock: lock', function(e, data) { /* локика */});

```


`ue-lock:unlock` – событие разблокировки, параметр `data` – объект вида { $componentId: , item: { /* разблокированная запись */}}. Пример обработки

``` javascript

$scope.$on('ue-lock:unlock', function(e, data) { /* локика */});

```