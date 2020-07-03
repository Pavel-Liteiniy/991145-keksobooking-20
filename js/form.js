'use strict';

(function () {
  var KEY_ESCAPE = 'Escape';

  var RequestPopupTypes = {
    SUCCESS: 'success',
    ERROR: 'error',
  };

  var offerType = {
    ru: {
      flat: 'Квартира',
      bungalo: 'Бунгало',
      house: 'Дом',
      palace: 'Дворец',
    },
    minPrice: {
      flat: 1000,
      bungalo: 0,
      house: 5000,
      palace: 10000,
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

  var inactivateMap = function () {

    window.map.toggleEditable(window.map.bidElements, true);

    bid.classList.add('ad-form--disabled');
    window.map.element.classList.add('map--faded');

    bid.reset();
    window.map.filters.reset();

    onSelectRoomNumberChangeClick();

    advertTypeSelect.value = advertTypeSelect.options[1].value;
    onAdvertTypeSelectChange();

    window.map.element.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (item) {
      item.remove();
    });

    window.card.close();

    window.map.mainPin.style.left = window.map.MainPin.START_X + 'px';
    window.map.mainPin.style.top = window.map.MainPin.START_Y + 'px';

    advertAdressField.value = window.map.calculatePinLocation();

    window.map.mainPin.addEventListener('keydown', window.map.onMainPinEnterPress);
  };

  var onSelectRoomNumberChangeClick = function () {
    if (selectCapacity.options.length > 0) {
      [].forEach.call(selectCapacity.options, function (item) {
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
    renderRequestPopup(RequestPopupTypes.SUCCESS);

    inactivateMap();
  };

  var onError = function () {
    renderRequestPopup(RequestPopupTypes.ERROR);
  };

  window.map.toggleEditable(window.map.bidElements, true);

  bid.classList.add('ad-form--disabled');

  advertAdressField.readOnly = true;
  advertAdressField.value = window.map.calculatePinLocation();

  selectRoomNumber.addEventListener('change', onSelectRoomNumberChangeClick);

  onSelectRoomNumberChangeClick();

  var advertTypeSelect = bid.querySelector('#type');
  var advertPriceInput = bid.querySelector('#price');

  var onAdvertTypeSelectChange = function () {
    advertPriceInput.min = offerType.minPrice[advertTypeSelect.value];
    advertPriceInput.placeholder = offerType.minPrice[advertTypeSelect.value];
  };

  advertTypeSelect.addEventListener('change', onAdvertTypeSelectChange);

  var timeInSelect = bid.querySelector('#timein');
  var timeOutSelect = bid.querySelector('#timeout');

  var changeTimeSelect = function (timeSelect, evt) {
    [].forEach.call(timeSelect.options, function (option) {
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

  window.form = {
    offerType: offerType,
    bid: bid,
    advertAdressField: advertAdressField,
  };
})();
