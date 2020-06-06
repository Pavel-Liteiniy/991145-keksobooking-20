'use strict';

var ADS_NUMBER = 8;
var MAP_WIDTH = 1200;
var MAP_HEIGHT = 704;

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

var generateAdvert = function (index) {
  return {
    author: {
      avatar: 'img/avatars/user0' + index + '.png',
    },
    offer: {
      title: advertTitles[getRandomInt(0, advertTitles.length - 1)],
      address: getRandomInt(1, MAP_WIDTH - 1) + ', ' + getRandomInt(1, MAP_HEIGHT - 1),
      price: getRandomInt(100, 10000),
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
      x: getRandomInt(1, MAP_WIDTH - 1),
      y: getRandomInt(130, 630),
    },
  };
};

var getAdsArray = function (iterationNumber) {
  var array = [];

  for (var i = 1; i <= iterationNumber; i++) {
    array.push(generateAdvert(i));
  }

  return array;
};
