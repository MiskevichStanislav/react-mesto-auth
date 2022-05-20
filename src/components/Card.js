import React,{ useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";


function Card({ card, onCardClick, onCardLike, onCardDelete }) {

  const handleClick = () => {
    onCardClick(card);
  };

  const handleLikeClick = () => {

    onCardLike(card);
  };

  const handleDeleteClick = () => {
    onCardDelete(card);
  };

  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;

  const isLiked = card.likes.some((i) => i._id === currentUser._id);


  const cardLikeButtonClassName = `pictures__like ${isLiked && "pictures__like_active"}`;

  return (

    <li className="pictures__item">
      <button
        onClick={handleDeleteClick}
        className='pictures__delete'
        style={isOwn ? { visibility: "visible" } : { visibility: "hidden" }}
        type="button"
        aria-label="удалить">

      </button>

      <img className="pictures__images"
        alt={card.name}
        src={card.link}
        onClick={handleClick}
      />
      <div className="pictures__description">
        <h2 className="pictures__title">{card.name}</h2>
        <div className="pictures__like-box">
          <button
            onClick={handleLikeClick}
            className={cardLikeButtonClassName}
            type="button"
          >
          </button>
          <span className="pictures__like-count">{card.likes.length}</span>
        </div>
      </div>
    </li>

  );
}

export default Card;