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

  let selectedFilter = null;

  const applyDebouncedFilter = debounce(() => {
    if (selectedFilter) {
      clearThumbnails();
      const filteredPhotos = applyFilter(photos, selectedFilter);
      renderThumbnails(filteredPhotos);
    }
  }, 500);

  filterButtons.forEach((button) => {
    button.addEventListener('click', (evt) => {
      // Удаляем класс активности у всех кнопок
      filterButtons.forEach((btn) => btn.classList.remove('img-filters__button--active'));

      // Устанавливаем класс активности для текущей кнопки
      evt.target.classList.add('img-filters__button--active');

      // Сохраняем выбранный фильтр
      selectedFilter = evt.target.id;

      // Запускаем отложенное применение фильтра
      applyDebouncedFilter();
    });
  });
}


function clearThumbnails() {
  const pictures = document.querySelectorAll('.picture');
  pictures.forEach((picture) => picture.remove());
}
