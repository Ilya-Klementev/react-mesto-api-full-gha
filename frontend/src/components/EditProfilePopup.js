import React, { useContext, useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from '../contexts/CurrentUserContext.js'

function EditProfilePopup(props) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const {isOpen, onClose, onUpdateUser, handleOverlayClick} = props;

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [currentUser, isOpen]);

  function handleName(e) {
    setName(e.target.value);
  }

  function handleDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit (e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm 
      name = {'edit'} 
      isOpen = {isOpen}
      title = {'Редактировать профиль'} 
      onClose = {onClose}
      handleOverlayClick = {handleOverlayClick}
      buttonText = {'Сохранить'}
      onSubmit = {handleSubmit}
      >
      <>
        <input
          onChange={handleName}
          className="popup__input popup__input_element_name"
          placeholder="Имя"
          type="text"
          name="name"
          required
          minLength="2"
          maxLength="40"
          value={name}
        />
        <div>
          <span className="popup__error" id="name-error"></span>
        </div>
        <input
          onChange={handleDescription}
          className="popup__input popup__input_element_about"
          placeholder="О себе"
          type="text"
          name="about"
          required
          minLength="2"
          maxLength="200"
          value={description}
        />
        <div>
          <span className="popup__error" id="about-error"></span>
        </div>
      </>
    </PopupWithForm>
  );
}
export default EditProfilePopup