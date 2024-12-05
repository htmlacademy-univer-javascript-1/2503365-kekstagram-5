const bigPicture = document.querySelector('.big-picture');
const imageElement = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const descriptionElement = bigPicture.querySelector('.social__caption');
const commentCountBlock = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');


function openBigPicture(photoData) {
  // Скрываем блоки комментариев сразу
  commentCountBlock.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  // данные фотографии
  imageElement.src = photoData.url;
  imageElement.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;
  descriptionElement.textContent = photoData.description;

  // очистка старых комментов
  socialComments.innerHTML = '';

  // создаем новые комменты
  for (let i = 0; i < photoData.comments.length; i++) {
    const comment = photoData.comments[i];
    const commentElement = document.createElement('li');
    commentElement.classList.add('social__comment');

    commentElement.innerHTML = `
      <img
        class = 'social__picture'
        src = '${comment.avatar}'
        alt = '${comment.name}'
        width = '35' height = '35'>
      <p class='social__text'>${comment.message}</p>
    `;
    socialComments.appendChild(commentElement);
  }

  // убираем блоки комментариев
  commentCountBlock.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  // открываем окошко
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  closeButton.addEventListener('click', closeBigPicture);
  document.addEventListener('keydown', onEscapePress);
}

function closeBigPicture() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  closeButton.removeEventListener('click', closeBigPicture);
  document.removeEventListener('keydown', onEscapePress);
}

function onEscapePress(evt) {
  if (evt.key === 'Escape') {
    closeBigPicture();
  }
}

export { openBigPicture };
