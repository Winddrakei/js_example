// константы
const addContactButton = `<button type="button" class="local-modal__add-contact"><span>Добавить контакт</span></button>`;
const editModal = new bootstrap.Modal(document.getElementById('editData'));
const loadingIndicator = document.querySelector('.clients__loading-wrapper');
const urlSite = 'http://localhost:3000'; // указать протокол + хост ресурса

// получение списка всех клиентов
async function getUserList() {
  loadingIndicator.classList.add('loading'); // отобразить индикатор загрузки
  const response = await fetch(urlSite + '/api/clients');
  const userList = await response.json();
  loadingIndicator.classList.remove('loading'); // скрыть индикатор загрузки
  createUserList(userList);

  // переопределить кнопки для сортировки списка клиентов
  const sortHeaders = document.querySelector('.clients__field-titles');
  sortHeaders.innerHTML = `<div class="clients__field-id flex"><button id="id" class="clients__field-btn sort active" data-sort-type="0">ID <span class="clients__field-arrow"><svg class="clients__field-arrow--svg" width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.49691e-07 4L0.705 4.705L3.5 1.915L3.5 8L4.5 8L4.5 1.915L7.29 4.71L8 4L4 -3.49691e-07L3.49691e-07 4Z"/></svg></span></button></div>
  <div class="clients__field-user flex"><button id="user" class="clients__field-btn sort" data-sort-type="0">Фамилия Имя Отчество <span class="clients__field-arrow"><svg class="clients__field-arrow--svg" width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.49691e-07 4L0.705 4.705L3.5 1.915L3.5 8L4.5 8L4.5 1.915L7.29 4.71L8 4L4 -3.49691e-07L3.49691e-07 4Z"/></svg> <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.37109 8L4.6582 6.01758H1.92871L1.23047 8H0L2.6709 0.832031H3.94043L6.61133 8H5.37109ZM4.35059 5.01172L3.68164 3.06836C3.63281 2.93815 3.56445 2.73307 3.47656 2.45312C3.39193 2.17318 3.33333 1.9681 3.30078 1.83789C3.21289 2.23828 3.08431 2.67611 2.91504 3.15137L2.27051 5.01172H4.35059ZM6.96289 5.80762V4.83105H9.47266V5.80762H6.96289ZM13.0322 5.13867L11.2646 8H9.93164L11.9434 4.87012C11.0319 4.55436 10.5762 3.8903 10.5762 2.87793C10.5762 2.22363 10.8024 1.72396 11.2549 1.37891C11.7074 1.03385 12.373 0.861328 13.252 0.861328H15.3955V8H14.2236V5.13867H13.0322ZM14.2236 1.83789H13.2959C12.8044 1.83789 12.4268 1.92578 12.1631 2.10156C11.9027 2.27409 11.7725 2.55729 11.7725 2.95117C11.7725 3.33529 11.8994 3.63477 12.1533 3.84961C12.4072 4.06445 12.8011 4.17188 13.335 4.17188H14.2236V1.83789Z"/></svg></span></button></div>
  <div class="clients__field-create flex"><button id="create" class="clients__field-btn sort" data-sort-type="0">Дата и время создания <span class="clients__field-arrow"><svg class="clients__field-arrow--svg" width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.49691e-07 4L0.705 4.705L3.5 1.915L3.5 8L4.5 8L4.5 1.915L7.29 4.71L8 4L4 -3.49691e-07L3.49691e-07 4Z"/></svg></span></button></div>
  <div class="clients__field-change flex"><button id="change" class="clients__field-btn sort" data-sort-type="0">Последние изменения <span class="clients__field-arrow"><svg class="clients__field-arrow--svg" width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.49691e-07 4L0.705 4.705L3.5 1.915L3.5 8L4.5 8L4.5 1.915L7.29 4.71L8 4L4 -3.49691e-07L3.49691e-07 4Z"/></svg></span></button></div>
  <div class="clients__field-contacts flex"><div class="clients__field-btn">Контакты</div></div>
  <div class="clients__field-action flex"><div class="clients__field-btn">Действия</div></div>`;

  // навесить события на кнопки сортировки в заголовках списка клиентов
  document.querySelectorAll('.sort').forEach(e => {
    e.addEventListener('click', () => {
      +e.dataset.sortType++;
      e.dataset.sortType = e.dataset.sortType % 2;
      sortUserList(userList, e.id, e.dataset.sortType);
    });
  });

  // слушать изменение hash страницы
  window.addEventListener('hashchange', openFormWithHash(userList));
}

