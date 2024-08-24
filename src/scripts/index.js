import "../pages/index.css";
import { initialCards } from "./cards.js";
import { createCard, deleteCard, likeCard } from "./card";
import { openPopup, closePopup } from "./modal.js";

const cardContainer = document.querySelector(".places__list");
const pageContent = document.querySelector(".content");
//переменные для открытия попапов и заполнения данных в них

const editAuthorPopup = document.querySelector(".popup_type_edit");
const editAuthorForm = editAuthorPopup.querySelector(".popup__form");
const editAuthorName = editAuthorPopup.querySelector(".popup__input_type_name");
const editAuthorDescription = editAuthorPopup.querySelector(
  ".popup__input_type_description"
);
const profileTitle = pageContent.querySelector(".profile__title");
const profileDescription = pageContent.querySelector(".profile__description");

const addCardPopup = document.querySelector(".popup_type_new-card");
const cardImagePopup = document.querySelector(".popup_type_image");
const popupImageCaption = cardImagePopup.querySelector(".popup__caption");
const popupImage = cardImagePopup.querySelector(".popup__image");

const newCardTitle = addCardPopup.querySelector(".popup__input_type_card-name");
const newCardLink = addCardPopup.querySelector(".popup__input_type_url");
const newCardPopupForm = addCardPopup.querySelector(".popup__form");
// кнопки на странице
const addButton = document.querySelector(".profile__add-button");
const editButton = document.querySelector(".profile__edit-button");

// вызываем отрисовку карточек, функционал лайка, удаления с главного экрана
initialCards.forEach((cardData) => {
  const card = createCard(
    cardData,
    deleteCard,
    likeCard,
    onCardImageClick,
    cardContainer
  );
  cardContainer.appendChild(card);
});

//ОТКРЫТИЕ ГОТОВОЙ КАРТОЧКИ
// открываем попап изображения отслеживанием кликов по карточке
function onCardImageClick(evt) {
  const popupImage = fullImagePopup(evt);
  openPopup(popupImage);
}

// заполним попап изображения необходимыми данными
function fullImagePopup(evt) {
  popupImageCaption.textContent = evt.target.alt;
  popupImage.src = evt.target.src;
  popupImage.alt = evt.target.alt;
  return cardImagePopup;
}

//ОТКРЫТИЕ РЕДАКТОРА ПРОФАЙЛА И РЕДАКТОРА ДОБАВЛЕНИЯ НОВЫХ КАРТОЧЕК

//навесим слушатель на кнопки
addButton.addEventListener("click", () => {
  newCardPopupForm.addEventListener("submit", addCardSubmit);
  openPopup(addCardPopup);
});

editButton.addEventListener("click", () => {
  editAuthorName.value = profileTitle.textContent;
  editAuthorDescription.value = profileDescription.textContent;

  editAuthorForm.addEventListener("submit", updateProfileSubmit);
  openPopup(editAuthorPopup);
});

//функционал сохранения данных в новой карточке
function addCardSubmit(evt) {
  evt.preventDefault();

  const cardDataObject = {
    name: newCardTitle.value,
    link: newCardLink.value,
  };

  const newCard = createCard(
    cardDataObject,
    deleteCard,
    likeCard,
    onCardImageClick,
    cardContainer
  );
  cardContainer.prepend(newCard);
  newCardPopupForm.reset();
  addCardPopup.removeEventListener("submit", addCardSubmit);

  closePopup(addCardPopup);
}

//функционал сохранения данных в профайле
function updateProfileSubmit(evt) {
  evt.preventDefault();

  pageContent.querySelector(".profile__title").textContent =
    editAuthorName.value;
  pageContent.querySelector(".profile__description").textContent =
    editAuthorDescription.value;

  editAuthorPopup.removeEventListener("submit", updateProfileSubmit);
  closePopup(editAuthorPopup);
}
