import ok from '../images/ok.svg';
import error from '../images/error.svg';


function InfoTooltip({ isOPen, onClose, isReg, okText, errText }) {
    return (
        
        <div className={isOPen ? 'popup popup_open' : 'popup'}>
            <div className="popup__container">
                <img
                    className='popup__info-icon'
                    src={isReg ? ok : error}
                    alt='результат регистрации'
                />
                <p className='popup__info-text'>{isReg ? okText : errText}</p>
                <button
                    type="button"
                    className="popup__close"
                    onClick={onClose}
                />
            </div>
        </div>
    )
}

// function InfoTooltip({ isOPen, onClose, isReg, okText, errText  }) {
//     return (
//       <Popup isOpen={isOpen} name={name} onClose={onClose}>
//           <img
//             src={isReg ? ok : error}
//             alt={
//                'Регистрация прошла успешно' : 'Регистрация не прошла'
//             }
//             className="popup__info-icon"
//           />
//           <h3 className="popup__signup-title">
//             {isSuccess
//               ? 'Вы успешно зарегистрировались!'
//               : 'Что-то пошло не так! Попробуйте ещё раз.'}
//           </h3>
//        </Popup>
//     );
//   };

export default InfoTooltip;