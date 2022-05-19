import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useState, useEffect } from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import PopupWithForm from "./PopupWithForm.js";
import ImagePopup from "./ImagePopup.js";
import Footer from "./Footer.js";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/auth.js';
import InfoTooltip from './InfoTooltip';
import InfoTooltipLogin from './InfoTooltipLogin';


function App() {
  
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isInfoPopupOpen, setInfoPopupOpen] = useState(false);
  const [isInfoLoginPopupOpen, setInfoLoginPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isReg, setIsReg] = useState(false);
  const [email, setEmail] = useState('');
  const history = useHistory();

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard({
      isOpened: true,
      name: card.name,
      link: card.link,
    });
  };

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setInfoLoginPopupOpen(false);
    setSelectedCard({ ...selectedCard, isOpened: false });
  }

  useEffect(() => {
    handleTokenCheck();
    if (loggedIn) {
      Promise.all([api.editProfile(), api.getCards()])
        .then(([userData, cardData]) => {
          setCurrentUser(userData);
          setCards(cardData);
        })
        .catch((err) => console.log(`Ошибка ${err}`))
        .finally(() => {});
    }
  }, [loggedIn]);

  useEffect(() => {
    api
      .getProfile()
      .then((res) => setCurrentUser(res))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .getCards()
      .then((cards) => setCards(cards))
      .catch((err) => console.log(err));
  }, []);

  function handleCardLike(card) {
    
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    
    const changeLikeCardStatus = !isLiked
      ? api.addLike(card._id)
      : api.deleteLike(card._id);
    changeLikeCardStatus
      .then((newCard) => {
        setCards((item) => item.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => console.log(`Ошибка ${err}`));
  }

  const handleCardDelete = (card) => {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => {});
  };

  const handleUpdateUser = (name, about) => {
    api
      .editProfile(name, about)
      .then((item) => {
        setCurrentUser(item);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => {});
  };
  const handleEditAvatar = (avatar) => {
    api
      .editAvatar(avatar.avatar)
      .then((item) => {
        setCurrentUser(item);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => {});
  };
  const handleAddPlaceSubmit = (name, link) => {
    api
      .addCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => {});
  };

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleRegistrSubmit(email, password) {
    auth.register(email, password)
      .then((data) => {
        setInfoPopupOpen(true);
        setIsReg(true);
        history.push('/sign-in');
      })
      .catch((err) => {
        console.log(err);
        setInfoPopupOpen(false);
        setIsReg(false);
      });
  }

  function handleLoginSubmit(email, password) {
    auth.authorize(email, password)
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        setEmail(email);
        handleLogin();
        history.push('/');
      })
      // .catch((err) => {
      //   setInfoLoginPopupOpen(true);
      //   console.log(err)
      // });
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => {});
      
  }

  function handleExit() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    history.push('/sign-in');
  }

  function handleTokenCheck() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.checkToken(jwt)
        .then((res) => {
          handleLogin();
          history.push('/');
          setEmail(res.data.email);
        })
    }
  }

  return (
    
    <div className="page">
    <CurrentUserContext.Provider value={currentUser}>
      
        <Header email={email} onExit={handleExit} />

        <Switch>

        <ProtectedRoute
          exact
         path="/"
          loggedIn={loggedIn}
          component={Main}
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          cards={cards}
          onCardDelete={handleCardDelete}
        />
        <Route path="/sign-in">
            <Login
              handleLogin={handleLogin}
              onSubmit={handleLoginSubmit}
            />
          </Route>

          <Route path="/sign-up">
            <Register
              handleLogin={handleLogin}
              onSubmit={handleRegistrSubmit}
            />
          </Route>
        </Switch>

        <InfoTooltip
          isOPen={isInfoPopupOpen}
          onClose={closeAllPopups}
          isReg={isReg} 
          okText='Вы успешно зарегистрировались!'
          errText='Что-то пошло не так! Попробуйте ещё раз.'
        />

        <InfoTooltipLogin
          isOPen={isInfoLoginPopupOpen}
          onClose={closeAllPopups}
          isLog={loggedIn}
          errText='Что-то пошло не так! Попробуйте ещё раз.'
           />
          {loggedIn && <Footer />}

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser} />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleEditAvatar}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

     
        <PopupWithForm
          name="formDelete"
          title="Вы уверены?"
          id="popup__form popup__form_add"
          formName="formDelete"
          buttonText="Да"
          onClose={closeAllPopups}
        >
          <input name="formDelete" className="popup__form popup__form_add" />
        </PopupWithForm>

    
        <ImagePopup selectedCard={selectedCard} onClose={closeAllPopups} />
   
    </CurrentUserContext.Provider>
    </div>
  );
}

export default App;