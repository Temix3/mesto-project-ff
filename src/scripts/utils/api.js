const id = "cohort-mag-4";
const token = "55e6f46e-3cec-4d5f-ab61-ad4b7fc255a8";
const apiUrl = `https://nomoreparties.co/v1/${id}`;
const baseHeaders = {
  authorization: `${token}`,
  "Content-Type": "application/json"
};

export const getUser = () => {
  return _fetch("users/me");
}

export const getCards = () => {
  return _fetch("cards");
}

export const editProfile = (name, about) => {
  return _fetch("users/me", {
    method: "PATCH",
    body: {
      name,
      about
    }
  });
}

export const addCard = (card) => {
  return _fetch("cards", {
    method: "POST",
    body: card
  });
}

export const deleteCard = (cardId) => {
  return _fetch("cards/"+cardId, {
    method: "DELETE"
  });
}

export const addLikeCard = (cardId) => {
  return _fetch("cards/likes/"+cardId, {
    method: "PUT"
  });
}

export const removeLikeCard = (cardId) => {
  return _fetch("cards/likes/"+cardId, {
    method: "DELETE"
  });
}

export const editProfileImage = (imageUrl) => {
  return _fetch("users/me/avatar", {
    method: "PATCH",
    body: {
      avatar: imageUrl
    }
  });
}

const _fetch = (url, options) => {
  const baseOptions = {
    method: (options && options.method) || "GET",
    headers: baseHeaders
  }

  if(options && options.body) {
    baseOptions.body = JSON.stringify(options.body);
  }

  return fetch(`${apiUrl}/${url}`, baseOptions)
          .then(res => {
            if(res.ok) return res.json();
            return Promise.reject("Ошибка "+res.status);
          });
}
