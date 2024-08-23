import "../pages/index.css";
import { initialCards } from "./cards.js";
import { createCard, deleteCard, likeCard } from "./card";
import { openPopups, closePopups } from "./modal.js";

const cardContainer = document.querySelector(".places__list");
const pageContent = document.querySelector(".content");
//переменные для открытия попапов и заполнения данных в них
const editAuthorPopup = document.querySelector(".popup_type_edit");
const editAuthorName = editAuthorPopup.querySelector(".popup__input_type_name");
const editAuthorDescription = editAuthorPopup.querySelector(
  ".popup__input_type_description"
);
const addCardPopup = document.querySelector(".popup_type_new-card");
const cardImagePopup = document.querySelector(".popup_type_image");
const newCardTitle = addCardPopup.querySelector('.popup__input_type_card-name');
const newCardLink = addCardPopup.querySelector('.popup__input_type_url');
const popupForm = addCardPopup.querySelector('.popup__form');


// вызываем отрисовку карточек, функционал лайка, удаления с главного экрана
initialCards.forEach((cardData) => {
  const card = createCard(cardData, deleteCard, likeCard, onCardImageClick, cardContainer);
  cardContainer.appendChild(card);
});

// отслеживаем клик на элемент
function isElementClicked(evt, elementClass) {
  return evt.target.classList.contains(elementClass);
}



//ОТКРЫТИЕ ГОТОВОЙ КАРТОЧКИ
// открываем попап изображения отслеживанием кликов по карточке
function onCardImageClick(evt) {
  if (isElementClicked(evt, "card__image")) {
    const popupImage = fullImagePopup(evt);
    openPopups(popupImage);
  }
}

// заполним попап изображения необходимыми данными
function fullImagePopup(evt) {
  cardImagePopup.querySelector(".popup__caption").textContent = evt.target.alt;
  cardImagePopup.querySelector(".popup__image").src = evt.target.src;
  cardImagePopup.querySelector(".popup__image").alt = evt.target.alt;
  return cardImagePopup;
}

//ОТКРЫТИЕ РЕДАКТОРА ПРОФАЙЛА И РЕДАКТОРА ДОБАВЛЕНИЯ НОВЫХ КАРТОЧЕК

document.addEventListener('click', clickPageButtons);

function clickPageButtons(evt) {
 // открываем попап с добавлением карточки
  if (isElementClicked(evt, "profile__add-button")) {
    addCardPopup.addEventListener('submit', addCardSubmit);
    openPopups(addCardPopup);
  }

  // открываем попап с редактированием профиля
  if (isElementClicked(evt, "profile__edit-button")) {
    editAuthorName.value = pageContent.querySelector('.profile__title').textContent;
    editAuthorDescription.value = pageContent.querySelector('.profile__description').textContent;

    editAuthorPopup.addEventListener('submit', updateProfileSubmit);

    openPopups(editAuthorPopup);
  }
}

//функционал сохранения данных в новой карточке
function addCardSubmit(evt) {
  evt.preventDefault();

  const cardDataObject = {
    name: newCardTitle.value,
    link: newCardLink.value
  }

  const newCard = createCard(cardDataObject, deleteCard, likeCard, onCardImageClick, cardContainer);
  cardContainer.prepend(newCard);
  popupForm.reset();
  addCardPopup.removeEventListener('submit', addCardSubmit);

  closePopups(addCardPopup);
}

//функционал сохранения данных в профайле
function updateProfileSubmit(evt) {
  evt.preventDefault();

  pageContent.querySelector('.profile__title').textContent = editAuthorName.value;
  pageContent.querySelector('.profile__description').textContent = editAuthorDescription.value;

  editAuthorPopup.removeEventListener('submit', updateProfileSubmit);
  closePopups(editAuthorPopup);
}