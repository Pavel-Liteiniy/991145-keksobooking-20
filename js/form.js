'use strict';

(function () {
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

  var bid = document.querySelector('.ad-form');
  var advertAdressField = bid.querySelector('#address');
  var selectRoomNumber = bid.querySelector('#room_number');
  var selectCapacity = bid.querySelector('#capacity');

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

  window.map.toggleEditable(window.map.bidElements, true);

  bid.classList.add('ad-form--disabled');

  advertAdressField.readOnly = true;
  advertAdressField.value = window.map.calculatePinLocation();

  selectRoomNumber.addEventListener('change', onSelectRoomNumberChangeClick);

  onSelectRoomNumberChangeClick();

  var advertTypeSelect = bid.querySelector('#type');
  var advertPriceInput = bid.querySelector('#price');

  advertTypeSelect.addEventListener('change', function () {
    advertPriceInput.min = offerType.minPrice[advertTypeSelect.value];
    advertPriceInput.placeholder = offerType.minPrice[advertTypeSelect.value];
  });

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

  window.form = {
    offerType: offerType,
    bid: bid,
    advertAdressField: advertAdressField,
  };
})();
