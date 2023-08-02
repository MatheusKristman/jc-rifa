import React, { useRef, useEffect, useLayoutEffect } from "react";
import { shallow } from "zustand/shallow";
import { useNavigate } from "react-router-dom";

import {
  PrizeDisplayed,
  Prizes,
  WinnerBox,
  FaqsQuestion,
} from "../../components";
import useHomeFaqStore from "../../../stores/useHomeFaqStore";
import useRaffleStore from "../../../stores/useRaffleStore";
import useWinnerStore from "../../../stores/useWinnerStore";
import NoUserPhoto from "../../../assets/no-user-photo.png";
import DefaultPrize from "../../../assets/default-prize.jpg";
import _arrayBufferToBase64 from "../../../hooks/useArrayBufferToBase64";
import useGeneralStore from "../../../stores/useGeneralStore";

const PrizesHome = () => {
  const { raffles, rafflesImagesUrls } = useRaffleStore(
    (state) => ({
      raffles: state.raffles,
      rafflesImagesUrls: state.rafflesImagesUrls,
    }),
    shallow,
  );

  const { isRaffleLoading } = useGeneralStore(
    (state) => ({
      isRaffleLoading: state.isRaffleLoading,
    }),
    shallow,
  );

  const navigate = useNavigate();

  const convertProgress = (current, total) => {
    return (100 * current) / total;
  };

  return (
    <div className="hero__container__prizes-box">
      <div className="hero__container__prizes-box__above">
        <h1 className="hero__container__prizes-box__above__title">
          ⚡️ Prêmios
        </h1>

        <span className="hero__container__prizes-box__above__desc">
          Escolha sua sorte
        </span>
      </div>

      <div
        onClick={() => navigate(`/raffles/${raffles[0]?._id}`)}
        className="hero__container__prizes-box__prize-displayed-box"
      >
        <PrizeDisplayed
          image={rafflesImagesUrls[0]}
          title={raffles[0]?.title}
          subtitle={raffles[0]?.subtitle}
          progress={convertProgress(
            raffles[0]?.QuantNumbers - raffles[0]?.NumbersAvailable.length,
            raffles[0]?.QuantNumbers,
          )}
          winner={raffles[0]?.isFinished}
        />
      </div>

      {raffles.slice(1, 3).map((raffle, index) => (
        <div
          key={raffle._id}
          onClick={() => navigate(`/raffles/${raffle._id}`)}
          className="hero__container__prizes-box__prizes-available-box"
        >
          <Prizes
            title={raffle.title}
            subtitle={raffle.subtitle}
            image={rafflesImagesUrls[index + 1] || null}
            progress={convertProgress(
              raffle?.QuantNumbers - raffle?.NumbersAvailable.length,
              raffle?.QuantNumbers,
            )}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => navigate("/contact")}
        className="hero__container__prizes-box__contact-btn"
      >
        <div className="hero__container__prizes-box__contact-btn__icon">🤷‍♀️</div>

        <div className="hero__container__prizes-box__contact-btn__infos">
          <span className="hero__container__prizes-box__contact-btn__infos__title">
            Dúvidas
          </span>
          <span
            onClick={() => navigate("/contact")}
            className="hero__container__prizes-box__contact-btn__infos__desc"
          >
            Fale conosco
          </span>
        </div>
      </button>
    </div>
  );
};

const WinnersHome = () => {
  const { winners } = useWinnerStore((state) => ({
    winners: state.winners,
  }));

  const { raffles } = useRaffleStore((state) => ({
    raffles: state.raffles,
  }));

  return (
    <div className="hero__container__winners-box">
      <div className="hero__container__winners-box__above">
        <h1 className="hero__container__winners-box__above__title">
          🎉 Ganhadores
        </h1>

        <span className="hero__container__winners-box__above__desc">
          sortudos
        </span>
      </div>

      <div className="hero__container__winners-box__winners-wrapper">
        {winners.length !== 0 ? (
          winners.map((winner) => (
            <WinnerBox
              key={winner._id}
              profileImage={
                winner.profileImage?.data
                  ? `data:${
                      winner.profileImage.contentType
                    };base64,${_arrayBufferToBase64(
                      winner.profileImage.data.data,
                    )}`
                  : NoUserPhoto
              }
              name={winner.name}
              raffleTitle={winner.raffleTitle}
              raffleNumber={winner.raffleNumber}
              raffleImage={
                winner.raffleImage?.data
                  ? `data:${
                      winner.raffleImage.contentType
                    };base64,${_arrayBufferToBase64(
                      winner.raffleImage.data.data,
                    )}`
                  : DefaultPrize
              }
            />
          ))
        ) : (
          <span className="hero__container__winners-box__winners-wrapper__no-winner">
            - Nenhum ganhador no momento
          </span>
        )}
      </div>
    </div>
  );
};

const HomeContent = () => {
  return (
    <div className="hero">
      <div className="hero__container">
        <PrizesHome />
        <WinnersHome />
      </div>
    </div>
  );
};

export default HomeContent;
