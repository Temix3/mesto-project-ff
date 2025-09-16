// modal.js

let handleEscClose = null;

// Открытие модального окна
export const openModal = (modalElement) => {
  modalElement.classList.add("popup_is-opened");

  // Создаем и сохраняем обработчик нажатия клавиши Escape
  handleEscClose = (event) => {
    if (event.key === "Escape") {
      closeModal(modalElement);
    }
  };

  document.addEventListener("keydown", handleEscClose);
};

// Закрытие модального окна
export const closeModal = (modalElement) => {
  modalElement.classList.remove("popup_is-opened");

  // Удаляем только обработчик Escape
  document.removeEventListener("keydown", handleEscClose);
  handleEscClose = null;
};

// Навешиваем глобальные слушатели на попапы
export const setModalListeners = (modalElement) => {
  const buttonCloseModal = modalElement.querySelector(".popup__close");

  // Закрытие по кнопке
  buttonCloseModal.addEventListener("click", () => closeModal(modalElement));

  // Закрытие по клику на оверлей
  modalElement.addEventListener("click", (event) => {
    if (event.target === modalElement) {
      closeModal(modalElement);
    }
  });
};
