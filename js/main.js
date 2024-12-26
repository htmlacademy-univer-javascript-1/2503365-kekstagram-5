import { photos } from './photos.js';
import { renderThumbnails } from './thumbnails.js';
import { initFilters } from './filters.js';
import './form.js';
import './form-api.js';

renderThumbnails(photos); // Отрисовка миниатюр
initFilters(photos, renderThumbnails); // Инициализация фильтров
