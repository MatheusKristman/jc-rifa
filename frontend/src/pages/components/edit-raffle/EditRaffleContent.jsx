import React from 'react';

import NumberBuyedBox from './NumberBuyedBox';
import DefaultPrize from '../../../assets/default-prize.jpg';

const EditRaffleContent = () => {
  return (
    <div className="edit-raffle__content">
      <div className="edit-raffle__content__container">
        <h1 className="edit-raffle__content__container__title">
          Estatisticas
        </h1>

        <div className="edit-raffle__content__container__statistics-wrapper">
          <div className="edit-raffle__content__container__statistics-wrapper__progress-bar">
            <div className="edit-raffle__content__container__statistics-wrapper__progress-bar__bar" style={{width: '10%'}}>10%</div>
          </div>

          <div className="edit-raffle__content__container__statistics-wrapper__numbers-buyed">
            <NumberBuyedBox />
            <NumberBuyedBox />
            <NumberBuyedBox />
            <NumberBuyedBox />
            <NumberBuyedBox />
          </div>

          <textarea className="edit-raffle__content__container__statistics-wrapper__remaining-numbers" value="18000 30000 80506 86472" readOnly />
        </div>

        <h1 className="edit-raffle__content__container__title">
          Editar Rifa
        </h1>

        <form className="edit-raffle__content__container__form">
          <label
            htmlFor="raffleImage"
            className="edit-raffle__content__container__form__image-label"
          >
            <div className="edit-raffle__content__container__form__image-label__image-box">
              <img
                src={DefaultPrize}
                alt="Perfil"
                className="edit-raffle__content__container__form__image-label__image-box__image"
              />
            </div>

            <input
              type="file"
              name="raffleImage"
              id="raffleImage"
              // onChange={handleFileChange}
              className="edit-raffle__content__container__form__image-label__input"
            />
          </label>

          <div className="edit-raffle__content__container__form__inputs-box">
            <label
              htmlFor="title"
              className="edit-raffle__content__container__form__inputs-box__label"
            >
              Título
              <input
                type="text"
                name="title"
                id="title"
                // value={title}
                // onChange={setTitle}
                className="edit-raffle__content__container__form__inputs-box__label__input"
              />
            </label>

            <label
              htmlFor="subtitle"
              className="edit-raffle__content__container__form__inputs-box__label"
            >
              Subtítulo
              <input
                type="text"
                name="subtitle"
                id="subtitle"
                // value={subtitle}
                // onChange={setSubtitle}
                className="edit-raffle__content__container__form__inputs-box__label__input"
              />
            </label>

            <label
              htmlFor="description"
              className="edit-raffle__content__container__form__inputs-box__label"
            >
              Descrição
              <textarea
                id="description"
                name="description"
                // value={description}
                // onChange={setDescription}
                className="edit-raffle__content__container__form__inputs-box__label__textarea"
              />
            </label>

            <label
              htmlFor="price"
              className="edit-raffle__content__container__form__inputs-box__label"
            >
              Preço por números
              <input
                type="text"
                name="price"
                id="price"
                // value={price}
                // onChange={(e) => setPrice(coinMask(e))}
                className="edit-raffle__content__container__form__inputs-box__label__input"
              />
            </label>

            <label
              htmlFor="raffleNumbers"
              className="edit-raffle__content__container__form__inputs-box__label"
            >
              Quantidade de Números
              <select
                name="raffleNumbers"
                id="raffleNumbers"
                // value={raffleNumbers}
                // onChange={setRaffleNumbers}
                className="edit-raffle__content__container__form__inputs-box__label__select"
              >
                <option>-- Selecionar --</option>
                {/* {numbersOptions.map((numbers, index) => (
                  <option key={`number-${index}`} value={numbers}>
                    {numbers}
                  </option>
                ))} */}
              </select>
            </label>
          </div>

          <button type="submit" className="edit-raffle__content__container__form__submit-btn">
            Salvar
          </button>
        </form>

        <h1 className="edit-raffle__content__container__title">
          Finalizar rifa
        </h1>

        <div className="edit-raffle__content__container__finish-raffle-container">

          <input type="text" placeholder="Insira número sorteado" className="edit-raffle__content__container__finish-raffle-container__input" />

          <button type="button" className="edit-raffle__content__container__finish-raffle-container__btn">
            Finalizar
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditRaffleContent;
