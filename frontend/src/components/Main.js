import React, { useContext } from 'react';
import Card from './Card.js'
import { CurrentUserContext } from '../contexts/CurrentUserContext.js'

function Main({ cards, onEditAvatar, onEditProfile, onAddPlace, onCardClick, onCardLike, onCardDelete }) {

  const { name, about, avatar } = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div 
          className="profile__avatar-container" 
          style={{ backgroundImage: `url(${avatar})` }} 
          onClick={ onEditAvatar }>
        </div>
        <div className="profile__info">
          <div className="profile__container">
            <h1 className="profile__name">{name}</h1>
            <button 
              className="profile__edit-button" 
              type="button" 
              onClick={ onEditProfile }>
            </button>
          </div>
          <h2 className="profile__about">{about}</h2>
        </div>
        <button 
          className="profile__add-button" 
          type="button" 
          onClick={ onAddPlace }></button>
      </section>

      <section className="elements">
        {cards.map((card) => (
          <Card 
            key={card._id}
            card={card}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </section>
     
    </main>
  )
}

export default Main