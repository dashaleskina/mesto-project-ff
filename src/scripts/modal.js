export { openPopups, closePopups };

// Закрытие попапов
function closePopups(popup) {
  if (popup && popup.classList.contains("popup_is-opened")) {
    popup.classList.remove("popup_is-opened");
    document.removeEventListener("keydown", closeByKeydown);
    popup.removeEventListener("click", closeByClicks);
  }
}

// Открытие попапов
function openPopups(popup) {
    if (popup) {
        popup.classList.add("popup_is-opened");
        document.addEventListener("keydown", closeByKeydown);
        popup.addEventListener("click", closeByClicks);
    }
}

//Если кликнули на кнопку закрытия
function clickOnCross(evt) {
  return evt.target.classList.contains("popup__close");
}

//Если кликнули на оверлей
function clickOnOverlay(evt) {
  return evt.target.classList.contains("popup");
}

//Если кликнули на esc
function clickOnEsc(evt) {
  return evt.key === "Escape" || evt.key === "Esc";
}

// Закрытие по клавише 
function closeByKeydown(evt) {
    if (clickOnEsc(evt)) {
        closePopups(document.querySelector('.popup_is-opened'));
    }
}
// Закрытие по кликам
function closeByClicks(evt) {
    const isCross = clickOnCross(evt);
    const isOverlay = clickOnOverlay(evt);

    if (isCross || isOverlay) {
        closePopups(evt.currentTarget)
    }
}