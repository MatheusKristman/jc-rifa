import React, { useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { FiAlertTriangle } from "react-icons/fi";
import { shallow } from "zustand/shallow";

import DefaultPrize from "../../../assets/default-prize.jpg";
import useQueryNumbersStore from "../../../stores/useQueryNumbersStore";
import _arrayBufferToBase64 from "../../../hooks/useArrayBufferToBase64";
import useRaffleStore from "../../../stores/useRaffleStore";

const QueryNumbersContent = () => {
  const { openModal, userRafflesBuyed, rafflesConcluded } = useQueryNumbersStore(
    (state) => ({
      openModal: state.openModal,
      userRafflesBuyed: state.userRafflesBuyed,
      rafflesConcluded: state.rafflesConcluded,
    }),
    shallow
  );

  const { raffles } = useRaffleStore((state) => ({ raffles: state.raffles }));

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
          userRafflesBuyed.map((raffle, index) => (
            <div
              key={raffle._id}
              className="query-numbers__query-numbers-content__container__raffle-box"
            >
              <div className="query-numbers__query-numbers-content__container__raffle-box__image-box">
                <img
                  src={
                    raffle.raffleImage.data
                      ? `data:${raffle.raffleImage.contentType};base64,${_arrayBufferToBase64(
                          raffle.raffleImage.data.data
                        )}`
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

                <span
                  className={
                    raffle.numbersBuyed.includes(rafflesConcluded[index]?.raffleNumber) ||
                    raffles[index]?.isFinished
                      ? "query-numbers__query-numbers-content__container__raffle-box__info-box__status-finished"
                      : "query-numbers__query-numbers-content__container__raffle-box__info-box__status"
                  }
                >
                  {raffle.numbersBuyed.includes(rafflesConcluded[index]?.raffleNumber) ||
                  raffles[index]?.isFinished
                    ? "Concluído"
                    : raffle.status === "approved"
                    ? "Aguarde sorteio"
                    : "Processando"}
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

// TODO loading quando está carregando os números
