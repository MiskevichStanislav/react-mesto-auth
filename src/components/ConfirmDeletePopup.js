import React from "react";

import PopupWithForm from "./PopupWithForm";

function ConfirmDeletePopup({ isOpen, isConfirm, card, onClose }) {
  function handleSubmit(event) {
    event.preventDefault();
    isConfirm(card);
  }
  return (
   <PopupWithForm
          name="formDelete"
          title="Вы уверены?"
          id="popup__form popup__form_add"
          formName="formDelete"
          buttonText="Да"
          onClose={onClose}
          isOpen={isOpen}
          onSubmit={handleSubmit}
        >
          
        </PopupWithForm>
  )
}

export default ConfirmDeletePopup; 