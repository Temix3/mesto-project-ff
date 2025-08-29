import * as API from "../utils/api";

// Функция создания карточки
export const createCard = (card, cardTemplate, profileId, handlerImage) => {
  const { link: linkCard, name: nameCard } = card;

  const element = cardTemplate.content
    .querySelector(".places__item")
    .cloneNode(true);

  const image = element.querySelector(".card__image");
  const title = element.querySelector(".card__description .card__title");
  const likeCount = element.querySelector(".card__like-button-counter");
  const buttonDelete = element.querySelector(".card__delete-button");
  const buttonLike = element.querySelector(".card__like-button");

  if(card.owner._id !== profileId) {
    buttonDelete.disabled = true;
  }
  
  let isLiked = false;
  for(const profile of card.likes) {
    if(profile._id === profileId) {
      buttonLike.classList.add("card__like-button_is-active");
      isLiked = true;
      break;
    }
  }

  image.src = linkCard;
  image.alt = nameCard;
  title.textContent = nameCard;
  likeCount.textContent = card.likes.length;

  buttonDelete.addEventListener("click", () => deleteCard(element, card._id));
  buttonLike.addEventListener("click", () => {
    if(isLiked) {
      removeLikeCard(buttonLike, likeCount, card._id);
      isLiked = false;
    }
    else {
      likeCard(buttonLike, likeCount, card._id);
      isLiked = true;
    }
  });
  image.addEventListener("click", handlerImage);

  return element;
}

// Функция удаления карточки
const deleteCard = (cardElement, cardId) =>  {
  API.deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((error) => {
      console.error(error);
    });
}

// Функция лайка карточки
const likeCard = (buttonLike, likeCount, cardId) => {
  API.addLikeCard(cardId)
    .then((updatedCard) => {
      likeCount.textContent = updatedCard.likes.length;
      buttonLike.classList.add("card__like-button_is-active");
    })
    .catch((error) => {
      console.error(error);
    });
}

// Функция снятия лайка с карточки
const removeLikeCard = (buttonLike, likeCount, cardId) => {
  API.removeLikeCard(cardId)
    .then((updatedCard) => {
      likeCount.textContent = updatedCard.likes.length;
      buttonLike.classList.remove("card__like-button_is-active");
    })
    .catch((error) => {
      console.error(error);
    });
}