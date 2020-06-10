'use strict';

var ADS_NUMBER = 8;
var LOCATION_TOP = 130;
var LOCATION_BOTTOM = 630;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var advertTitles = ['Уютная хата', 'Милый домик', 'Проклятый старый дом', 'Клёвое бунгало', 'Шикарный дворец', 'Унылая хрущевка', 'Квартирка в многоэтажке'];
var checkTimes = ['12:00', '13:00', '14:00'];
var advertFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var housingTypes = ['palace', 'flat', 'house', 'bungalo'];
var advertDescriptions = [
  'Идейные соображения высшего порядка, а также рамки и место обучения кадров требуют от нас анализа направлений прогрессивного развития.',
  'Таким образом консультация с широким активом требуют определения и уточнения модели развития.',
  'Повседневная практика показывает, что дальнейшее развитие различных форм деятельности влечет за собой процесс внедрения и модернизации системы обучения кадров, соответствует насущным потребностям.',
  'Равным образом новая модель организационной деятельности представляет собой интересный эксперимент проверки системы обучения кадров, соответствует насущным потребностям.',
  'Повседневная практика показывает, что новая модель организационной деятельности позволяет оценить значение форм развития.',
  'Равным образом укрепление и развитие структуры обеспечивает широкому кругу (специалистов) участие в формировании форм развития.',
  'Задача организации, в особенности же рамки и место обучения кадров требуют от нас анализа модели развития.',
];
var advertPictures = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var cardPattern = {
  template: '#card',
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
};

var offerType = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
};

var pinTemplate = document.querySelector('#pin').content;
var pinList = document.querySelector('.map__pins');
var map = document.querySelector('.map');
var filters = document.querySelector('.map__filters-container');
var cardTemplate = document.querySelector(cardPattern.template).content;

var mapWidth = pinList.offsetWidth;
var mapHeight = pinList.offsetHeight;

var getRandomInt = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

function shuffleArray(array) {
  var shuffledArray = array;

  for (var i = shuffledArray.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var box = shuffledArray[i];
    shuffledArray[i] = shuffledArray[j];
    shuffledArray[j] = box;
  }

  return shuffledArray;
}

var createAdvert = function (index) {
  return {
    author: {
      avatar: 'img/avatars/user0' + index + '.png',
    },
    offer: {
      title: advertTitles[getRandomInt(0, advertTitles.length - 1)],
      address: getRandomInt(1, mapWidth - 1) + ', ' + getRandomInt(1, mapHeight - 1),
      price: getRandomInt(1, 100000),
      type: housingTypes[getRandomInt(0, housingTypes.length - 1)],
      rooms: getRandomInt(1, 3),
      guests: getRandomInt(0, 2),
      checkin: checkTimes[getRandomInt(0, checkTimes.length - 1)],
      checkout: checkTimes[getRandomInt(0, checkTimes.length - 1)],
      features: shuffleArray(advertFeatures).slice(getRandomInt(0, advertFeatures.length - 1)),
      description: advertDescriptions[getRandomInt(0, advertDescriptions.length - 1)],
      photos: shuffleArray(advertPictures).slice(getRandomInt(0, advertPictures.length - 1)),
    },
    location: {
      x: getRandomInt(0, mapWidth) - PIN_WIDTH,
      y: getRandomInt(LOCATION_TOP - PIN_HEIGHT, LOCATION_BOTTOM - PIN_HEIGHT),
    },
  };
};

var getAds = function (iterationsNumber) {
  var array = [];

  for (var i = 1; i <= iterationsNumber; i++) {
    array.push(createAdvert(i));
  }

  return array;
};

var createPin = function (advert) {
  var pin = pinTemplate.cloneNode(true);
  var pinButton = pin.querySelector('.map__pin');
  var pinAvatar = pin.querySelector('img');

  pinButton.style.left = advert.location.x + PIN_WIDTH / 2 + 'px';
  pinButton.style.top = advert.location.y + PIN_HEIGHT + 'px';
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
    type.textContent = offerType[advert.offer.type];
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

var adverts = getAds(ADS_NUMBER);

map.classList.remove('map--faded');

renderPins(pinList, adverts);

map.insertBefore(renderCard(adverts[0]), filters);