// поиск клиентов
async function searchUser(filter) {
  const response = await fetch(urlSite + '/api/clients?search=' + filter.toLowerCase());
  const userList = await response.json();
  createUserList(userList);
}

// открытие формы через hash
function openFormWithHash(userArr) {
  const userHash = window.location.hash.slice(1);
  if (userHash) {
    userArr.forEach(el => {
      if (el.id == userHash) {
        openEditMenu(el, 1);
      }
    });
  }
}

// обработчик ответа сервера при изменении данных клиента
function loadingStatus(response) {
  document.querySelector('.clients__save-btn').remove();
  if (response.ok) {
    editModal.hide();
    getUserList();
  }
  else {
    const errorCode = +response.status;
    switch(true) {
      case errorCode == 404:
        errorMsg = 'Сервер не смог найти запрашиваемый ресурс';
        break;
      case errorCode == 422:
        errorMsg = 'Серверу не удалось обработать инструкции содержимого';
        break;
      case errorCode >= 500:
        errorMsg = 'Внутренняя ошибка сервера';
        break;
      default:
        errorMsg = 'Что-то пошло не так...';
    }
    document.querySelector('.modal-footer__info').textContent = errorMsg;
  }
}

// сортировка списка клиентов
function sortUserList(users, filter, type) {
  document.querySelector('.clients__field-btn.sort.active').classList.remove('active');
  document.querySelector(`#${filter}.clients__field-btn.sort`).classList.add('active');
  users.sort(function(a, b) {
    if (a[filter] > b[filter]) {
      return (1 - type * 2);
    }
    if (a[filter] < b[filter]) {
      return (-1 + type * 2);
    }
    return 0;
  });
  createUserList(users);
}

// инициализация плагина choice js для селектов
function choicesInitial() {
  const elementAll = document.querySelectorAll('.js-choice');
  elementAll.forEach(element => {
    const choices = new Choices(element, {
      searchEnabled: false,
      itemSelectText: '',
      sorter: () => {},
    });
  });
}

// построение списка контактов клиента в модальном окне редактора
function createContactList(contact, sel) {
  const select = document.createElement('div');
  select.classList.add('local-modal__contact-line-wrapper');
  select.dataset.contactWrap = sel;
  select.innerHTML = `<select class="js-choice" data-contact-select="${sel}" name="typeContact" aria-label="Контакт">
    <option value="phone" ${contact.type == 'phone' ? 'selected' : ''}>Телефон</option>
    <option value="mail" ${contact.type == 'mail' ? 'selected' : ''}>E-mail</option>
    <option value="fb" ${contact.type == 'fb' ? 'selected' : ''}>Facebook</option>
    <option value="vk" ${contact.type == 'vk' ? 'selected' : ''}>VK</option>
    <option value="card" ${contact.type == 'card' ? 'selected' : ''}>Другое</option>
  </select>
  <div class="mb-3 flex choices__inner-input" data-contact-div="${sel}">
    <input type="${contact.type == 'phone' ? 'tel' : 'text'}" name="dataContact" data-contact-input="${sel}" class="form-control require combo-select-line" value="${contact.value}" placeholder="Введите данные контакта">
  </div>`;
  const modalBodyOptions = document.querySelector('.local-modal__add-contact-wrapper');
  modalBodyOptions.before(select);
  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.classList.add('input-group-text');
  clearButton.dataset.contactSpan = sel;
  clearButton.innerHTML = `<svg data-tippy-content="Удалить контакт" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"/>
  </svg>`;

  // добавления кнопки удаления записи
  document.querySelector(`[data-contact-div="${sel}"]`).append(clearButton);
  clearButton.addEventListener('click', () => {
    const inputWrap = document.querySelector(`[data-contact-wrap="${sel}"]`);
    inputWrap.remove();
    inputWrapsAll = document.querySelectorAll('[data-contact-wrap]');
    if (inputWrapsAll.length < 1 && document.querySelector('.modal-body-options.more')) {
      document.querySelector('.modal-body-options.more').classList.remove('more');
    }
    else if (inputWrapsAll.length < 10 && !document.querySelector('.local-modal__add-contact')) {
      document.querySelector('.local-modal__add-contact-wrapper').innerHTML = addContactButton;
    }
  });
  tippy('[data-tippy-content]'); // инициализация плагина tippy для новой кнопки
}

