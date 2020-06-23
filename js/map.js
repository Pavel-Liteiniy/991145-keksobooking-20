'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var KEY_ENTER = 'Enter';
  var MOUSE_BUTTON_LEFT = 0;

  var pinTemplate = document.querySelector('#pin').content;
  var pinList = document.querySelector('.map__pins');

  var createPin = function (advert) {
    var pin = pinTemplate.cloneNode(true);
    var pinButton = pin.querySelector('.map__pin');
    var pinAvatar = pin.querySelector('img');

    pinButton.style.left = advert.location.x - PIN_WIDTH / 2 + 'px';
    pinButton.style.top = advert.location.y - PIN_HEIGHT + 'px';
    pinAvatar.src = advert.author.avatar;
    pinAvatar.alt = advert.offer.title;

    return pin;
  };

  var renderPins = function (parentElement, ads) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < ads.length; i++) {
      fragment.appendChild(createPin(ads[i]));
    }

    parentElement.appendChild(fragment);
  };

  var isNotAvailableMap = true;

  var onMainPinClick = function (evt) {
    evt.preventDefault();

    if (isNotAvailableMap) {
      activateMap(evt);
      isNotAvailableMap = false;
    }

    if (evt.button === MOUSE_BUTTON_LEFT) {
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY,
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();
        moveEvt.currentTarget.style.zIndex = 2;

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY,
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY,
        };

        if (window.form.mainPin.offsetLeft - shift.x < 1 - window.form.mainPinSize.getSmallLocation().x) {
          window.form.mainPin.style.left = 1 - window.form.mainPinSize.getSmallLocation().x + 'px';
        } else if (window.form.mainPin.offsetLeft - shift.x > window.adverts.mapWidth - 1 - window.form.mainPinSize.getSmallLocation().x) {
          window.form.mainPin.style.left = window.adverts.mapWidth - 1 - window.form.mainPinSize.getSmallLocation().x + 'px';
        } else {
          window.form.mainPin.style.left = window.form.mainPin.offsetLeft - shift.x + 'px';
        }

        if (window.form.mainPin.offsetTop - shift.y < window.adverts.LOCATION_TOP - window.form.mainPinSize.getSmallLocation().y) {
          window.form.mainPin.style.top = window.adverts.LOCATION_TOP - window.form.mainPinSize.getSmallLocation().y + 'px';
        } else if (window.form.mainPin.offsetTop - shift.y > window.adverts.LOCATION_BOTTOM - window.form.mainPinSize.getSmallLocation().y) {
          window.form.mainPin.style.top = window.adverts.LOCATION_BOTTOM - window.form.mainPinSize.getSmallLocation().y + 'px';
        } else {
          window.form.mainPin.style.top = window.form.mainPin.offsetTop - shift.y + 'px';
        }

        window.form.advertAdressField.value = window.form.calculatePinLocation(window.form.MainPinSize, window.form.mainPin, false);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        window.form.mainPin.removeEventListener('mousemove', onMouseMove);
        window.form.mainPin.removeEventListener('mouseup', onMouseUp);
      };

      window.form.mainPin.addEventListener('mousemove', onMouseMove);
      window.form.mainPin.addEventListener('mouseup', onMouseUp);
    }
  };

  var onMainPinEnterPress = function (evt) {
    evt.preventDefault();
    activateMap(evt);
    isNotAvailableMap = false;
  };

  var activateMap = function (evt) {
    if (evt.button === MOUSE_BUTTON_LEFT || evt.key === KEY_ENTER) {
      window.card.map.classList.remove('map--faded');
      renderPins(pinList, window.adverts.arr);

      var anotherPins = pinList.querySelectorAll('.map__pin:not(.map__pin--main)');

      for (var i = 0; i < anotherPins.length; i++) {
        window.card.open(anotherPins[i], window.adverts.arr[i]);
      }

      window.form.bid.classList.remove('ad-form--disabled');

      window.form.toggleEditable(window.form.bidElements, false);

      window.form.advertAdressField.value = window.form.calculatePinLocation(window.form.MainPinSize, window.form.mainPin, false);

      window.form.mainPin.removeEventListener('keydown', onMainPinEnterPress);
    }
  };

  window.form.toggleEditable(window.form.bidElements, true);

  window.form.bid.classList.add('ad-form--disabled');

  window.form.mainPin.addEventListener('mousedown', onMainPinClick);

  window.form.mainPin.addEventListener('keydown', onMainPinEnterPress);
})();
