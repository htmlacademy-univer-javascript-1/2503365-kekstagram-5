

const thumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');
const picturesContainer = document.querySelector('.pictures');

const createThumbnail = function (url, description, likes, comments) {
  const thumbnail = thumbnailTemplate.cloneNode(true);
  const img = thumbnail.querySelector('.picture__img');
  img.src = url;
  img.alt = description;

  thumbnail.querySelector('.picture__likes').textContent = likes;
  thumbnail.querySelector('.picture__comments').textContent = comments.length;

  return thumbnail;
};

export const renderThumbnails = (data) => {
  const fragment = document.createDocumentFragment();
  data.forEach(({ url, description, likes, comments, id }) => {
    const thumbnail = createThumbnail(url, description, likes, comments);
    fragment.appendChild(thumbnail);
    thumbnail.dataset.thumbnailId = id;
  });
  picturesContainer.append(fragment);
};