// вывод типа контакта для подсказки
function contactType(value) {
  switch (value) {
    case 'phone': return 'Телефон';
    case 'mail': return 'E-mail';
    case 'vk': return 'ВКонтакте';
    case 'fb': return 'Facebook';
    default: return 'Другое';
  }
}

// создание новой формы для модального окна
function createNewModal() {
  const editDataMenu = document.querySelector('#editData');
  editDataMenu.innerHTML = `<div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editDataLabel"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form action="#" class="modal__form" method="POST">
        <div class="modal-body"></div>
        <div class="modal-body-options"></div>
        <div class="modal-footer flex">
          <div class="modal-footer__info"></div>
          <button type="submit" class="btn btn-primary modal-footer__save-button flex"></button>
          <div class="modal-footer__button-wrap"></div>
        </div>
      </form>
    </div>
  </div>`;
}

// блокировка полей ввода при отправке данных
function lockedUserData() {
  const modalContent = document.querySelector('.modal-content');
  const lockedFields = document.createElement('div');
  lockedFields.classList.add('locked');
  modalContent.prepend(lockedFields);
}

// проверка ввода данных клиента
function checkUserData(er) {
  if (er.value.trim().length < 1) {
    er.classList.add('error-data');
    er.addEventListener('input', () => {
      er.classList.remove('error-data');
    });
    return 1;
  }
  else {
    return 0;
  }
}

