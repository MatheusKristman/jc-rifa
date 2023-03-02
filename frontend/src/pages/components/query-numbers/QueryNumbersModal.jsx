import React, { useRef } from 'react'
import useQueryNumbersStore from '../../../stores/useQueryNumbersStore';

const QueryNumbersModal = () => {
  const closeModal = useQueryNumbersStore((state) => state.closeModal);

  const overlayRef = useRef();
  const boxRef = useRef();

  const handleSearch = (e) => {
    e.preventDefault();
    overlayRef.current.style.animation = "loginFadeOut 0.4s ease forwards";
    boxRef.current.style.animation = "loginBoxOut 0.4s ease forwards";

    setTimeout(() => {
      closeModal();
    }, 400)
  }

  const handleCloseModalOnOverlay = (e) => {
    if (e.target.classList.contains('query-numbers__query-numbers-modal-overlay')) {
      overlayRef.current.style.animation = "loginFadeOut 0.4s ease forwards";
      boxRef.current.style.animation = "loginBoxOut 0.4s ease forwards";
      
      setTimeout(() => {
        closeModal();
      }, 400);
    }
  }

  return (
    <div ref={overlayRef} onClick={handleCloseModalOnOverlay} className="query-numbers__query-numbers-modal-overlay">
      <div ref={boxRef} className="query-numbers__query-numbers-modal-overlay__box">
        <div className="query-numbers__query-numbers-modal-overlay__box__container">
          <h3 className="query-numbers__query-numbers-modal-overlay__box__container__title">
            Buscar compras
          </h3>

          <form className="query-numbers__query-numbers-modal-overlay__box__container__form">
            <label htmlFor="queryNumber" className="query-numbers__query-numbers-modal-overlay__box__container__form__label">
              Informe seu CPF

              <input type="text" autoComplete='off' autoCorrect='off' name="queryNumber" id="queryNumber" className="query-numbers__query-numbers-modal-overlay__box__container__form__label__input" />
            </label>

            <button type="button" onClick={handleSearch} className="query-numbers__query-numbers-modal-overlay__box__container__form__submit-btn">
              Buscar compras
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default QueryNumbersModal;
