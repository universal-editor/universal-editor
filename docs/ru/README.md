# Документация

* [Начало работы](getting-started.md)
* [Настройка конфигурации редактора](configuration.md)
    * Типы полей:
        * [String](fields/string.md)
        * [Colorpicker](fields/colorpicker.md)
        * [Textarea](fields/textarea.md)
        * [WYSIWYG](fields/wysiwyg.md)
        * [Date](fields/date.md)
        * [Time](fields/time.md)
        * [Datetime](fields/datetime.md)
        * [Checkbox](fields/checkbox.md)
        * [Radiolist](fields/radiolist.md)
        * [Select](fields/select.md)
        * [Autocomplete](fields/autocomplete.md)
        * [Array](fields/array.md)
        * [Map](fields/map.md)
* [Смешанный режим отображения сущностей](mixed-mode.md)
* [Внедрение директив извне](injection-directive.md)

---

## Часто задаваемы вопросы

#### После подключения и запуска редактора, мне показана таблица с одним пустым столбцом и множеством строк.

Скорее всего для редактируемой сущности ни у одного поля (`fields`) не указан параметр `"list": true`, поэтому ни одно 
поле не отображается в списке. Подробнее о настройке отображаемых полей см. в разделе о [конфигурации](configuration.md).

#### При открытии формы редактирования сущности в консоли появляется множество ошибок. Данные для некоторых полей не загружаются.

Проверьте наличие параметра `"expandable": true` в конфигурации данного поля. Если бекенд не возвращает данное поле 
по-умолчанию, то, возможно требуется указать этот параметр, чтобы через GET-параметр это поле было запрошено 
дополнительно.