// модальное окно редактора данных клиента
// typeOfAction: 1 - редактирование; 2 - удаление; 3 - создание контакта
function openEditMenu(el, typeOfAction) {
  createNewModal();
  const bottomBtnWrap = document.querySelector('.modal-footer__button-wrap');
  bottomBtnWrap.textContent = '';
  const header = document.querySelector('#editDataLabel');
  const bottomBtn = document.createElement('button');
  bottomBtn.type = 'button';
  bottomBtnWrap.append(bottomBtn);
  const saveBtn = document.querySelector('.modal-footer__save-button');
  if (typeOfAction === 1) {
    header.innerHTML = `<span class="local-modal__header-title">Изменить данные</span><span class="local-modal__header-id">ID: ${el.id}</span>`;
    bottomBtn.classList.add('modal-footer__btn-bottom');
    bottomBtn.dataset.bsToggle = 'modal';
    bottomBtn.textContent = 'Удалить клиента';
    bottomBtn.addEventListener('click', () => {
      confirmUserDelete(el.id);
    });
    saveBtn.textContent = 'Сохранить';
    saveBtn.addEventListener('click', () => {
      saveBtn.innerHTML = '<div class="clients__save-btn"></div>Сохранить';
    });
    document.location.hash = '#' + el.id; // изменение hash при открытии модального окна
  }
  else {
    header.innerHTML = `<span class="local-modal__header-title">Новый клиент</span>`;
    bottomBtn.classList.add('modal-footer__btn-bottom');
    bottomBtn.dataset.bsDismiss = 'modal';
    if (typeOfAction === 2) {
      saveBtn.textContent = 'Удалить';
    }
    else {
      saveBtn.textContent = 'Сохранить';
      saveBtn.addEventListener('click', () => {
        saveBtn.innerHTML = '<div class="clients__save-btn"></div>Сохранить';
      });
    }
    bottomBtn.textContent = 'Отмена';
  }

  document.querySelector('.modal-body').innerHTML = `<div class="mb-3">
    <label for="modal-edit-surname" class="form-label" data-surname-field="${el.surname ? 1 : 0}">Фамилия*</label>
    <input type="text" class="form-control require user-data" id="modal-edit-surname" name="surname" value="${el.surname}" placeholder="Фамилия*">
  </div>
  <div class="mb-3">
    <label for="modal-edit-name" class="form-label" data-name-field="${el.name ? 1 : 0}">Имя*</label>
    <input type="text" class="form-control require user-data" id="modal-edit-name" name="name" value="${el.name}" placeholder="Имя*">
  </div>
  <div class="mb-3">
    <label for="modal-edit-middle-name" class="form-label" data-lastname-field="${el.lastName ? 1 : 0}">Отчество</label>
    <input type="text" class="form-control user-data" id="modal-edit-middle-name" name="lastname" value="${el.lastName}" placeholder="Отчество">
  </div>`;

  const modalOptions = document.querySelector('.modal-body-options');
  modalOptions.classList.remove('hidden');
  modalOptions.classList.remove('more');
  modalOptions.textContent = '';

  document.querySelectorAll('.form-control.user-data').forEach(inputField => {
    inputField.addEventListener('input', () => {
      const inputLabel = inputField.name + 'Field';
      const label = document.querySelector('[data-' + inputField.name + '-field]');
      if (inputField.value) {
        label.dataset[inputLabel] = '1';
      }
      else{
        label.dataset[inputLabel] = '0';
      }
    });
  });

  // создание кнопки для добавления контакта
  const addNewContact = document.createElement('div');
  addNewContact.classList.add('local-modal__add-contact-wrapper');
  modalOptions.append(addNewContact);
  addNewContact.addEventListener('click', elem => {
    const allInputs = document.querySelectorAll('[data-contact-input]');
    let number = 0;
    allInputs.forEach(inpNumber => {
      if (+inpNumber.dataset.contactInput > number) {
        number = +inpNumber.dataset.contactInput;
      }
    });
    createContactList({type: 'phone', value: ''}, number + 1);
    modalOptions.classList.add('more');
    choicesInitial();
    if (allInputs.length > 8) {
      addNewContact.innerHTML = '';
    }
  });

  // добавление списка контактов клиента
  if (el.contacts.length > 0) {
    modalOptions.classList.add('more');
    el.contacts.forEach(e => {
      createContactList(e, el.contacts.indexOf(e));
     });
  }

  // скрыть кнопку добавления нового контакта, если в карточке 10 контактов
  if (el.contacts.length < 10) {
    addNewContact.innerHTML = addContactButton;
  }
  else {
    addNewContact.innerHTML = '';
  }

  choicesInitial(); // реинициализация плагина Choices

  // сохранение данных о клиенте
  const saveForm = document.querySelector('.modal__form');
  saveForm.addEventListener('submit', e => {
    e.preventDefault();

    document.querySelectorAll('.error-data').forEach(er => {
      console.dir(er);
      er.classList.remove('error-data');
    });

    let errorUserData = 0; // счетчик ошибок ввода данных о клиенте

    // проверка полей ввода данных о клиенте
    saveForm.querySelectorAll('.form-control.require').forEach(er => {
      errorUserData += checkUserData(er);
    });

    if (errorUserData < 1) {
      const contactsPatch = [];
      if (e.target.elements.dataContact) {
        if (e.target.elements.dataContact.length) {
          for (let i = 0; i < e.target.elements.dataContact.length; i++) {
            if (e.target.elements.dataContact[i].value.trim()) {
              contactsPatch.push({
                type: e.target.elements.typeContact[i].value,
                value: e.target.elements.dataContact[i].value
              });
            }
          }
        }
        else {
          if (e.target.elements.dataContact.value.trim()) {
            contactsPatch.push({
              type: e.target.elements.typeContact.value,
              value: e.target.elements.dataContact.value
            });
          }
        }
      }
      if (typeOfAction === 1) {
        // изменение данных о клиенте
        lockedUserData();
        (async () => {
          const response = await fetch(urlSite + '/api/clients/' + el.id, {
            method: 'PATCH',
            body: JSON.stringify ({
              name: e.target.elements.name.value,
              surname: e.target.elements.surname.value,
              lastName: e.target.elements.lastname.value,
              contacts: contactsPatch
            }),
            headers: {
              "Content-Type": "appliation/json"
            }
          });
          loadingStatus(response);
        })();
      }
      else {
        // добавление нового клиента
        lockedUserData();
        (async () => {
          const response = await fetch(urlSite + '/api/clients', {
            method: 'POST',
            body: JSON.stringify ({
              name: e.target.elements.name.value,
              surname: e.target.elements.surname.value,
              lastName: e.target.elements.lastname.value,
              contacts: contactsPatch
            }),
            headers: {
              "Content-Type": "appliation/json"
            }
          });
          loadingStatus(response);
        })();
      }
    }
    else{
      document.querySelector('.clients__save-btn').remove();
      document.querySelector('.modal-footer__info').textContent = 'Проверьте правильность заполнения выделенных полей';
    }
  });

  // открытие модального окна
  editModal.show();
  document.querySelectorAll('.status_loading').forEach(stat => {
    stat.classList.remove('status_loading');
  });
}

