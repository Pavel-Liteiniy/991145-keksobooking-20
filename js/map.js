'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var KEY_ENTER = 'Enter';
  var MOUSE_BUTTON_LEFT = 0;

  var LOCATION_TOP = 130;
  var LOCATION_BOTTOM = 630;

  var MIN_COUNT = 5;

  var offers = [];
  var checkResponseSuccess = false;

  var onError = function () {
    var popup = document.createElement('div');
    popup.style.padding = '15px';
    popup.style.borderRadius = '20px';
    popup.style.position = 'absolute';
    popup.style.top = '55%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.boxShadow = '2px 2px 10px #555555';
    popup.style.fontSize = '16px';
    popup.style.textAlign = 'center';
    popup.classList.add('map__popup--error');

    var title = document.createElement('p');
    title.style.fontWeight = 'bold';
    title.textContent = 'Упс, что-то пошло не так...';

    var description = document.createElement('p');
    description.textContent = 'Не удалось отобразить на карте объявления других пользователей';

    popup.appendChild(title);
    popup.appendChild(description);
    map.appendChild(popup);
  };

  var MainPin = {
    START_X: 570,
    START_Y: 375,
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

  var map = document.querySelector('.map');
  var filtersContainer = map.querySelector('.map__filters-container');
  var filters = filtersContainer.querySelector('.map__filters');
  var filterElements = filters.querySelectorAll('fieldset, select');
  var mainPin = map.querySelector('.map__pin--main');
  var pinTemplate = document.querySelector('#pin').content;
  var pinList = map.querySelector('.map__pins');
  var mapWidth = pinList.offsetWidth;

  var bidElements = document.querySelectorAll('.ad-form fieldset, .ad-form select');

  var calculatePinLocation = function () {
    var leftGap = Number(mainPin.style.left.slice(0, -2));
    var topGap = Number(mainPin.style.top.slice(0, -2));

    return checkMapState()
      ? Math.round(MainPin.getBigLocation().x + leftGap) + ', ' + Math.round(MainPin.getBigLocation().y + topGap)
      : Math.round(MainPin.getSmallLocation().x + leftGap) + ', ' + Math.round(MainPin.getSmallLocation().y + topGap);
  };

  var removePins = function () {
    [].forEach.call(map.querySelectorAll('.map__pin:not(.map__pin--main)'), function (item) {
      item.remove();
    });
  };

  var removePopup = function () {
    var popup = map.querySelector('.popup');

    if (popup !== null) {
      popup.remove();
    }

    var pins = pinList.querySelectorAll('.map__pin:not(.map__pin--main)');
    var activePin = [].find.call(pins, function (item) {
      return item.classList.contains('map__pin--active');
    });

    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  var createPin = function (advert) {
    var pin = pinTemplate.cloneNode(true);
    var pinButton = pin.querySelector('.map__pin');
    var pinAvatar = pin.querySelector('img');

    pinButton.style.left = advert.location.x - PIN_WIDTH / 2 + 'px';
    pinButton.style.top = advert.location.y - PIN_HEIGHT + 'px';
    pinAvatar.src = advert.author.avatar;
    pinAvatar.alt = advert.offer.title;

    pinButton.addEventListener('click', function (evt) {
      evt.preventDefault();

      removePopup();
      map.insertBefore(window.card.render(advert), filtersContainer);

      pinButton.classList.add('map__pin--active');
    });

    return pin;
  };

  var toggleEditable = function (formItems, isDisable) {

    [].forEach.call(formItems, function (formItem) {
      formItem.disabled = isDisable;
    });
  };

  var renderPins = function (parentElement, ads) {
    var fragment = document.createDocumentFragment();

    ads.forEach(function (ad) {
      fragment.appendChild(createPin(ad));
    });

    parentElement.appendChild(fragment);
  };

  var checkMapState = function () {
    return map.classList.contains('map--faded');
  };

  var setMainPinPosition = function (shiftX, shiftY) {
    var x = shiftX;
    var pinPositionX = mainPin.offsetLeft - shiftX;
    var leftOffset = 1 - MainPin.getSmallLocation().x;
    var rightOffset = mapWidth - 1 - MainPin.getSmallLocation().x;

    if (pinPositionX < leftOffset) {
      x = leftOffset;
    } else if (pinPositionX > rightOffset) {
      x = rightOffset;
    } else {
      x = pinPositionX;
    }

    var y = shiftY;
    var pinPositionY = mainPin.offsetTop - shiftY;
    var topOffset = LOCATION_TOP - MainPin.getSmallLocation().y;
    var bottomOffset = LOCATION_BOTTOM - MainPin.getSmallLocation().y;

    if (pinPositionY < topOffset) {
      y = topOffset;
    } else if (pinPositionY > bottomOffset) {
      y = bottomOffset;
    } else {
      y = pinPositionY;
    }

    mainPin.style.left = x + 'px';
    mainPin.style.top = y + 'px';
  };

  var onMainPinClick = function (evt) {
    evt.preventDefault();

    if (checkMapState()) {
      activateMap(evt);
    }

    if (evt.button === MOUSE_BUTTON_LEFT) {
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY,
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY,
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY,
        };

        setMainPinPosition(shift.x, shift.y);

        window.form.advertAdressField.value = calculatePinLocation(MainPin, mainPin, false);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  };

  var onMainPinEnterPress = function (evt) {
    evt.preventDefault();
    activateMap(evt);
  };

  var onSuccess = function (adverts) {
    checkResponseSuccess = true;
    offers = adverts.slice().filter(function (advert) {
      return advert.hasOwnProperty('offer');
    });
    renderPins(pinList, offers.slice(0, MIN_COUNT));
    toggleEditable(filterElements, false);
    filters.addEventListener('change', onFiltersChange);
  };

  var onFiltersChange = function (evt) {
    evt.preventDefault();

    var filtredOffers = offers.filter(function (offer) {
      if (evt.target.value === 'any') {
        return true;
      } else {
        return offer.offer.type === evt.target.value;
      }
    });

    window.card.close();
    removePins();
    renderPins(pinList, filtredOffers.slice(0, MIN_COUNT));
  };

  var activateMap = function (evt) {
    if (evt.button === MOUSE_BUTTON_LEFT || evt.key === KEY_ENTER) {
      map.classList.remove('map--faded');

      if (!checkResponseSuccess) {
        window.backend.load(onSuccess, onError);
      } else {
        renderPins(pinList, offers.slice(0, MIN_COUNT));
        toggleEditable(filterElements, false);
        filters.addEventListener('change', onFiltersChange);
      }

      window.form.bid.classList.remove('ad-form--disabled');

      toggleEditable(bidElements, false);

      window.form.advertAdressField.value = calculatePinLocation();

      mainPin.removeEventListener('keydown', onMainPinEnterPress);
    }
  };

  toggleEditable(filterElements, true);
  toggleEditable(bidElements, true);

  mainPin.addEventListener('mousedown', onMainPinClick);
  mainPin.addEventListener('keydown', onMainPinEnterPress);

  window.map = {
    element: map,
    mainPin: mainPin,
    bidElements: bidElements,
    MainPin: MainPin,
    filters: filters,
    filterElements: filterElements,
    removePopup: removePopup,
    removePins: removePins,
    checkMapState: checkMapState,
    toggleEditable: toggleEditable,
    calculatePinLocation: calculatePinLocation,
    onMainPinEnterPress: onMainPinEnterPress,
    onFiltersChange: onFiltersChange,
  };
})();
