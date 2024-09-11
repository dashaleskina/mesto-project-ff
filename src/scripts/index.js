import "../pages/index.css";
import { createCard, likeCard } from "./card";
import { openPopup, closePopup } from "./modal.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
  getUserProfile,
  getCards,
  patchProfile,
  patchAvatar,
  postNewCard,
  deleteCardServer,
} from "./api.js";

const cardContainer = document.querySelector(".places__list");
const pageContent = document.querySelector(".content");
//переменные для открытия попапов и заполнения данных в них

const editAuthorPopup = document.querySelector(".popup_type_edit");
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
const newCard = document.forms["new-place"];
// кнопки на странице
const addButton = document.querySelector(".profile__add-button");
const editButton = document.querySelector(".profile__edit-button");

const profileContainer = document.querySelector(".profile");
const profileImage = profileContainer.querySelector(".profile__image");
const profileForm = document.forms["edit-profile"];

const avatarForm = document.forms["avatar"];
const avatarPopup = document.querySelector(".popup_type_avatar");
const avatarUrlInput = avatarPopup.querySelector(".popup__input_type_url");
const deleteCardPopup = document.querySelector(".popup_type_delete-card");

// соберем функции в массив для удобства
Promise.all([getUserProfile(), getCards()])
  .then(([userProfile, cards]) => {
    profileContainer.dataset.userId = userProfile._id;
    profileImage.setAttribute(
      "style",
      `background-image: url(${userProfile.avatar})`
    );
    profileTitle.textContent = userProfile.name;
    profileDescription.textContent = userProfile.about;

    cards.forEach((item) => {
      cardContainer.append(createCard(newCardObj(item)));
    });
  })
  .catch((error) => {
    console.error(error);
  });

// объект с классами для валидации и сама функция валидации форм
const configValidation = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  errorVisible: ".popup__error_visible",
  inputErrorVisible: ".popup__input_type_error",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(configValidation);

// обработаем попап редактирование профиля, заполняя поля ввода значениями из профиля
// и очищая валидацию при каждом новом открытии
editButton.addEventListener("click", editProfileButton);

function editProfileButton() {
  editAuthorName.value = profileTitle.textContent;
  editAuthorDescription.value = profileDescription.textContent;
  clearValidation(profileForm, configValidation);
  openPopup(editAuthorPopup);
}

// работаем над отправкой данной в форме редактирования профиля
// сбрасываем стандартное поведение, задаем кнопке кастомный текст на время загрузки
// далее отрабатываем сохранение данных
profileForm.addEventListener("submit", editProfileSubmit);

function editProfileSubmit(evt) {
  evt.preventDefault();

  changeButtonText(editAuthorPopup, "Сохранение...");

  patchProfile(editAuthorName, editAuthorDescription)
    .then((data) => {
      profileTitle.textContent = data.name;
      profileDescription.textContent = data.about;
      closePopup(editAuthorPopup);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      changeButtonText(editAuthorPopup, "Сохранить");
    });

}

// сбрасываем форму добавления карточки, предварительно очищая валидацию
// открываем попап
addButton.addEventListener("click", addCardButton);

function addCardButton() {
  newCard.reset();
  clearValidation(newCard, configValidation);
  openPopup(addCardPopup);
}

// обрабатываем отправку формы добавления новой карточки

newCard.addEventListener("submit", addCardSubmitForm);

function addCardSubmitForm(evt) {
  evt.preventDefault();

  const newCardName = newCardTitle.value;
  const newCardUrl = newCardLink.value;

  changeButtonText(addCardPopup, "Сохранение...");

  postNewCard(newCardName, newCardUrl)
    .then((data) => {
      cardContainer.prepend(createCard(newCardObj(data)));
      closePopup(addCardPopup);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      changeButtonText(addCardPopup, "Сохранить");
    });

  newCard.reset();
}

//обрабатываем функцию изменения аватара, сбрасываем форму, очищаем валидацию
// открываем попап
profileImage.addEventListener("click", editAvatar);

function editAvatar() {
  avatarForm.reset();
  clearValidation(avatarForm, configValidation);
  openPopup(avatarPopup);
}

//обработчик отправки формы изменения аватара
avatarForm.addEventListener("submit", editAvatarSubmit);

function editAvatarSubmit(evt) {
  evt.preventDefault();

  const avatarUrl = avatarUrlInput.value;
  changeButtonText(avatarPopup, "Сохранение...");

  patchAvatar(avatarUrl)
    .then((data) => {
      profileImage.setAttribute(
        "style",
        `background-image: url(${data.avatar})`
      );
      closePopup(avatarPopup);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      changeButtonText(avatarPopup, "Сохранить");
    });
}

// обрабатываем открытие карточки
// устанавливаем ссылку на фото, имя и alt, открываем попап
function openFullCard(cardLink, cardName) {
  popupImage.src = cardLink;
  popupImage.alt = cardName;
  popupImageCaption.textContent = cardName;
  openPopup(cardImagePopup);
}

//функция для установления кастомного текста кнопки
function changeButtonText(popup, text) {
  popup.querySelector(".popup__button").textContent = text;
}

//обработаем удаление карточки
deleteCardPopup.addEventListener("submit", handleCardDeleteSubmit);
let onDelete = null;

function deleteButtonClick(cardElement) {
  onDelete = cardElement;
  openPopup(deleteCardPopup);
}

function handleCardDeleteSubmit(evt) {
  evt.preventDefault();

  if (onDelete) {
    const cardId = onDelete.cardId;

    deleteCardServer(cardId)
      .then(() => {
        onDelete.remove();
        closePopup(deleteCardPopup);
        onDelete = null;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

// создаем общий объект карточки
function newCardObj(item) {
  const userId = profileContainer.dataset.userId;
  const functionsSet = {
    likeCard,
    deleteButtonClick,
    openFullCard,
  };
  return { item, functionsSet, userId };
}
