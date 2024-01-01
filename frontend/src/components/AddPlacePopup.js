import React, { useEffect, useState } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
  const [place, setPlace] = useState("");
  const [link, setLink] = useState("");
  const {isOpen, onClose, handleOverlayClick, onUpdateCards} = props;

  useEffect(() => {
      setPlace("");
      setLink("");
  }, [isOpen]);

  function handleSubmit (e) {
    e.preventDefault();
    onUpdateCards({ 
      place, 
      link 
    });
  }

  function handlePlace(e) {
    setPlace(e.target.value);
  }

  function handleLink(e) {
    setLink(e.target.value);
  }

  return (
    <PopupWithForm 
      name = {'add'} 
      isOpen = {isOpen}
      title = {'Новое место'} 
      onClose = {onClose}
      handleOverlayClick = {handleOverlayClick}
      buttonText = {'Создать'}
      onSubmit = {handleSubmit}
    >
     <>
        <input
          className="popup__input popup__input_element_place"
          placeholder="Название"
          type="text"
          name="place"
          required
          minLength="2"
          maxLength="30"
          onChange={handlePlace}
          value={place}
        />
        <div>
          <span className="popup__error" id="place-error"></span>
        </div>
        <input
          className="popup__input popup__input_element_link"
          placeholder="Ссылка на картинку"
          type="url"
          name="link"
          required
          onChange={handleLink}
          value={link}
        />
        <div>
          <span className="popup__error" id="link-error"></span>
        </div>
      </>
    </PopupWithForm>
  );
}

export default AddPlacePopup