// окно подтверждения удаления клиента
function confirmUserDelete(id) {
  createNewModal();
  document.querySelector('#editDataLabel').innerHTML = `<span class="local-modal__header-title center">Удалить&nbsp;клиента</span>`;
  document.querySelector('.modal-body').innerHTML = `<div class="local-modal__delete-confirm">
    Вы действительно хотите удалить данного клиента?
  </div>`;
  document.querySelector('.modal-body-options').classList.add('hidden');
  const confirmBtn = document.querySelector('.modal-footer__save-button');
  confirmBtn.textContent = 'Удалить';
  confirmBtn.type = 'button';
  const bottomBtnWrap = document.querySelector('.modal-footer__button-wrap');
  bottomBtnWrap.innerHTML = '<button type="button" class="modal-footer__btn-bottom" data-bs-dismiss="modal">Отмена</button>';
  confirmBtn.addEventListener('click', () => {
    confirmBtn.innerHTML = '<div class="clients__save-btn"></div>Удалить';
    (async () => {
      const response = await fetch(urlSite + '/api/clients/' + id, {
        method: 'DELETE',
        headers: {
          "Content-Type": "appliation/json"
        }
      });
      loadingStatus(response);
    })();
  });
}

// перезагрузка списка клиентов
function createUserList(users) {

  // очистка списка клиентов
  document.querySelectorAll('.clients__item').forEach(el => {
    el.remove();
  });

  // построение списка клиентов
  let lineNumber = 0;
  users.forEach(el => {
    el.user = el.surname + ' ' + el.name + ' ' + el.lastName;
    el.create = new Date(el.createdAt);
    el.change = new Date(el.updatedAt);
    let userContact = '';
    let userContactLast = '';

    const fieldList = document.querySelector('.simplebar-content');
    const userLine = document.createElement('div');
    userLine.classList.add('clients__item', 'flex');

    let countRec = 0;
    el.contacts.forEach(rec => {
      if (countRec < 4) {
        userContact += `<button data-tippy-content="${contactType(rec.type) + ': ' + rec.value}" class="clients__field-contacts--img img-${rec.type}"></button>`;
      }
      if (countRec === 4) {
        userContactLast = `<button data-tippy-content="${contactType(rec.type) + ': ' + rec.value}" class="clients__field-contacts--img img-${rec.type}"></button>`;
      }
      countRec++;
    });
    if (countRec > 5) {
      userContact += `<button id="line-${lineNumber}" class="clients__field-contacts--num">${countRec - 4 < 10 ? '+' + (countRec - 4) : '&gt;9'}</button>`;
    }
    else {
      userContact += userContactLast;
    }
    userLine.innerHTML = `<div class="clients__field-id">${el.id}</div>
      <div class="clients__field-user">${el.user}</div>
      <div class="clients__field-create">${('0' + el.create.getDate()).slice(-2) + '.' + ('0' + el.create.getMonth()).slice(-2) + '.' + el.create.getFullYear()} <span class="time-view">${('0' + el.create.getHours()).slice(-2) + ':' + ('0' + el.create.getMinutes()).slice(-2)}</span></div>
      <div class="clients__field-change">${('0' + el.change.getDate()).slice(-2) + '.' + ('0' + el.change.getMonth()).slice(-2) + '.' + el.change.getFullYear()} <span class="time-view">${('0' + el.change.getHours()).slice(-2) + ':' + ('0' + el.change.getMinutes()).slice(-2)}</span></div>
      <div data-expand="line-${lineNumber}" class="clients__field-contacts">
        <div data-expand="line-${lineNumber}" class="clients__field-contacts--wrapper flex">
          ${userContact}
        </div>
      </div>
      <div class="clients__field-action flex" data-user-id="${el.id}"><button class="clients__field-action-btn edit flex" data-bs-target="#editData"><div class="clients_image-action-btn edit"></div>Изменить</button><button class="clients__field-action-btn delete flex" data-bs-toggle="modal" data-bs-target="#editData"><div class="clients_image-action-btn delete"></div>Удалить</button></div>`;
    fieldList.prepend(userLine);
    if (countRec > 5) {
      document.querySelector('#line-' + lineNumber).addEventListener('click', exp => {
        expandContacts(exp.target.id, el.contacts);
      });
    }
    const actionButtons = document.querySelector(`[data-user-id="${el.id}"]`);
    actionButtons.querySelector('.clients__field-action-btn.edit').addEventListener('click', elem => {
      elem.target.classList.add('status_loading');
      (async () => {
        const response = await fetch(urlSite + '/api/clients/' + el.id);
        const userData = await response.json();
        openEditMenu(userData, 1);
      })();
    });
    actionButtons.querySelector('.clients__field-action-btn.delete').addEventListener('click', () => {
      confirmUserDelete(el.id);
    });
    lineNumber++;

  });
  tippy('[data-tippy-content]'); // реинициализация плагина tippy
}

