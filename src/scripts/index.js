import "../pages/index.css";
import { createCard } from "./components/card";
import { openModal, closeModal } from "./components/modal";
import { enableValidation, clearValidation } from "./utils/validation";
import * as API from "./utils/api";

// Включение валидации всех форм
const validationConfig = {
  inputSelector: '.popup__input',
  buttonSelector: '.popup__button',
  errorSelector: '.popup__input-error',
  inputClassWithError: 'popup__input_type_error',
  errorClassHidden: 'popup__input-error-is-hidden'
}
enableValidation(validationConfig);

// Темплейт карточки
const cardTemplate = document.querySelector("#card-template");
// Контейнер карточек
const listPlaces = document.querySelector(".places__list");

// Кнопка добавления карточек
const buttonAddCard = document.querySelector(".profile__add-button");
// Кнопка редактирования профиля
const buttonEditProfile = document.querySelector(".profile__edit-button");

// Модальное окно добавления карточек
const modalAddCard = document.querySelector(".popup_type_new-card");
// Модальное окно редактирования профиля
const modalEditProfile = document.querySelector(".popup_type_edit");
// Модальное окно редактирования аватара
const modalEditAvatar = document.querySelector(".popup_type_avatar");
// Модальное окно просмотра карточки
const modalViewCard = document.querySelector(".popup_type_image");

// Форма редактирования профиля
const formEditProfile = modalEditProfile.querySelector(
  ".popup__content .popup__form"
);
const inputNameProfileForm = formEditProfile.querySelector("input[name=name]");
const inputDescriptionProfileForm = formEditProfile.querySelector(
  "input[name=description]"
);

// Форма редактирования аватара
const formEditAvatar = modalEditAvatar.querySelector(
  ".popup__content .popup__form"
);
const inputLinkEditAvatarForm = formEditAvatar.querySelector(
  "input[name=link]"
);

// Форма добавления карточки
const formAddCard = modalAddCard.querySelector(".popup__content .popup__form");
const inputNameAddCardForm = formAddCard.querySelector(
  "input[name=place-name]"
);
const inputLinkAddCardForm = formAddCard.querySelector("input[name=link]");

// Элементы профиля
const imageProfile = document.querySelector(".profile__image");
const nameProfile = document.querySelector(".profile__title");
const descriptionProfile = document.querySelector(".profile__description");

// Идентификатор пользователя
let userId;

// Загрузка данных страницы (профиль и карточки)
Promise.all([API.getUser(), API.getCards()])
  .then(([user, cards]) => {
    userId = user._id;
    nameProfile.textContent = user.name;
    descriptionProfile.textContent = user.about;
    imageProfile.style.backgroundImage = `url(${user.avatar})`;

    for(const card of cards) {
      const cardElement = createCard(card, cardTemplate, userId, () =>
        openModalWithImage(modalViewCard, card)
      );
      listPlaces.append(cardElement);
    }
  })
  .catch((error) => {
    console.error(error);
  });

// Открытие модального окна редактирования профиля
buttonEditProfile.addEventListener("click", () => {
  inputNameProfileForm.value = nameProfile.textContent;
  inputDescriptionProfileForm.value = descriptionProfile.textContent;
  clearValidation(formEditProfile, validationConfig);
  openModal(modalEditProfile);
});

// Открытие модального окна редактирования аватара
imageProfile.addEventListener("click", () => {
  inputLinkEditAvatarForm.value = "";
  clearValidation(formEditAvatar, validationConfig);
  openModal(modalEditAvatar);
});

// Открытие модального окна добавления карточки
buttonAddCard.addEventListener("click", () => {
  inputNameAddCardForm.value = "";
  inputLinkAddCardForm.value = "";
  clearValidation(formAddCard, validationConfig);
  openModal(modalAddCard);
});

// Добавление карточки
formAddCard.addEventListener("submit", (event) => {
  event.preventDefault();
  const card = {
    name: inputNameAddCardForm.value,
    link: inputLinkAddCardForm.value,
  };
  activateButtonLoading(formAddCard.querySelector(".button"));

  API.addCard(card)
    .then((card) => {
      const cardElement = createCard(card, cardTemplate, userId, () =>
        openModalWithImage(modalViewCard, card)
      );
      listPlaces.prepend(cardElement);
      closeModal(modalAddCard);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      removeButtonLoading(formAddCard.querySelector(".button"));
    });
});

// Изменение профиля
formEditProfile.addEventListener("submit", (event) => {
  event.preventDefault();
  activateButtonLoading(formEditProfile.querySelector(".button"));
  API.editProfile(inputNameProfileForm.value, inputDescriptionProfileForm.value)
    .then((profile) => {
      nameProfile.textContent = profile.name;
      descriptionProfile.textContent = profile.about;
      closeModal(modalEditProfile);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      removeButtonLoading(formEditProfile.querySelector(".button"));
    });
});

formEditAvatar.addEventListener("submit", (event) => {
  event.preventDefault();
  activateButtonLoading(formEditAvatar.querySelector(".button"));
  API.editProfileImage(inputLinkEditAvatarForm.value)
    .then((profile) => {
      imageProfile.style.backgroundImage = `url(${profile.avatar})`;
      closeModal(modalEditAvatar);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      removeButtonLoading(formEditAvatar.querySelector(".button"));
    });
});

// Открытие модального окна с изображением
const openModalWithImage = (modalElement, card) => {
  const imageModal = modalElement.querySelector(
    ".popup__content .popup__image"
  );
  const captionModal = modalElement.querySelector(
    ".popup__content .popup__caption"
  );

  imageModal.src = card.link;
  captionModal.textContent = card.name;

  openModal(modalElement);
};

const activateButtonLoading = (buttonElement) => {
  buttonElement.textContent = `${buttonElement.textContent}...`;
};

const removeButtonLoading = (buttonElement) => {
  buttonElement.textContent = buttonElement.textContent.slice(0, -3);
}