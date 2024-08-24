export { createCard, deleteCard, likeCard };



// Функция для отрисовки карточки
function createCard(cardData, onDelete, onLike, onClick, cardContainer) {
    // клонируем содержимое шаблона
    const cardTemplate = document.querySelector("#card-template").content;
    
    const cardElement = cardTemplate
      .querySelector(".places__item")
      .cloneNode(true);
  
    // наполняем содержимым
    const cardImageElement = cardElement.querySelector(".card__image");
    cardImageElement.src = cardData.link;
    cardImageElement.alt = cardData.name;
  
    (cardElement.querySelector(".card__title").textContent = cardData.name);
    const deleteButton = cardElement.querySelector(".card__delete-button");
  
    // добавляем обработчик клика на крестик
    deleteButton.addEventListener("click", () => {
        deleteCard(cardElement, cardContainer);
      });

    // добавляем обработчик клика на лайк
    const likeButton = cardElement.querySelector('.card__like-button');
    likeButton.addEventListener("click", onLike);

    //добавляем обработчик клика на карточку
    cardImageElement.addEventListener('click', onClick);
  
    return cardElement;
  }

  // Функция для удаления карточки
function deleteCard(cardElement, cardContainer) {
    cardContainer.removeChild(cardElement);
  }

  // Функция проставления лайка
  function likeCard(evt) {
    evt.target.classList.toggle('card__like-button_is-active');
  }