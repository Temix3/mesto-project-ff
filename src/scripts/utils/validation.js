export const enableValidation = (validationConfig) => {
  const formElements = Array.from(document.querySelectorAll('form'));

  for(const formElement of formElements) {
    setValidationListeners(formElement, validationConfig);
  }
}

export const clearValidation = (formElement, validationConfig) => {
  const inputElements = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.buttonSelector);

  for(const inputElement of inputElements) {
    hideInputError(formElement, inputElement, validationConfig);
  }

  buttonElement.disabled = true;
}

// Новая функция для проверки валидности формы при открытии и обновления кнопки
export const validateFormOnOpen = (formElement, validationConfig) => {
  const inputElements = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.buttonSelector);

  let formIsValid = true;

  for (const inputElement of inputElements) {
    if (inputElement.validity.patternMismatch && inputElement.dataset.validationError) {
      inputElement.setCustomValidity(inputElement.dataset.validationError);
    } else {
      inputElement.setCustomValidity("");
    }

    if (!inputElement.validity.valid) {
      formIsValid = false;
      const errorElement = formElement.querySelector(`#${inputElement.name}-error`);
      inputElement.classList.add(validationConfig.inputClassWithError);
      errorElement.textContent = inputElement.validationMessage;
      errorElement.classList.remove(validationConfig.errorClassHidden);
    } else {
      const errorElement = formElement.querySelector(`#${inputElement.name}-error`);
      inputElement.classList.remove(validationConfig.inputClassWithError);
      errorElement.textContent = "";
      errorElement.classList.add(validationConfig.errorClassHidden);
    }
  }

  buttonElement.disabled = !formIsValid;
}

const setValidationListeners = (formElement, validationConfig) => {
  const inputElements = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.buttonSelector);

  for(const inputElement of inputElements) {
    inputElement.addEventListener('input', () => {
      isInputValid(formElement, inputElement, validationConfig);
      isFormValid(formElement, buttonElement, inputElements);
    });
  }
}

const isInputValid = (formElement, inputElement, validationConfig) => {
  if(inputElement.validity.patternMismatch && inputElement.dataset.validationError) {
    inputElement.setCustomValidity(inputElement.dataset.validationError);
  }
  else {
    inputElement.setCustomValidity("");
  }

  if(!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
  }
  else {
    hideInputError(formElement, inputElement, validationConfig);
  }
}

const isFormValid = (formElement, buttonElement, inputElements) => {
  let formIsValid = true;

  for (const inputElement of inputElements) {
    if (!inputElement.validity.valid) {
      formIsValid = false;
      break;
    }
  }

  buttonElement.disabled = !formIsValid;
}

const showInputError = (formElement, inputElement, errorMessage, validationConfig) => {
  const errorElement = formElement.querySelector(`#${inputElement.name}-error`);
  
  inputElement.classList.add(validationConfig.inputClassWithError);
  errorElement.textContent = errorMessage;
  setTimeout(() => errorElement.classList.remove(validationConfig.errorClassHidden), 0);
}

const hideInputError = (formElement, inputElement, validationConfig) => {
  const errorElement = formElement.querySelector(`#${inputElement.name}-error`);

  inputElement.classList.remove(validationConfig.inputClassWithError);
  errorElement.classList.add(validationConfig.errorClassHidden);
  setTimeout(() => errorElement.textContent = '', 0);
  errorElement.textContent = '';
}
