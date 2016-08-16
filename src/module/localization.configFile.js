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
            'SELECT_VALUE': 'Выберите значение',
            'PERFORMS_ACTIONS': 'Выполняется действие',
            'ELEMENT_NO': 'Нет элементов для отображения',
            'ELEMENTS': 'Элементы',
            'FROM': 'из',
            'SEARCH_ELEMENTS': 'Поиск по элементам'
        };
        $translateProvider.translations('ru', constantLang);


        $translateProvider.useStaticFilesLoader({
            prefix: '',
            suffix: ''
        });
        $translateProvider.preferredLanguage('ru');
    }

})();