export {
  getUserProfile,
  getCards,
  patchProfile,
  patchAvatar,
  postNewCard,
  deleteCardServer,
  likeCardServer,
  dislikeCardServer,
};

const mainConfig = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-22",
  headers: {
    authorization: "c94f314c-232c-42e8-82c1-b76fe3d93934",
    "Content-Type": "application/json",
  },
};

function checkStatus(res) {
  console.log("Ответ от сервера:", res);
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка - ${res.status}`);
}

function getUserProfile() {
  return fetch(`${mainConfig.baseUrl}/users/me`, {
    headers: mainConfig.headers,
  }).then(checkStatus);
}

function getCards() {
  return fetch(`${mainConfig.baseUrl}/cards`, {
    headers: mainConfig.headers,
  }).then(checkStatus);
}

function patchProfile(userName, description) {
  return fetch(`${mainConfig.baseUrl}/users/me`, {
    method: "PATCH",
    headers: mainConfig.headers,
    body: JSON.stringify({
      name: userName.value,
      about: description.value,
    }),
  }).then(checkStatus);
}

function patchAvatar(link) {
  return fetch(`${mainConfig.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: mainConfig.headers,
    body: JSON.stringify({
      avatar: link,
    }),
  }).then(checkStatus);
}

function postNewCard(name, link) {
  return fetch(`${mainConfig.baseUrl}/cards`, {
    method: "POST",
    headers: mainConfig.headers,
    body: JSON.stringify({
      name: name,
      link: link,
    }),
  }).then(checkStatus);
}

function deleteCardServer(cardId) {
  return fetch(`${mainConfig.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: mainConfig.headers,
  }).then(checkStatus);
}

function likeCardServer(cardId) {
  return fetch(`${mainConfig.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: mainConfig.headers,
  }).then(checkStatus);
}

function dislikeCardServer(cardId) {
  return fetch(`${mainConfig.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: mainConfig.headers,
  }).then(checkStatus);
}
