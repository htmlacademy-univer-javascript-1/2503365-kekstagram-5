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
  if (!photos || photos.length === 0) {
    return;
  }

  // Делаем блок фильтров видимым
  photoFilters.classList.remove('img-filters--inactive');
  photoFilters.style.display = 'block';

  filterButtons.forEach((button) => {
    button.addEventListener(
      'click',
      debounce((evt) => {
        const target = evt.target;

        // Удаляем класс активности у всех кнопок
        filterButtons.forEach((btn) =>
          btn.classList.remove('img-filters__button--active')
        );

        // Добавляем класс активности нажатой кнопке
        target.classList.add('img-filters__button--active');

        clearThumbnails();

        // Применяем фильтр и отрисовываем миниатюры
        const filteredPhotos = applyFilter(photos, target.id);
        renderThumbnails(filteredPhotos);
      }, 500)
    );
  });
}

function clearThumbnails() {
  const pictures = document.querySelectorAll('.picture');
  if (pictures) {
    pictures.forEach((picture) => picture.remove());
  }
}
