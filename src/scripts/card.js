import { likeCardServer, dislikeCardServer } from "./api.js";
import { openPopup } from "./modal";

export { createCard, deleteButtonClick, likeCard, onDelete };
const cardTemplate = document.querySelector("#card-template").content;
let onDelete = null;

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

  likeButton.addEventListener("click", obj.functionsSet.likeCard);
  deleteButton.addEventListener("click", obj.functionsSet.deleteButtonClick);
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

function setCardData(
  element,
  image,
  title,
  counter,
  cardId,
  link,
  name,
  likesCount
) {
  element.dataset.cardId = cardId;
  image.src = link;
  image.alt = name;
  title.textContent = name;
  counter.textContent = likesCount;
}

function deleteButtonClick(evt) {
  const deleteCardPopup = document.querySelector(".popup_type_delete-card");
  onDelete = evt.target.closest(".card");
  openPopup(deleteCardPopup);
}

// Функция проставления лайка
function likeCard(evt) {
  const card = evt.target.closest(".places__item");
  const likeCounter = card.querySelector(".like_counter");

  if (!evt.target.classList.contains("card__like-button_is-active")) {
    likeCardServer(card.dataset.cardId)
      .then((data) => {
        likeCounter.textContent = data.likes.length;
        evt.target.classList.add("card__like-button_is-active");
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    dislikeCardServer(card)
      .then((data) => {
        likeCounter.textContent = data.likes.length;
        evt.target.classList.remove("card__like-button_is-active");
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
