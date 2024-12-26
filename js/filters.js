import { debounce } from './util.js';

const photoFilters = document.querySelector('.img-filters');
const filterButtons = photoFilters.querySelectorAll('.img-filters__button');
const RANDOM_PHOTOS_COUNT = 10;

function applyFilter(photos, filter) {
  switch (filter) {
    case 'filter-random':
      return photos
        .slice()
        .sort(() => Math.random() - 0.5)
        .slice(0, RANDOM_PHOTOS_COUNT);
    case 'filter-discussed':
      return photos
        .slice()
        .sort((a, b) => b.comments.length - a.comments.length);
    default:
      return photos;
  }
}

export function initFilters(photos, renderThumbnails) {
  photoFilters.classList.remove('img-filters--inactive');

  filterButtons.forEach((button) => {
    button.addEventListener(
      'click',
      debounce((evt) => {
        // Удаляем класс активности у всех кнопок
        filterButtons.forEach((btn) => btn.classList.remove('img-filters__button--active'));

        // Добавляем класс активности нажатой кнопке
        evt.target.classList.add('img-filters__button--active');

        clearThumbnails();

        // Применяем выбранный фильтр и отрисовываем миниатюры
        const filteredPhotos = applyFilter(photos, evt.target.id);
        renderThumbnails(filteredPhotos);
      }, 500)
    );
  });
}

function clearThumbnails() {
  const pictures = document.querySelectorAll('.picture');
  pictures.forEach((picture) => picture.remove());
}

