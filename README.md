Адрес ресурса берется из константы urlSite (js/main.js). По умолчанию - http://localhost:3000

В работе использованы:
* Библиотека Bootstrap (реализация модальных окон)
* Плагин Choices.js (кастомизация селектов)
* Плагин Tippy.js (кастомизация тултипов для контактов)

Сделаны улучшения и дополнения:
1. Анимация открытия модального окна (задействовано с помощью bootstrap);
2. Ссылка на карточку клиента (при открытии окна кнопкой "Изменить контакт");
3. Валидация формы перед отправкой на сервер;
4. Индикация загрузки:
	4.1. Загрузка таблицы со списком клиентов при открытии страницы (до получения данных по API отображается большой спинер)
	4.2. Загрузка данных клиента при открытии формы редактирования (выводится спиннер на кнопке редактирования, модальное окно открывается только после загрузки данных клиента);
	4.3. Отправка формы создания или редактирования клиента (поверх формы формы создается абсолютно позиционированный внешний слой, препятствующий изменению формы; на кнопке "Сохранить" появляется спинер).

	


