(function () {
    'use strict';

    angular
        .module('universal.editor')
        .config(LocalizationMessage);

    LocalizationMessage.$inject = ['$translateProvider'];

    function LocalizationMessage($translateProvider) {

        var constantLang = {
            'RESPONSE_ERROR': {
                'INVALID_DATA': 'Неправильно заполнена форма',
                'SERVICE_UNAVAILABLE': 'Сервис временно недоступен',
                'UNEXPECTED_RESPONSE': 'Сервис вернул неожиданный ответ',
                'UNAUTHORIZED': 'Требуется авторизация',
                'RELOAD_PAGE': 'Требуется повторная авторизация, перезагрузите страницу',
                'FORBIDDEN': 'Нет доступа',
                'NOT_FOUND': 'Запись не найдена'
            },
            'CHANGE_RECORDS': {
                'CREATE': 'Запись создана',
                'UPDATE': 'Запись обновлена',
                'DELETE': 'Запись удалена'
            },
            'BUTTON': {
                'ADD': 'Добавить',
                'DELETE': 'Удалить',
                'DELETE_MARK': 'Удалить метку',
                'APPLY': 'Применить',
                'CLEAN': 'Очистить',
                'HIGHER_LEVEL': 'На уровень выше',
                'FILTER': 'Фильтр'
            },
            'LOADING': 'Загрузка',
            'FILE_LOADING': 'Дождитесь загрузки файла на сервер...',
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