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

function renderThumbnails(data) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < data.length; i++) {
    const thumbnail = createThumbnail(data[i]);
    fragment.appendChild(thumbnail);
  }
  picturesContainer.appendChild(fragment);
}

export { renderThumbnails };
