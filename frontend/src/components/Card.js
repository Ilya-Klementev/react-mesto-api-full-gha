import React, { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const { _id } = useContext(CurrentUserContext);
  const isOwn = card.owner === _id;
  const isLiked = card.likes.some(i => i === _id);
  const cardLikeButtonClassName = (`elements__heart ${isLiked && 'elements__heart_liked'}`);

  function handleClick() {
    onCardClick(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  return (
    <article className="elements__element">
    {isOwn && <button type="button" className="elements__trash" onClick={handleDeleteClick} />} 
    <img className="elements__photo" src={card.link} alt={card.name} onClick={handleClick}/>
    <div className="elements__place">
      <h2 className="elements__title">{card.name}</h2>
      <div>
        <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
        <p className="elements__like-count">{card.likes.length}</p>
      </div>
    </div>
  </article>
  );
}
export default Card;
