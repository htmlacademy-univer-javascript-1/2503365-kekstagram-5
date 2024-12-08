import { generatePhotos } from './data.js';
import { renderThumbnails } from './thumbnails.js';
import './form.js';


export const photos = generatePhotos(); // Экспорт массива
renderThumbnails(photos); // Отрисовка миниатюр
