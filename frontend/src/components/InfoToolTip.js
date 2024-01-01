import successImage from "../images/success.png";
import errorImage from "../images/error.png";

const InfoToolTip = ({ isOpen, onClose, dataRegister, handleOverlayClick }) => {
  const { isRegister, message } = dataRegister;
  
  return (
    <div className={`popup ${isOpen && "popup_opened"}`} onClick={handleOverlayClick}>
      <div className="popup__container" style={{ textAlign: "center" }}>
        <button className="popup__close" onClick={onClose} type="button"></button>
        <img 
          className="popup__icon" 
          src={isRegister ? successImage : errorImage}/>
        <h3 className="popup__title" style={{ marginBottom: 60 }}>{message}</h3>
      </div>
    </div>
  );
};

export default InfoToolTip;
