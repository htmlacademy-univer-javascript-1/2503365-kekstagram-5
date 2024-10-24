import { getRandomElement, getRandomInt } from './util.js';

export function generateComments(count) {
  const comments = [];
  const messages = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  const names = ['Артём', 'Мария', 'Дмитрий', 'Алексей', 'Ольга', 'Наталья', 'Иван', 'Сергей', 'Екатерина'];

  for (let i = 0; i < count; i++) {
    const comment = {
      id: getRandomInt(100, 999),
      avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
      message: getRandomElement(messages),
      name: getRandomElement(names)
    };
    comments.push(comment);
  }

  return comments;
}

export function generatePhotos() {
  const photos = [];

  for (let i = 1; i <= 25; i++) {
    const photo = {
      id: i,
      url: `photos/${i}.jpg`,
      description: `Описание фотографии номер ${i}`,
      likes: getRandomInt(15, 200),
      comments: generateComments(getRandomInt(0, 30))
    };
    photos.push(photo);
  }
  return photos;
}
