import React from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { FiAlertTriangle } from "react-icons/fi";
import { shallow } from "zustand/shallow";

import DefaultPrize from "../../../assets/default-prize.jpg";
import useQueryNumbersStore from "../../../stores/useQueryNumbersStore";
import _arrayBufferToBase64 from "../../../hooks/useArrayBufferToBase64";

const QueryNumbersContent = () => {
  const { openModal, userRafflesBuyed } = useQueryNumbersStore(
    (state) => ({
      openModal: state.openModal,
      userRafflesBuyed: state.userRafflesBuyed,
    }),
    shallow
  );

  return (
    <div className="query-numbers__query-numbers-content">
      <div className="query-numbers__query-numbers-content__container">
        <div className="query-numbers__query-numbers-content__container__above">
          <h1 className="query-numbers__query-numbers-content__container__above__title">
            🛒 Meus números
          </h1>

          <button
            onClick={openModal}
            className="query-numbers__query-numbers-content__container__above__search-btn"
          >
            <HiOutlineSearch /> Buscar
          </button>
        </div>

        {userRafflesBuyed.length !== 0 ? (
          userRafflesBuyed.map((raffle) => (
            <div className="query-numbers__query-numbers-content__container__raffle-box">
              <div className="query-numbers__query-numbers-content__container__raffle-box__image-box">
                <img
                  src={
                    raffle.raffleImage.data
                      ? `data:${
                          raffle.raffleImage.contentType
                        };base64,${_arrayBufferToBase64(raffle.raffleImage.data.data)}`
                      : DefaultPrize
                  }
                  alt="Rifa"
                  className="query-numbers__query-numbers-content__container__raffle-box__image-box__image"
                />
              </div>

              <div className="query-numbers__query-numbers-content__container__raffle-box__info-box">
                <h3 className="query-numbers__query-numbers-content__container__raffle-box__info-box__title">
                  {raffle.title}
                </h3>

                <span className="query-numbers__query-numbers-content__container__raffle-box__info-box__status">
                  {raffle.status}
                </span>

                <div className="query-numbers__query-numbers-content__container__raffle-box__info-box__numbers-box">
                  Números: 
                  <span className="query-numbers__query-numbers-content__container__raffle-box__info-box__numbers-box__numbers">
                    {raffle.numbersBuyed.map((number) => " " + number)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="query-numbers__query-numbers-content__container__alert-box">
            <FiAlertTriangle /> Faça sua busca{" "}
            <button type="button" onClick={openModal}>
              clicando aqui
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryNumbersContent;
