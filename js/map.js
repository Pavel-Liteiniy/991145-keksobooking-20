'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var KEY_ENTER = 'Enter';
  var MOUSE_BUTTON_LEFT = 0;

  var LOCATION_TOP = 130;
  var LOCATION_BOTTOM = 630;

  var MIN_COUNT = 5;

  var DEBOUNCE_INTERVAL = 500;

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

  var filterPriceMap = {
    'low': {
      min: 0,
      max: 10000
    },
    'middle': {
      min: 10000,
      max: 50000
    },
    'high': {
      min: 50000,
      max: Infinity
    }
  };

  var offers = [];

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

  var map = document.querySelector('.map');
  var filtersContainer = map.querySelector('.map__filters-container');
  var filters = filtersContainer.querySelector('.map__filters');
  var filterItems = filters.querySelectorAll('fieldset, select');
  var mainPin = map.querySelector('.map__pin--main');
  var filterFormItems = Array.from(filters.children);
  var pinTemplate = document.querySelector('#pin').content;
  var pinList = map.querySelector('.map__pins');
  var mapWidth = pinList.offsetWidth;

  var bidItems = document.querySelectorAll('.ad-form fieldset, .ad-form select');

  var calculatePinLocation = function () {
    var leftGap = Number(mainPin.style.left.slice(0, -2));
    var topGap = Number(mainPin.style.top.slice(0, -2));

    return checkMapState()
      ? Math.round(MainPin.getBigLocation().x + leftGap) + ', ' + Math.round(MainPin.getBigLocation().y + topGap)
      : Math.round(MainPin.getSmallLocation().x + leftGap) + ', ' + Math.round(MainPin.getSmallLocation().y + topGap);
  };

  var removePins = function () {
    Array.from(map.querySelectorAll('.map__pin:not(.map__pin--main)')).forEach(function (item) {
      item.remove();
    });
  };

  var removePopup = function () {
    var popup = map.querySelector('.popup');

    if (popup !== null) {
      popup.remove();
    }

    var pins = pinList.querySelectorAll('.map__pin:not(.map__pin--main)');
    var activePin = Array.from(pins).find(function (item) {
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

    Array.from(formItems).forEach(function (formItem) {
      formItem.disabled = isDisable;
    });
  };

  var renderPins = function (parent, adverts) {
    var fragment = document.createDocumentFragment();

    adverts.forEach(function (advert) {
      fragment.appendChild(createPin(advert));
    });

    parent.appendChild(fragment);
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

  var debounce = function (perform, timeDelay) {
    var timeout;

    return function () {
      var parameters = arguments;
      var getPerformance = function () {
        perform.apply(null, parameters);
      };

      clearTimeout(timeout);
      timeout = setTimeout(getPerformance, timeDelay);
    };
  };

  var onSuccess = function (adverts) {
    offers = adverts.slice().filter(function (advert) {
      return advert.hasOwnProperty('offer');
    });
    renderPins(pinList, offers.slice(0, MIN_COUNT));
    toggleEditable(filterItems, false);

    filters.addEventListener('change', debounce(onFiltersChange, DEBOUNCE_INTERVAL));
  };

  var filterRules = {
    'housing-type': function (advert, filter) {
      return filter.value === advert.offer.type;
    },

    'housing-price': function (advert, filter) {
      return advert.offer.price >= filterPriceMap[filter.value].min && advert.offer.price < filterPriceMap[filter.value].max;
    },

    'housing-rooms': function (advert, filter) {
      return filter.value === advert.offer.rooms.toString();
    },

    'housing-guests': function (advert, filter) {
      return filter.value === advert.offer.guests.toString();
    },

    'housing-features': function (advert, filter) {
      var checkedFilterFeatures = Array.from(filter.querySelectorAll('input[type=checkbox]:checked'));

      return checkedFilterFeatures.every(function (filterFeature) {
        return advert.offer.features.some(function (advertFeature) {
          return filterFeature.value === advertFeature;
        });
      });
    }
  };

  var filterAdverts = function (adverts) {
    return adverts.filter(function (advert) {
      return filterFormItems.every(function (filter) {
        return (filter.value === 'any') ? true : filterRules[filter.id](advert, filter);
      });
    });
  };

  var onFiltersChange = function (evt) {
    evt.preventDefault();

    var filteredOffers = filterAdverts(offers);

    window.card.close();
    removePins();
    renderPins(pinList, filteredOffers.slice(0, MIN_COUNT));
  };

  var activateMap = function (evt) {
    if (evt.button === MOUSE_BUTTON_LEFT || (evt.key === KEY_ENTER && window.form.popup.length === 0)) {
      map.classList.remove('map--faded');

      window.backend.load(onSuccess, onError);

      window.form.bid.classList.remove('ad-form--disabled');

      toggleEditable(bidItems, false);

      window.form.advertAdressField.value = calculatePinLocation();

      mainPin.removeEventListener('keydown', onMainPinEnterPress);
    }
  };

  toggleEditable(filterItems, true);
  toggleEditable(bidItems, true);

  mainPin.addEventListener('mousedown', onMainPinClick);
  mainPin.addEventListener('keydown', onMainPinEnterPress);

  window.map = {
    element: map,
    mainPin: mainPin,
    bidItems: bidItems,
    MainPin: MainPin,
    filters: filters,
    filterItems: filterItems,
    removePopup: removePopup,
    removePins: removePins,
    checkMapState: checkMapState,
    toggleEditable: toggleEditable,
    calculatePinLocation: calculatePinLocation,
    onMainPinEnterPress: onMainPinEnterPress,
    onFiltersChange: onFiltersChange,
  };
})();
