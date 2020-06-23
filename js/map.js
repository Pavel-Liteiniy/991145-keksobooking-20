'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var KEY_ENTER = 'Enter';
  var KEY_ESCAPE = 'Escape';
  var MOUSE_BUTTON_LEFT = 0;

  var cardPattern = {
    template: '#card',
    article: '.map__card',
    title: '.popup__title',
    address: '.popup__text--address',
    price: '.popup__text--price',
    type: '.popup__type',
    capacity: '.popup__text--capacity',
    time: '.popup__text--time',
    features: {
      list: '.popup__features',
      item: 'popup__feature',
      wifi: 'popup__feature--wifi',
      dishwasher: 'popup__feature--dishwasher',
      parking: 'popup__feature--parking',
      washer: 'popup__feature--washer',
      elevator: 'popup__feature--elevator',
      conditioner: 'popup__feature--conditioner',
    },
    description: '.popup__description',
    photos: '.popup__photos',
    avatar: '.popup__avatar',
    close: '.popup__close',
  };

  var pinTemplate = document.querySelector('#pin').content;
  var pinList = document.querySelector('.map__pins');
  var map = document.querySelector('.map');
  var filters = document.querySelector('.map__filters-container');
  var cardTemplate = document.querySelector(cardPattern.template).content;

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

  var createFeaturesList = function (parentElement, adFeatures, featureClasses) {
    parentElement.innerHTML = '';
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < adFeatures.length; i++) {
      var listItem = document.createElement('li');
      listItem.classList.add(featureClasses.item, featureClasses[adFeatures[i]]);
      fragment.appendChild(listItem);
    }

    parentElement.appendChild(fragment);
  };

  var createImg = function (parentElement, imgTemplate, sources, alt) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < sources.length; i++) {
      var img = imgTemplate.cloneNode(true);
      img.src = sources[i];
      img.alt = img.alt || alt || '';
      fragment.appendChild(img);
    }

    imgTemplate.remove();
    parentElement.appendChild(fragment);
  };

  var renderCard = function (advert) {
    var card = cardTemplate.cloneNode(true);
    var title = card.querySelector(cardPattern.title);
    var address = card.querySelector(cardPattern.address);
    var price = card.querySelector(cardPattern.price);
    var type = card.querySelector(cardPattern.type);
    var capacity = card.querySelector(cardPattern.capacity);
    var time = card.querySelector(cardPattern.time);
    var featuresList = card.querySelector(cardPattern.features.list);
    var description = card.querySelector(cardPattern.description);
    var photos = card.querySelector(cardPattern.photos);
    var image = card.querySelector(cardPattern.photos + ' img');
    var avatar = card.querySelector(cardPattern.avatar);

    if (advert.offer.title) {
      title.textContent = advert.offer.title;
    } else {
      title.remove();
    }

    if (advert.offer.address) {
      address.textContent = advert.offer.address;
    } else {
      address.remove();
    }

    if (advert.offer.price) {
      price.textContent = advert.offer.price + '₽/ночь';
    } else {
      price.remove();
    }

    if (advert.offer.type) {
      type.textContent = window.form.offerType.ru[advert.offer.type];
    } else {
      type.remove();
    }

    if (advert.offer.rooms && advert.offer.guests) {
      capacity.textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
    } else {
      capacity.remove();
    }

    if (advert.offer.checkin && advert.offer.checkout) {
      time.textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
    } else {
      time.remove();
    }

    if (advert.offer.features) {
      createFeaturesList(featuresList, advert.offer.features, cardPattern.features);
    } else {
      featuresList.remove();
    }

    if (advert.offer.description) {
      description.textContent = advert.offer.description;
    } else {
      description.remove();
    }

    if (advert.offer.photos) {
      createImg(photos, image, advert.offer.photos);
    } else {
      photos.remove();
    }

    if (advert.author.avatar) {
      avatar.src = advert.author.avatar;
    } else {
      avatar.remove();
    }

    return card;
  };

  var onMainPinClick = function (evt) {
    evt.preventDefault();
    activateMap(evt);
  };

  var onMainPinEnterPress = function (evt) {
    evt.preventDefault();
    activateMap(evt);
  };

  var onCardCloseButtonClick = function (evt) {
    evt.preventDefault();
    closeCard();
  };

  var onCardEscPress = function (evt) {
    if (evt.key === KEY_ESCAPE) {
      evt.preventDefault();
      closeCard();
    }
  };

  var closeCard = function () {
    map.querySelector(cardPattern.close).removeEventListener('click', onCardCloseButtonClick);
    document.removeEventListener('keydown', onCardEscPress);
    map.querySelector(cardPattern.article).remove();
  };

  var getListenedRenderedCard = function (advert) {
    map.insertBefore(renderCard(advert), filters);

    map.querySelector(cardPattern.close).addEventListener('click', onCardCloseButtonClick);
    document.addEventListener('keydown', onCardEscPress);
  };

  var openCard = function (pin, advert) {
    pin.addEventListener('click', function (evt) {
      evt.preventDefault();

      var isCardRendered = map.querySelector(cardPattern.article);

      if (isCardRendered !== null && map.querySelector(cardPattern.address).textContent !== advert.offer.address) {
        closeCard();
        getListenedRenderedCard(advert);
      } else if (!(isCardRendered !== null)) {
        getListenedRenderedCard(advert);
      }
    });
  };

  var activateMap = function (evt) {
    if (evt.button === MOUSE_BUTTON_LEFT || evt.key === KEY_ENTER) {
      map.classList.remove('map--faded');
      renderPins(pinList, window.adverts);

      var anotherPins = pinList.querySelectorAll('.map__pin:not(.map__pin--main)');

      for (var i = 0; i < anotherPins.length; i++) {
        openCard(anotherPins[i], window.adverts[i]);
      }

      window.form.bid.classList.remove('ad-form--disabled');

      window.form.toggleEditable(window.form.bidElements, false);

      window.form.advertAdressField.value = window.form.calculatePinLocation(window.form.MainPinSize, window.form.mainPin, false);

      window.form.mainPin.removeEventListener('mousedown', onMainPinClick);
      window.form.mainPin.removeEventListener('keydown', onMainPinEnterPress);
    }
  };

  window.form.toggleEditable(window.form.bidElements, true);

  window.form.bid.classList.add('ad-form--disabled');

  window.form.mainPin.addEventListener('mousedown', onMainPinClick);

  window.form.mainPin.addEventListener('keydown', onMainPinEnterPress);
})();
