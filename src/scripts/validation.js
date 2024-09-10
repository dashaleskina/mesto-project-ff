export { enableValidation, clearValidation };

function showInputError(formElement, inputElement, errorText, configSet) {
  // находим спан с текстами ошибок, задаем класс для отображения красной черты
  // далее задаем элементу текст ошибки и добавляем класс для скрытия или отображения  блока ошибки
  const inputErrorElement = formElement.querySelector(
    `.${inputElement.id}-error`
  );
  inputElement.classList.add(configSet.inputErrorClass);
  inputErrorElement.textContent = errorText;
  inputErrorElement.classList.add(configSet.inputErrorClass);
}

function hideInputError(formElement, inputElement, configSet) {
  // делаем все тоже самое, что и в функции showInputError, только наоборот
  // вместо текста вставляем пустое поле
  const inputErrorElement = formElement.querySelector(
    `.${inputElement.id}-error`
  );
  inputElement.classList.remove(configSet.inputErrorClass);
  inputErrorElement.textContent = "";
  inputErrorElement.classList.remove(configSet.inputErrorClass);
}

function isValid(formElement, inputElement, configSet) {
  // проверяем соответствует ли введенное значение паттерну в разметке,
  // если нет, то устанавливаем ошибку-кастом из атрибута data-error-message
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  // проверяем валидность и вызываем нужную функцию
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      configSet
    );
  } else {
    hideInputError(formElement, inputElement, configSet);
  }
}

// проверим есть ли поля с ошибками
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

// добавим кнопке необходимые стили
const toggleButtonState = (inputList, buttonElement, configSet) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(configSet.inactiveButtonClass);
  } else {
    buttonElement.classList.remove(configSet.inactiveButtonClass);
  }
};

//навесим слушатели всем формам
function setEventListeners(formElement, configSet) {
  const inputList = Array.from(
    formElement.querySelectorAll(configSet.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    configSet.submitButtonSelector
  );

  toggleButtonState(inputList, buttonElement, configSet);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      isValid(formElement, inputElement, configSet);
      toggleButtonState(inputList, buttonElement, configSet);
    });
  });
}

// очистим поля в форме
const clearValidation = (formElement, configSet) => {
  const inputList = Array.from(
    formElement.querySelectorAll(configSet.inputSelector)
  );

  inputList.forEach((inputElement) => {
    inputElement.classList.remove(configSet.inputErrorClass);
    const inputErrorElement = formElement.querySelector(
      `.${inputElement.id}-error`
    );
    inputErrorElement.classList.remove(configSet.errorClass);
    inputErrorElement.textContent = "";
  });
};

//применим валидацию ко всем формам
const enableValidation = (configSet) => {
  const inputForm = Array.from(
    document.querySelectorAll(configSet.formSelector)
  );
  inputForm.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement, configSet);
  });
};
