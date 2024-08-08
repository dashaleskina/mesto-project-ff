// @todo: Темплейт карточки
// Получаем ссылку на шаблон и контейнер, в который положим карточки
const cardTemplate = document.querySelector("#card-template").content;
const cardContainer = document.querySelector(".places__list");

// Функция для отрисовки карточки
function createCard(cardData, onDelete) {
  // клонируем содержимое шаблона
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);

  // наполняем содержимым
  const cardImage = (cardElement.querySelector(".card__image").src =
    cardData.link);
  const cardTitle = (cardElement.querySelector(".card__title").textContent =
    cardData.name);
  cardImage.alt = cardData.name;
  const deleteButton = cardElement.querySelector(".card__delete-button");

  // добавляем обработчик клика
  deleteButton.addEventListener("click", () => {
    onDelete(cardElement);
  });

  return cardElement;
}

// Функция для удаления карточки
function deleteCard(cardElement) {
    cardContainer.removeChild(cardElement);
  }

// используем массив с карточками
initialCards.forEach((cardData) => {
  const card = createCard(cardData, deleteCard);
  cardContainer.appendChild(card);
});
