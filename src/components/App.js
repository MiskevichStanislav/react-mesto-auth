import React, { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import Header from "./Header.js";
import Main from "./Main.js";
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
import ConfirmDeletePopup from './ConfirmDeletePopup';


function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = useState(false);
  const [isDeleteCard, setIsDeleteCard] = useState({});
  const [isInfoPopupOpen, setInfoPopupOpen] = useState(false);
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

  const handleDeleteCardClick = () => {
    setIsConfirmDeletePopupOpen(true);
  };

  const updateDeleteCard = (card) => {
    setIsDeleteCard(card);
    handleDeleteCardClick();
  };
  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard ||
    isInfoPopupOpen ||
    isConfirmDeletePopupOpen;

  useEffect(() => {
    function closeByEscape(event) {
      if (event.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleOverley(event) {
      if (event.target.classList.contains('popup_open') || event.target.classList.contains('popup__close')) {
        closeAllPopups();
      }
    };
    document.addEventListener("mousedown", handleOverley);
    return () => document.removeEventListener("mousedown", handleOverley);
  }, [isOpen]);

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setInfoPopupOpen(false);
    setIsConfirmDeletePopupOpen(false);
    setSelectedCard({ ...selectedCard, isOpened: false });
  }

  useEffect(() => {
    handleTokenCheck();
    if (loggedIn) {
      Promise.all([api.getProfile(), api.getCards()])
        .then(([userData, cardData]) => {
          setCurrentUser(userData);
          setCards(cardData);
        })
        .catch((err) => console.log(`Ошибка ${err}`))
        .finally(() => { });
    }
  }, [loggedIn]);

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
      .finally(() => { });
  };

  const handleUpdateUser = (name, about) => {
    api
      .editProfile(name, about)
      .then((item) => {
        setCurrentUser(item);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => { });
  };
  const handleEditAvatar = (avatar) => {
    api
      .editAvatar(avatar.avatar)
      .then((item) => {
        setCurrentUser(item);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => { });
  };
  const handleAddPlaceSubmit = (name, link) => {
    api
      .addCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => { });
  };
  function handleLogin() {
    setLoggedIn(true);
  }
  

  function handleRegistrSubmit(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          setInfoPopupOpen(true);
          setIsReg(true);
          history.push('/sign-in');
        } else {
          setInfoPopupOpen(true);
          setIsReg(false);
          console.log('else')
        }
      })
      .catch((err) => {
        setInfoPopupOpen(true);
        console.log(`Ошибка входа ${err}`)
        setIsReg(false);
      })
  }

  function handleLoginSubmit(email, password) {
    auth.authorize(email, password)
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        setEmail(email);
        handleLogin();
        history.push('/');
      })
      .catch((err) => {
        setInfoPopupOpen(true);
        console.log(`Ошибка входа ${err}`)
        setIsReg(false);
      })
      .finally(() => { });

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
            onCardDelete={updateDeleteCard}
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
          isReg={isReg}
        />

        {loggedIn && <Footer />}

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onUpdateUser={handleUpdateUser} />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onUpdateAvatar={handleEditAvatar}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onAddPlace={handleAddPlaceSubmit}
        />
        <ConfirmDeletePopup
          isOpen={isConfirmDeletePopupOpen}
          card={isDeleteCard}
          isConfirm={handleCardDelete}
        />
        <ImagePopup selectedCard={selectedCard}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;