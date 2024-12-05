import { generatePhotos } from './data.js';
import { renderThumbnails } from './thumbnails.js';

const photos = generatePhotos(); // Генерация данных
renderThumbnails(photos); // Отрисовка миниатюр
