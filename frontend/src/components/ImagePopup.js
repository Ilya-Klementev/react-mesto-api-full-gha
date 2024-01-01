function ImagePopup({ card, onClose, handleOverlayClick }) {

  return (
    <section className={`popup popup_type-image ${card ? "popup_opened" : ""}`} onClick={handleOverlayClick}>
      <div className="popup__container popup__container_type_image">
        <button className="popup__close" type="button" onClick={onClose}></button>
        {card && (
          <>
            <img className="popup__image" src={card.link} alt={card.name}/>
            <p className="popup__caption">{card.name}</p>
          </>
        )}
      </div>
    </section>
  );
}

export default ImagePopup