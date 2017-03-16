(function () {
    'use strict';

    angular
        .module('universal-editor')
        .config(LocalizationMessage);

    function LocalizationMessage($translateProvider) {
        "ngInject";

        var constantLang = {
            'RESPONSE_ERROR': {
                'INVALID_DATA': 'Неправильно заполнена форма',
                'SERVICE_UNAVAILABLE': 'Сервис временно недоступен',
                'UNEXPECTED_RESPONSE': 'Сервис вернул неожиданный ответ',
                'UNAUTHORIZED': 'Требуется авторизация',
                'RELOAD_PAGE': 'Требуется повторная авторизация, перезагрузите страницу',
                'FORBIDDEN': 'Нет доступа',
                'NOT_FOUND': 'Запись не найдена',
                'UNDEFINED': 'Сервер временно недоступен',
                'N400': 'Неправильно заполнена форма.',
                'N401': 'Требуется авторизация.',
                'N403': 'Нет доступа.',
                'N404': 'Данные не найдены.',                
                'N422': 'Ошибочный запрос.',
                'N500': 'Внутренняя ошибка сервера.',
                'N502': 'Сервис вернул неожиданный ответ.',
                'N504': 'Истекло время ожидания.'
            },
            'CHANGE_RECORDS': {
                'CREATE': 'Запись создана',
                'UPDATE': 'Запись обновлена',
                'DELETE': 'Запись удалена'
            },
            'VALIDATION': {
                'STRING_MAX': 'Для поля превышено максимальное допустимое значение в %maxLength символов. Сейчас введено %val символов.',
                'STRING_MIN': 'Минимальное значение поля не может быть меньше %minLength символов. Сейчас введено %val символов.',
                'INVALID_PATTERN': 'Введенное значение не соответствует паттерну %pattern',
                'NUMBER_MAX': 'Для поля превышено максимальное допустимое значение %max. Сейчас введено %val.',
                'NUMBER_MIN': 'Минимальное значение поля не может быть меньше %min. Сейчас введено %val.',
                'INVALID_IMAIL': 'Введен некорректный email.',
                'INVALID_URL': 'Введен некорректный url.'
            },
            'BUTTON': {
                'ADD': 'Добавить',
                'DELETE': 'Удалить',
                'DELETE_MARK': 'Удалить метку',
                'APPLY': 'Применить',
                'CLEAN': 'Очистить',
                'HIGHER_LEVEL': 'На уровень выше',
                'FILTER': 'Фильтр',
                'ACTIONS': {
                    'SAVE': 'Сохранить',
                    'PRESAVE': 'Применить',
                    'DELETE': 'Удалить',
                    'OPEN': 'Раскрыть'
                }
            },
            'LOADING': 'Загрузка',
            'SELECT_VALUE': 'Выберите значение',
            'PERFORMS_ACTIONS': 'Выполняется действие',
            'ELEMENT_NO': 'Нет элементов для отображения',
            'ELEMENTS': 'Элементы',
            'FROM': 'из',
            'SEARCH_ELEMENTS': 'Поиск по элементам',
            'ERROR': {
                'EditEntityStorage': 'EditEntityStorage: Сущность не доступна для проверки так как она не указана или не указан её тип',
                'FIELD': {
                    'MAX_SIZE': 'Значение длины для поля "%label_field" превышает максимальное значение сетки (12).',
                    'MIN_SIZE':'Значение длины для поля "%label_field" ниже минимального значения сетки (1).',
                    'VALUES_REMOTE' : ': Не удалось получить значения для поля "%name_field" с удаленного ресурса',
                    'TEMPLATE': 'Файл %template не найден!',
                    'NOT_TYPE_VALUE': 'Для поля не указан ни один тип получения значений ( локальный или удаленный )'
                },
                'MULTIPLE_NAME': ' в режиме multiple обязательно должен быть указан параметр name.',
                'NOT_FOUND_STATE': 'Стейт %state не найден в конфигурационном файле.'
            },
            'WARNING': {
                'DELETE_RECORD': 'Удалить запись «%id»?'
            }
        };

        $translateProvider.translations('ru', constantLang);

        $translateProvider.useSanitizeValueStrategy(null);

        $translateProvider.useStaticFilesLoader({
            prefix: '',
            suffix: ''
        });
        $translateProvider.preferredLanguage('ru');
    }

})();