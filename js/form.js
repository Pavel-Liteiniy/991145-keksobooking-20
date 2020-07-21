'use strict';

(function () {
  var KEY_ESCAPE = 'Escape';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var AVATAR_PLUG_FILE = 'img/muffin-grey.svg';

  var RequestPopupType = {
    SUCCESS: 'success',
    ERROR: 'error',
  };

  var offerType = {
    ru: {
      'flat': 'Квартира',
      'bungalo': 'Бунгало',
      'house': 'Дом',
      'palace': 'Дворец',
    },
    minPrice: {
      'flat': 1000,
      'bungalo': 0,
      'house': 5000,
      'palace': 10000,
    },
  };

  var RoomsCapacity = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0'],
  };

  var main = document.querySelector('main');
  var bid = main.querySelector('.ad-form');
  var bidResetButton = bid.querySelector('.ad-form__reset');
  var advertAdressField = bid.querySelector('#address');
  var selectRoomNumber = bid.querySelector('#room_number');
  var selectCapacity = bid.querySelector('#capacity');
  var popup = document.getElementsByClassName(RequestPopupType.SUCCESS);

  var avatarFile = bid.querySelector('#avatar');
  var avatarPreview = bid.querySelector('.ad-form-header__preview img');
  var advertFile = bid.querySelector('#images');
  var advertPreviewWrapper = bid.querySelector('.ad-form__photo');

  var advertTypeSelect = bid.querySelector('#type');
  var advertPriceInput = bid.querySelector('#price');
  var timeInSelect = bid.querySelector('#timein');
  var timeOutSelect = bid.querySelector('#timeout');

  var inactivateMap = function () {

    window.map.toggleEditable(window.map.bidItems, true);
    window.map.toggleEditable(window.map.filterItems, true);

    bid.classList.add('ad-form--disabled');
    window.map.element.classList.add('map--faded');

    bid.reset();
    window.map.filters.reset();

    onSelectRoomNumberChangeClick();

    advertTypeSelect.value = advertTypeSelect.options[1].value;
    onAdvertTypeSelectChange();

    window.map.removePins();

    var popupError = window.map.element.querySelector('.map__popup--error');
    if (popupError !== null) {
      popupError.remove();
    }

    window.card.close();

    window.map.mainPin.style.left = window.map.MainPin.START_X + 'px';
    window.map.mainPin.style.top = window.map.MainPin.START_Y + 'px';

    advertAdressField.value = window.map.calculatePinLocation();

    avatarPreview.src = AVATAR_PLUG_FILE;
    removeAdPreviewImage();

    window.map.filters.removeEventListener('change', window.map.onFiltersChange);
    window.map.mainPin.addEventListener('keydown', window.map.onMainPinEnterPress);

    window.map.mainPin.focus();
  };

  var onSelectRoomNumberChangeClick = function () {
    if (selectCapacity.options.length > 0) {
      Array.from(selectCapacity.options).forEach(function (item) {
        var value = RoomsCapacity[selectRoomNumber.value];
        var isHidden = !(value.indexOf(item.value) >= 0);

        item.hidden = isHidden;
        item.disabled = isHidden;
        item.selected = value[0] === item.value;
      });
    }
  };

  var renderRequestPopup = function (popUpType) {
    var content = document.querySelector('#' + popUpType).content;
    var requestPopup = content.cloneNode(true);

    var onEscPress = function (evt) {
      evt.preventDefault();

      if (evt.key === KEY_ESCAPE) {
        main.querySelector('.' + popUpType).remove();

        document.removeEventListener('keydown', onEscPress);
        document.removeEventListener('click', onDocumentClick);
      }
    };

    var onDocumentClick = function (evt) {
      evt.preventDefault();

      main.querySelector('.' + popUpType).remove();

      document.removeEventListener('keydown', onEscPress);
      document.removeEventListener('click', onDocumentClick);
    };

    document.addEventListener('keydown', onEscPress);
    document.addEventListener('click', onDocumentClick);

    main.appendChild(requestPopup);
  };

  var onSuccess = function () {
    renderRequestPopup(RequestPopupType.SUCCESS);

    inactivateMap();
  };

  var onError = function () {
    renderRequestPopup(RequestPopupType.ERROR);
  };

  window.map.toggleEditable(window.map.bidItems, true);

  bid.classList.add('ad-form--disabled');

  advertAdressField.readOnly = true;
  advertAdressField.value = window.map.calculatePinLocation();

  selectRoomNumber.addEventListener('change', onSelectRoomNumberChangeClick);

  onSelectRoomNumberChangeClick();

  var onAdvertTypeSelectChange = function () {
    advertPriceInput.min = offerType.minPrice[advertTypeSelect.value];
    advertPriceInput.placeholder = offerType.minPrice[advertTypeSelect.value];
  };

  advertTypeSelect.addEventListener('change', onAdvertTypeSelectChange);

  var changeTimeSelect = function (timeSelect, evt) {
    Array.from(timeSelect.options).forEach(function (option) {
      option.selected = evt.currentTarget.value === option.value;
    });
  };

  timeInSelect.addEventListener('change', function (evt) {
    changeTimeSelect(timeOutSelect, evt);
  });

  timeOutSelect.addEventListener('change', function (evt) {
    changeTimeSelect(timeInSelect, evt);
  });

  bid.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.save(onSuccess, onError, new FormData(bid));
  });

  bidResetButton.addEventListener('click', function (evt) {
    evt.preventDefault();

    inactivateMap();
  });

  avatarFile.addEventListener('change', function () {
    var file = avatarFile.files[0];
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
  });

  var removeAdPreviewImage = function () {
    var adPreviewImage = bid.querySelector('.ad-form__photo img');
    if (adPreviewImage !== null) {
      adPreviewImage.remove();
    }
  };

  var createAdPreviewImage = function () {
    removeAdPreviewImage();
    var adImage = document.createElement('img');

    adImage.alt = 'Превью фото жилья';
    adImage.style.maxWidth = advertPreviewWrapper.offsetWidth + 'px';
    adImage.style.maxHeight = advertPreviewWrapper.offsetHeight + 'px';
    advertPreviewWrapper.appendChild(adImage);

    return bid.querySelector('.ad-form__photo img');
  };

  advertFile.addEventListener('change', function () {
    var file = advertFile.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {

        var adPreview = createAdPreviewImage();
        adPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  window.form = {
    offerType: offerType,
    bid: bid,
    advertAdressField: advertAdressField,
    main: main,
    popup: popup
  };
})();
