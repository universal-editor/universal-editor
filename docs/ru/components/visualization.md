# Cпособы настройки отображения компонентов

Для управления визуального восприятия компонентов используются такие параметры как `readonly`, `useable` и `disabled`.
Параметр `readonly` в конфигурации компонентов отвечает за указание активности компонента с точки зрения взаимодействия с пользователем.
Параметр `useable` в конфигурации компонентов отвечает за отображение компонента и последующую отправку его значения на сервер.
Параметр `disabled` в конфигурации компонентов отвечает за отображение только лишь значения, без каких-либо элементов управления.

Если у компонента установлен параметр `disabled`, то данные отображаются как текст без возможности редактирования, но не уходят на сервер и в случае отсутствия значения, компонент совсем не отображается.

# Условное отображение и условное редактирование компонента

`readonly` и `useable` способны принимать в качестве значения функцию с одним аргументом. Функция возвращает значение типа `boolean`, а аргументом является объект `data` со значениями компонентов, на основании которых можно задать соответствующее поведение компонента (отображать или делать компонент неактивным).
Эти функции обратного вызова будут срабатывать, если один из компонентов вдруг изменил свое значение.

`readonly` можно задавать константным значением `true` или `false` (по-умолчанию `false`);
`useable` может быть только функцией.

В случае когда `useable` принимает значение `false`, компонент пропадает из виду и не отправляется на сервер.

В примере ниже показано как отображать ту или иную группу полей в зависимости от значения поля `typeFrame`.

```javascript
var framesDataSource = {
  type: 'YiiSoft',
  url: 'http://api.com/frames',
  fields: [
    {
      name: 'typeFrame',
      component: {
        name: 'ue-radiolist',
        settings: {
          label: 'Тип узла',
          values: {
            'reference': 'Ссылка',
            'page': 'Страница'
          }
        }
      }
    },
    {
      name: 'template',
      component: {
        name: 'ue-dropdown',
        settings: {
          label: 'Шаблон',
          remoteValues: {
            fields: {
              key: 'id',
              label: 'title'
            },
            url: 'http://api.com/templates'
          }
        }
      }
    },
    {
      name: 'url',
      component: {
        name: 'ue-string',
        settings: {
          label: 'Адрес ссылки',
          validators: [
            {
              type: 'string',
              contentType: 'url'
            }
          ]
        }
      }
    }
  ]
};
vm.ueConfig = {
  component: {
    name: 'ue-form',
    settings: {
      dataSource: framesDataSource,
      body: ['typeFrame',
        {
          component: {
            name: 'ue-group',
            settings: {
              useable: function(data) {
                return data.typeFrame === 'reference';
              },
              fields: [
                {
                  component: {
                    name: 'ue-component',
                    settings: {
                      templates: {
                        preview: function() {
                          return '<p>Ссылки осуществляют переадресацию по указанному URL.</p>';
                        }
                      }
                    }
                  }
                }, 'url'
              ]
            }
          }
        },
        {
          component: {
            name: 'ue-group',
            settings: {
              useable: function(data) {
                return data.typeFrame === 'page';
              },
              fields: [
                {
                  component: {
                    name: 'ue-component',
                    settings: {
                      templates: {
                        preview: function() {
                          return '<p> Страницы могут содержать различный настраиваемый контент, определенный шаблонами. </p>';
                        }
                      }
                    }
                  }
                }, 'template'
              ]
            }
          }
        }],
      footer: {}
    }
  }
};
```
