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

  var MainPinSize = {
    BIG_WIDTH: 65,
    BIG_HEIGHT: 65,
    SMALL_WIDTH: 65,
    SMALL_HEIGHT: 84,

    getBigLocation: function () {
      return {
        x: this.BIG_WIDTH / 2,
        y: this.BIG_HEIGHT / 2,
      };
    },

    getSmallLocation: function () {
      return {
        x: this.SMALL_WIDTH / 2,
        y: this.SMALL_HEIGHT,
      };
    },
  };

  var RoomsCapacity = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0'],
  };

  var bidElements = document.querySelectorAll('fieldset, select');

  var bid = document.querySelector('.ad-form');
  var mainPin = document.querySelector('.map__pin--main');
  var advertAdressField = bid.querySelector('#address');
  var selectRoomNumber = bid.querySelector('#room_number');
  var selectCapacity = bid.querySelector('#capacity');

  var calculatePinLocation = function (pinSize, pinElement, isDisable) {
    var leftGap = Number(pinElement.style.left.slice(0, -2));
    var topGap = Number(pinElement.style.top.slice(0, -2));

    return isDisable
      ? Math.round(pinSize.getBigLocation().x + leftGap) + ', ' + Math.round(pinSize.getBigLocation().y + topGap)
      : Math.round(pinSize.getSmallLocation().x + leftGap) + ', ' + Math.round(pinSize.getSmallLocation().y + topGap);
  };

  var toggleFormEditable = function (formItems, isDisable) {
    for (var i = 0; i < formItems.length; i++) {
      formItems[i].disabled = isDisable;
    }
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

  toggleFormEditable(bidElements, true);

  bid.classList.add('ad-form--disabled');

  advertAdressField.readOnly = true;
  advertAdressField.value = calculatePinLocation(MainPinSize, mainPin, true);

  selectRoomNumber.addEventListener('change', onSelectRoomNumberChangeClick);

  onSelectRoomNumberChangeClick();

  var advertTypeSelect = bid.querySelector('#type');
  var advertPriceInput = bid.querySelector('#price');

  advertTypeSelect.addEventListener('change', function () {
    advertPriceInput.min = offerType.minPrice[advertTypeSelect.value];
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
    toggleEditable: function (formItems, isDisable) {
      for (var i = 0; i < formItems.length; i++) {
        formItems[i].disabled = isDisable;
      }
    },
    calculatePinLocation: function (pinSize, pinElement, isDisable) {
      var leftGap = Number(pinElement.style.left.slice(0, -2));
      var topGap = Number(pinElement.style.top.slice(0, -2));

      return isDisable
        ? Math.round(pinSize.getBigLocation().x + leftGap) + ', ' + Math.round(pinSize.getBigLocation().y + topGap)
        : Math.round(pinSize.getSmallLocation().x + leftGap) + ', ' + Math.round(pinSize.getSmallLocation().y + topGap);
    },

    offerType: offerType,
    MainPinSize: MainPinSize,
    bid: bid,
    bidElements: bidElements,
    mainPin: mainPin,
    advertAdressField: advertAdressField,
    mainPinSize: MainPinSize,
  };
})();
