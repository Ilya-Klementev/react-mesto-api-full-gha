import React, { useState , useEffect} from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Header from './Header.js'
import Main from './Main.js'
import Footer from './Footer.js'
import ImagePopup from './ImagePopup.js'
import { CurrentUserContext } from '../contexts/CurrentUserContext.js'
import { api } from '../utils/Api.js'
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Register from './Register.js';
import Login from './Login.js';
import ProtectedRoute from './ProtectedRoute.js';
import InfoToolTip from './InfoToolTip.js';
import { auth }  from '../utils/Auth.js';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
  const [infoRegister, setInfoRegister] = useState({});

  useEffect(() => {
    handleTokenCheck();
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userData, cards]) => {
          setCurrentUser({ ...currentUser, ...userData });
          setCards(cards);
        })
        .catch((err) => {
          console.log(`Ошибка получения данных пользователя/карточек: ${err}`);
        });
    }
  }, [loggedIn]);

  function handleTokenCheck() { 
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .getUser(jwt)
        .then(({ data }) => {
          auth.setHeadersAuth(jwt);
          setCurrentUser({ ...currentUser, ...data });
          setLoggedIn(true);
        })
        .catch((err) =>
          console.log(`Ошибка авторизации пользователя: ${err}`)
        );
    }
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);
    api.changelikeCard(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(`Ошибка лайка: ${err}`);
      });
  } 

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(`Ошибка удаления карточки: ${err}`);
      });
  } 

  function handleUpdateUser(userData) {
    api.patchUserInfo(userData)
    .then((updatedData) => {
      setCurrentUser({ ...currentUser, ...updatedData });
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка обновления данных пользователя: ${err}`);
    });
  } 

  function handleUpdateAvatar({ avatar }) {
    api.patchAvatar(avatar)
      .then((updatedData) => {
        setCurrentUser({ ...currentUser, ...updatedData });
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка обновления аватара пользователя: ${err}`);
      });
  }

  function handleAddPlace (card) {
    api.postCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка добавления карточки: ${err}`);
      });
  }

  function closeAllPopups() {
    setIsOpenPopup(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
    setIsInfoToolTipOpen(false);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function onEditProfile() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
    setIsOpenPopup(!isEditProfilePopupOpen);
  }

  function onAddPlace() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
    setIsOpenPopup(!isAddPlacePopupOpen);
  }

  function onEditAvatar() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
    setIsOpenPopup(!isEditAvatarPopupOpen);
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      closeAllPopups();
    }
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        closeAllPopups();
      }
    };

    if (isOpenPopup || selectedCard || isInfoToolTipOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpenPopup, selectedCard, isInfoToolTipOpen]);

  function handleRegistration(e, data, navigate) {
    e.preventDefault();
    auth
      .registration(data)
      .then(({ email }) => {
        setCurrentUser({ ...currentUser, email });
        setInfoRegister({ isRegister: true, message: "Вы успешно зарегистрировались!" });
        setIsInfoToolTipOpen(true);
        navigate();
      })
      .catch(() => {
        setIsInfoToolTipOpen(true);
        setInfoRegister({ isRegister: false, message: "Что-то пошло не так! Попробуйте ещё раз." });
      });
  } 

  function handleAuthorization(e, data) {
    e.preventDefault();
    auth
      .authorization(data)
      .then(({ token }) => {
        localStorage.setItem("jwt", token);
        auth.setHeadersAuth(token);
        handleTokenCheck();
      })
      .catch(() => { 
      setIsInfoToolTipOpen(true);
      setInfoRegister({ isRegister: false, message: "Что-то пошло не так! Попробуйте ещё раз." });
      });
  }

  function handleExitProfile() {
    localStorage.removeItem("jwt");
    auth.setHeadersAuth("");
    setCurrentUser({});
    setLoggedIn(false);
  }

  const propsMainComponent = {
    cards: cards,
    onEditAvatar: onEditAvatar,
    onEditProfile: onEditProfile,
    onAddPlace: onAddPlace,
    onCardClick: handleCardClick,
    onCardLike: handleCardLike,
    onCardDelete: handleCardDelete,
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <BrowserRouter>
          <Header loggedIn = {loggedIn} onExitProfile={handleExitProfile}/>
          <Routes>
            <Route path="*" element={loggedIn ? <Navigate to="/" /> : <Navigate to="/signup" />} />
            <Route path="/" element={<ProtectedRoute Component={Main} {...propsMainComponent} loggedIn={loggedIn}/>} />
            <Route path="/signin" element={loggedIn ? <Navigate to="/" /> : <Login onSubmit={handleAuthorization}/>}/>
            <Route path="/signup" element={loggedIn ? <Navigate to="/" /> : <Register onSubmit={handleRegistration}/>}/>
          </Routes>
        </BrowserRouter>
        <Footer />

        <EditProfilePopup 
          isOpen = {isEditProfilePopupOpen} 
          onClose = {closeAllPopups}
          onUpdateUser = {handleUpdateUser}
          handleOverlayClick = {handleOverlayClick}
        />
        
        <EditAvatarPopup 
          isOpen = {isEditAvatarPopupOpen} 
          onClose = {closeAllPopups}
          handleOverlayClick = {handleOverlayClick}
          onUpdateAvatar = {handleUpdateAvatar}
        />

        <AddPlacePopup 
          isOpen = {isAddPlacePopupOpen} 
          onClose = {closeAllPopups}
          handleOverlayClick = {handleOverlayClick}
          onUpdateCards = {handleAddPlace}
        />

        <ImagePopup
          card = {selectedCard}
          onClose = {closeAllPopups}
          handleOverlayClick = {handleOverlayClick}
        />
        
        <InfoToolTip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          dataRegister={infoRegister}
          handleOverlayClick = {handleOverlayClick}
        />
        </div>
      </CurrentUserContext.Provider>
  );
}

export default App;
