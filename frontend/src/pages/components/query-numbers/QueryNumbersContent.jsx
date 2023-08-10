import React, { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { FiAlertTriangle } from "react-icons/fi";
import { shallow } from "zustand/shallow";

import DefaultPrize from "../../../assets/default-prize.jpg";
import Loading from "../Loading";
import useQueryNumbersStore from "../../../stores/useQueryNumbersStore";
import useRaffleStore from "../../../stores/useRaffleStore";
import useGeneralStore from "../../../stores/useGeneralStore";
import useUserStore from "../../../stores/useUserStore";
import api from "../../../services/api";

const QueryNumbersContent = () => {
  const {
    openModal,
    userRafflesBuyed,
    setUserRafflesBuyed,
    rafflesImagesUrls,
    setRafflesImagesUrls,
  } = useQueryNumbersStore(
    (state) => ({
      openModal: state.openModal,
      userRafflesBuyed: state.userRafflesBuyed,
      setUserRafflesBuyed: state.setUserRafflesBuyed,
      rafflesImagesUrls: state.rafflesImagesUrls,
      setRafflesImagesUrls: state.setRafflesImagesUrls,
    }),
    shallow,
  );
  const {
    isLoading,
    setToLoad,
    setNotToLoad,
    setToAnimateFadeIn,
    setToAnimateFadeOut,
  } = useGeneralStore(
    (state) => ({
      isLoading: state.isLoading,
      setToLoad: state.setToLoad,
      setNotToLoad: state.setNotToLoad,
      setToAnimateFadeIn: state.setToAnimateFadeIn,
      setToAnimateFadeOut: state.setToAnimateFadeOut,
    }),
    shallow,
  );
  const { isUserLogged, user } = useUserStore(
    (state) => ({
      isUserLogged: state.isUserLogged,
      user: state.user,
    }),
    shallow,
  );
  const { raffles, setRaffles } = useRaffleStore(
    (state) => ({
      raffles: state.raffles,
      setRaffles: state.setRaffles,
    }),
    shallow,
  );

  const [rafflesConcluded, setRafflesConcluded] = useState([]);

  useEffect(() => {
    setRaffles([]);
    setUserRafflesBuyed([]);

    if (isUserLogged) {
      setToLoad();
      setToAnimateFadeIn();

      api
        .get(`/account/get-raffle-numbers/${user.cpf}`)
        .then((res) => {
          setUserRafflesBuyed(res.data);

          const rafflesFromUser = res.data;
          const urls = [];

          for (let i = 0; i < rafflesFromUser.length; i++) {
            if (rafflesFromUser[i].raffleImage) {
              if (
                JSON.stringify(import.meta.env.MODE) ===
                JSON.stringify("development")
              ) {
                urls.push(
                  `${import.meta.env.VITE_API_KEY_DEV}${
                    import.meta.env.VITE_API_PORT
                  }/raffle-uploads/${rafflesFromUser[i].raffleImage}`,
                );
              } else {
                urls.push(
                  `${import.meta.env.VITE_API_KEY}/raffle-uploads/${
                    rafflesFromUser[i].raffleImage
                  }`,
                );
              }
            } else {
              urls.push(null);
            }
          }

          setRafflesImagesUrls(urls);
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setToAnimateFadeOut();

          setTimeout(() => {
            setNotToLoad();
          }, 400);
        });

      api
        .get(`winner/get-all-winners`)
        .then((res) => setRafflesConcluded(res.data))
        .catch((error) => console.error(error));
    } else {
      openModal();
    }
  }, [setRaffles, setUserRafflesBuyed]);

  return (
    <div className="query-numbers__query-numbers-content">
      {isLoading && <Loading>Buscando números</Loading>}
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
              key={raffle.id}
              className="query-numbers__query-numbers-content__container__raffle-box"
            >
              <div className="query-numbers__query-numbers-content__container__raffle-box__image-box">
                <img
                  src={rafflesImagesUrls[index] || DefaultPrize}
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
                    raffle.numbersBuyed.includes(
                      rafflesConcluded[index]?.raffleNumber,
                    ) || raffles[index]?.isFinished
                      ? "query-numbers__query-numbers-content__container__raffle-box__info-box__status-finished"
                      : "query-numbers__query-numbers-content__container__raffle-box__info-box__status"
                  }
                >
                  {raffle.numbersBuyed.includes(
                    rafflesConcluded[index]?.raffleNumber,
                  )
                    ? "Rifa Ganha! Aguarde contato"
                    : raffles[index]?.isFinished
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
