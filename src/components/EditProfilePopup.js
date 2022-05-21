import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onUpdateUser }) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDetailChange(e) {
    setDescription(e.target.value);
  }

  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleSubmit(e) {
    
    e.preventDefault();

    
    onUpdateUser( name, description );
  }

  return (
    <PopupWithForm
      name="formEdit"
      isOpen={isOpen}
      title="Редактировать профиль"
      formName="formEdit"
      buttonText="Сохранить"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        id="name-input"
        name="name"
        className="popup__input popup__input-name"
        placeholder="Имя"
        minLength="2"
        maxLength="40"
        required
        value={ name || ''}
        onChange={handleNameChange}
      />
      <span className="name-input-error popup__error"></span>
      <input
        type="text"
        id="detail-input"
        name="detail"
        className="popup__input popup__input-detail"
        placeholder="О себе"
        minLength="2"
        maxLength="200"
        required
        value={ description || ''}
        onChange={handleDetailChange}
      />
      <span className="detail-input-error popup__error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;