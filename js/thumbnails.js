import { openBigPicture } from './big-picture.js';

const thumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');
const picturesContainer = document.querySelector('.pictures');

function createThumbnail(photoData) {
  const thumbnail = thumbnailTemplate.cloneNode(true);
  const img = thumbnail.querySelector('.picture__img');
  img.src = photoData.url;
  img.alt = photoData.description;

  thumbnail.querySelector('.picture__likes').textContent = photoData.likes;
  thumbnail.querySelector('.picture__comments').textContent = photoData.comments.length;

  // Открытие полноразмерного изображения при клике
  thumbnail.addEventListener('click', function () {
    openBigPicture(photoData); // Открываем большое изображение
  });

  return thumbnail;
}

function renderThumbnails(photos) {
  const container = document.querySelector('.pictures'); // Контейнер для миниатюр
  const template = document.querySelector('#picture').content.querySelector('.picture'); // Шаблон миниатюры

  photos.forEach((photo) => {
    const photoElement = template.cloneNode(true);
    photoElement.querySelector('.picture__img').src = photo.url;
    photoElement.querySelector('.picture__likes').textContent = photo.likes;
    photoElement.querySelector('.picture__comments').textContent = photo.comments.length;
    container.appendChild(photoElement);
  });
}

export { renderThumbnails };
