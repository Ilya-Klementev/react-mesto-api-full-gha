import React, { createRef, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const avatar = createRef();
  const {isOpen, onClose, handleOverlayClick, onUpdateAvatar} = props;

  useEffect(() => {
    avatar.current.value = "";
  }, [isOpen]); 

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatar.current.value
    });
  }

  return (
    <PopupWithForm 
      name = {'avatar'} 
      isOpen = {isOpen}
      title = {'Обновить аватар'} 
      onClose = {onClose}
      handleOverlayClick = {handleOverlayClick}
      buttonText = {'Сохранить'}
      onSubmit = {handleSubmit}
    >
    <>
        <input
          className="popup__input popup__input_element_link"
          placeholder="Ссылка на картинку"
          type="url"
          name="picture"
          required
          ref={avatar}
        />
        <div>
          <span className="popup__error" id="picture-error"></span>
        </div>
      </>
    </PopupWithForm>
  );
}

export default EditAvatarPopup