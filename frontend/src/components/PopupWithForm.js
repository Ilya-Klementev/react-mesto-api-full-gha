function PopupWithForm(props) {

  const {name, isOpen, handleOverlayClick, onClose, title, onSubmit, children, buttonText} = props;
  
  return (
    <div className={ `popup popup_type-${name} ${isOpen  ? "popup_opened" : ""}`} onClick={handleOverlayClick}>
      <div className="popup__container">
        <button className="popup__close" type="button" onClick={onClose}></button>
        <h2 className="popup__title">{title}</h2>
        <form className="popup__form" name={`form-popup-${name}`} onSubmit={onSubmit} noValidate>
          {children}
          <button className="popup__submit" type="submit" name="button-submit">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
export default PopupWithForm