// развернуть список контактов клиента
function expandContacts(expand, contacts) {
  document.querySelector(`.clients__field-contacts--wrapper[data-expand="${expand}"]`).remove();
  let contactsLine = '';
  let contactsGroup = '';
  let countRec = 0;
  contacts.forEach(rec => {
    if (countRec < 5) {
      contactsLine += `<button data-tippy-content="${contactType(rec.type) + ': ' + rec.value}" class="clients__field-contacts--img img-${rec.type}"></button>`;
      countRec++;
      if (countRec === 5) {
        countRec = 0;
        contactsGroup += `<div data-expand="line-${expand}" class="clients__field-contacts--wrapper">${contactsLine}</div>`;
        contactsLine = '';
      }
    }
  });
  if (contactsLine !== '') {
    contactsGroup += `<div data-expand="line-${expand}" class="clients__field-contacts--wrapper">${contactsLine}</div>`;
  }
  const fieldContacts = document.querySelector(`.clients__field-contacts[data-expand="${expand}"]`);
  fieldContacts.innerHTML = contactsGroup;
  tippy('[data-tippy-content]'); // реинициализация плагина tippy для развернутого списка
}

document.addEventListener('DOMContentLoaded', () => {
  (async () => {
    getUserList();

    // обработчик события клика по кнопке добавления нового клиента
    const addNewClient = document.querySelector('#add-new-client');
    addNewClient.addEventListener('click', () => {
      const userData = {
        name: '',
        surname: '',
        lastName: '',
        contacts: []
      };
      openEditMenu(userData, 3);
    });
  })();

  // обработчик события ввода в поисковой строке (фильтр) по таймауту
  const searchField = document.querySelector('.main-menu__search');
  let timer;
  searchField.addEventListener('input', userText => {
    clearTimeout(timer);
    timer = setTimeout(searchUser, 300, userText.target.value);
  });

  // инициализация модальных окон
  var myModal = new bootstrap.Modal(document.getElementById('editData'), {
    keyboard: false
  });

  // сброс hash в url после закрытия модального окна
  document.querySelector('#editData').addEventListener('hide.bs.modal', () => {
    history.pushState('', document.title, window.location.pathname);
  });
});
