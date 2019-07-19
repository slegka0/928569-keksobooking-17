'use strict';

(function () {
  var LEFT_CENTER = 570;
  var TOP_CENTER = 375;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var adForm = document.querySelector('.ad-form');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var houseType = document.querySelector('#type');
  var priceForNight = document.querySelector('#price');
  var addressInput = adForm.querySelector('#address');
  var roomNumber = document.querySelector('#room_number');
  var houseCapacity = document.querySelector('#capacity');
  var adFormInputs = Array.from(adForm.querySelectorAll('input'));
  var adFormSelects = Array.from(adForm.querySelectorAll('select'));
  var adFormButtons = Array.from(adForm.querySelectorAll('button'));
  var adFormTextareas = Array.from(adForm.querySelectorAll('textarea'));
  var adFormLabels = Array.from(adForm.querySelectorAll('label'));
  var adFormFields = adFormInputs.concat(adFormSelects, adFormButtons, adFormTextareas, adFormLabels);
  var main = document.querySelector('main');
  var avatarInput = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var imagesInput = document.querySelector('#images');
  var imagesPreview = document.querySelector('.ad-form__photo');
  var photoContainer = document.querySelector('.ad-form__photo-container');
  var minPrices = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var numberOfRooms = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  /**
   * Задает предварительные настройки
   */
  var setup = function () {
    toggleActiveMode(adFormFields, true);
    toggleActiveMode(window.filter.allFilters, true);
    findPinCoordinates('circle');
  };

  /**
   * Создает <img> и добавляет его в форму "Фотографии жилья"
   * @param {string} address Значение атрибута src для картинки
   */
  var createImg = function (address) {
    var image = document.createElement('img');
    image.style.width = imagesPreview.offsetWidth + 'px';
    image.style.height = imagesPreview.offsetHeight + 'px';
    image.src = address;
    if (document.querySelector('.ad-form__photo > img')) {
      var div = imagesPreview.cloneNode(false);
      photoContainer.appendChild(div);
      div.appendChild(image);
    } else {
      imagesPreview.appendChild(image);
    }
  };

  /**
   * Отрисовывает загруженные фотографии жилья
   * @param {Object} evt Стандартый объект события (event)
   */
  var onImagesChange = function (evt) {
    var files = evt.target.files;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (file.type.match('image')) {
        var picReader = new FileReader();
        picReader.addEventListener('load', function (loadEvt) {
          var picFile = loadEvt.target;
          createImg(picFile.result);
        });
        picReader.readAsDataURL(file);
      }
    }
  };

  /**
   * Отрисовывает загруженную картинку аватара
   */
  var onAvatarChange = function () {
    var file = avatarInput.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  };

  /**
   * Находит текущие координаты метки и заполняет их значениями поле адреса
   * @param {string} mode Указывает на форму метки. Метка может быть круглой (в самом начале) или с острым концом снизу (shapeless)
   */
  var findPinCoordinates = function (mode) {
    var mainPinX = window.pin.mainPin.style.left;
    var mainPinY = window.pin.mainPin.style.top;
    mainPinX = window.util.cutTwoLastSymbols(mainPinX) + window.pin.MAIN_PIN_WIDTH / 2;
    mainPinY = window.util.cutTwoLastSymbols(mainPinY) + window.pin.MAIN_PIN_HEIGHT / 2;
    if (mode === 'shapeless') {
      mainPinY = mainPinY + window.pin.MAIN_PIN_HEIGHT / 2 + window.pin.MAIN_PIN_ARROW;
    }
    addressInput.value = mainPinX + ', ' + mainPinY;
  };

  /**
   * Переводит поля формы в указанное состояние (активное или неактивное)
   * @param {Array<HTMLButtonElement|HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} formElements Массив, содержащий поля формы
   * @param {boolean} disabled Текущее состояние (активное или неактивное)
   */
  var toggleActiveMode = function (formElements, disabled) {
    for (var i = 0; i < formElements.length; i++) {
      formElements[i].disabled = disabled;
      if (disabled) {
        formElements[i].classList.add('no-active');
      } else {
        formElements[i].classList.remove('no-active');
      }
    }
  };

  /**
   * Меняет время заезда в ответ на изменение времени выезда и наоборот
   * @param {Object} evt Стандартый объект события (event)
   */
  var onTimeChange = function (evt) {
    if (evt.currentTarget === timeIn) {
      timeOut.value = evt.currentTarget.value;
    } else {
      timeIn.value = evt.currentTarget.value;
    }
  };

  /**
   * Меняет плейсхолдер и минимальное значение поля с ценой за ночь в ответ на изменение поля тип жилья
   * @param {Object} evt Стандартый объект события (event)
   */
  var onHouseTypeChange = function (evt) {
    priceForNight.placeholder = minPrices[evt.currentTarget.value];
    priceForNight.min = minPrices[evt.currentTarget.value];
  };

  /**
   * Генерит ошибку в зависимости от выбранного количества комнат и гостей
   * @param {HTMLSelectElement} room Хранит в себе данные о выбранном количестве комнат
   * @param {HTMLSelectElement} capacity Хранит в себе данные о выбранном количестве гостей
   * @return {string}
   */
  var getCapacityError = function (room, capacity) {
    var result = '';
    if (Number(room.value) < Number(capacity.value)) {
      result = 'Количество комнат меньше, чем количество гостей :(';
    } else {
      if (room.value === '100' || capacity.value === '0') {
        result = 'Выберите 100 комнат не для гостей';
      }
    }
    return result;
  };

  /**
   * Проверяет соответствие количества комнат количеству гостей
   */
  var onRoomOrCapacityChange = function () {
    if (numberOfRooms[roomNumber.value].indexOf(parseInt(houseCapacity.value, 10)) === -1) {
      roomNumber.setCustomValidity(getCapacityError(roomNumber, houseCapacity));
    } else {
      roomNumber.setCustomValidity('');
    }
  };

  /**
   * Очищает поле формы "Фотографии жилья" от всех фотографий
   */
  var cleanPhotos = function () {
    var photos = Array.from(photoContainer.querySelectorAll('.ad-form__photo'));
    var lastPhoto = photoContainer.querySelector('.ad-form__photo > img');
    var indexOfLastPhoto = photos.length - 1;
    photos.reverse();
    for (var i = 0; i < indexOfLastPhoto; i++) {
      photoContainer.removeChild(photos[i]);
    }
    photos[indexOfLastPhoto].removeChild(lastPhoto);
  };

  /**
   * Переводит страницу в неактивное состояние
   */
  var deactivatePage = function () {
    window.firstStart = true;
    window.ifMouseMoved = false;
    window.pinMode = 'round';
    window.card.deleteCurrentCard();
    window.filter.cleanMap();
    window.pin.mainPin.style.left = LEFT_CENTER + 'px';
    window.pin.mainPin.style.top = TOP_CENTER + 'px';
    window.pin.map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    window.pin.mapFilter.classList.add('map__filters--disabled');
    avatarPreview.src = 'img/muffin-grey.svg';
    cleanPhotos();
    adForm.reset();
    for (var i = 0; i < window.filter.allFilters.length; i++) {
      window.filter.allFilters[i].removeEventListener('change', window.filter.onFilterValueChange);
    }
    [roomNumber, houseCapacity].forEach(function (select) {
      select.removeEventListener('change', onRoomOrCapacityChange);
    });
    houseType.removeEventListener('change', onHouseTypeChange);
    timeOut.removeEventListener('change', onTimeChange);
    timeIn.removeEventListener('change', onTimeChange);
    adForm.removeEventListener('submit', onSubmitForm);
    resetButton.removeEventListener('click', onResetClick);
    avatarInput.removeEventListener('change', onAvatarChange);
    imagesInput.removeEventListener('change', onImagesChange);
    setup();
  };

  /**
   * Срабатывает по нажатию на кнопку 'Очистить'
   * @param {Object} evt Стандартый объект события (event)
   */
  var onResetClick = function (evt) {
    evt.preventDefault();
    deactivatePage();
  };

  /**
   * Показывает окно успешной отправки данных на сервер
   */
  var onSuccessUpload = function () {
    deactivatePage();
    var templateSuccess = document.querySelector('#success').content;
    var successMessage = templateSuccess.cloneNode(true);
    var fragment = document.createDocumentFragment();
    fragment.appendChild(successMessage);
    main.appendChild(fragment);
    document.addEventListener('keydown', onEscPush);
    document.addEventListener('click', onAreaClick);
  };

  /**
   * Удаляет окно сообщения
   */
  var removeMessage = function () {
    var currentMessage = main.querySelectorAll(':scope > div');
    main.removeChild(currentMessage[currentMessage.length - 1]);
    document.removeEventListener('keydown', onEscPush);
    document.removeEventListener('click', onAreaClick);
  };

  /**
   * Удаляет окно ошибки/успеха (отправки/получения данных) при нажатии на ESC
   * @param {Object} evt Стандартый объект события (event)
   */
  var onEscPush = function (evt) {
    if (evt.keyCode === window.card.ESC_CODE) {
      removeMessage();
    }
  };

  /**
   * Удаляет окно ошибки/успеха (отправки/получения данных) при клике
   * @param {Object} evt Стандартый объект события (event)
   */
  var onAreaClick = function (evt) {
    if (evt.type === 'click') {
      removeMessage();
    }
  };

  /**
   * Показывает сообщение ошибки, если отправка данных на сервер не удалась
   */
  var onErrorUpload = function () {
    var templateError = document.querySelector('#error').content;
    var errorMessage = templateError.cloneNode(true);
    var fragment = document.createDocumentFragment();
    fragment.appendChild(errorMessage);
    main.appendChild(fragment);
    document.addEventListener('keydown', onEscPush);
    document.addEventListener('click', onAreaClick);
  };

  /**
   * Отменяет действия формы по умолчанию и отправляет её данные на сервер с помощью XHR
   * @param {Object} evt Стандартый объект события (event)
   */
  var onSubmitForm = function (evt) {
    evt.preventDefault();
    var formData = new FormData(adForm);
    window.load.load(onSuccessUpload, onErrorUpload, formData);
  };

  window.form = {
    'findPinCoordinates': findPinCoordinates,
    'toggleActiveMode': toggleActiveMode,
    'adFormFields': adFormFields,
    'roomNumber': roomNumber,
    'houseCapacity': houseCapacity,
    'houseType': houseType,
    'timeOut': timeOut,
    'timeIn': timeIn,
    'adForm': adForm,
    'resetButton': resetButton,
    'onRoomOrCapacityChange': onRoomOrCapacityChange,
    'onHouseTypeChange': onHouseTypeChange,
    'onTimeChange': onTimeChange,
    'onSubmitForm': onSubmitForm,
    'onResetClick': onResetClick,
    'onEscPush': onEscPush,
    'onAreaClick': onAreaClick,
    'deactivatePage': deactivatePage,
    'avatarInput': avatarInput,
    'onAvatarChange': onAvatarChange,
    'imagesInput': imagesInput,
    'onImagesChange': onImagesChange
  };
  setup();
})();
