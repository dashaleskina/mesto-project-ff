import { likeCardServer, dislikeCardServer } from "./api.js";

export { createCard, likeCard };
const cardTemplate = document.querySelector("#card-template").content;

function createCard(obj) {
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);

  const { link, name, likes, _id } = obj.item;

  const cardImageElement = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const title = cardElement.querySelector(".card__title");
  const likeCounter = cardElement.querySelector(".like_counter");

  // Устанавливаем данные карточки
  setCardData(
    cardElement,
    cardImageElement,
    title,
    likeCounter,
    _id,
    link,
    name,
    likes.length
  );

  // Передаем необходимые элементы в likeCard
  likeButton.addEventListener("click", () => likeCard(cardElement, likeCounter, likeButton));
  deleteButton.addEventListener("click", () =>
    obj.functionsSet.deleteButtonClick(cardElement)
  );
  cardImageElement.addEventListener("click", () => {
    obj.functionsSet.openFullCard(cardImageElement.src, cardImageElement.alt);
  });

  if (obj.item.likes.find((userLiked) => userLiked._id === obj.userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (obj.item.owner._id !== obj.userId) {
    deleteButton.style.display = "none";
  }

  return cardElement;
}

function setCardData(element, image, title, counter, cardId, link, name, likesCount) {
  element.cardId = cardId;
  image.src = link;
  image.alt = name;
  title.textContent = name;
  counter.textContent = likesCount;
}

// Функция проставления лайка
function likeCard(cardElement, likeCounter, likeButton) {
  if (!likeButton.classList.contains("card__like-button_is-active")) {
    likeCardServer(cardElement.cardId)
      .then((data) => {
        likeCounter.textContent = data.likes.length;
        likeButton.classList.add("card__like-button_is-active");
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    dislikeCardServer(cardElement.cardId)
      .then((data) => {
        likeCounter.textContent = data.likes.length;
        likeButton.classList.remove("card__like-button_is-active");
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
