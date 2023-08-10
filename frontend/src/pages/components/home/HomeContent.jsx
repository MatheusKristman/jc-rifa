import React, { useState, useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useNavigate } from "react-router-dom";

import { PrizeDisplayed, Prizes, WinnerBox } from "../../components";
import NoUserPhoto from "../../../assets/no-user-photo.png";
import DefaultPrize from "../../../assets/default-prize.jpg";
import useGeneralStore from "../../../stores/useGeneralStore";
import useRaffleStore from "../../../stores/useRaffleStore";
import api from "../../../services/api";

const PrizesHome = () => {
  const { raffles, setRaffles } = useRaffleStore(
    (state) => ({
      raffles: state.raffles,
      setRaffles: state.setRaffles,
    }),
    shallow,
  );
  const { setToRaffleLoad, setToRaffleNotLoad, setToAnimateFadeIn, setToLoad } =
    useGeneralStore(
      (state) => ({
        setToRaffleLoad: state.setToRaffleLoad,
        setToRaffleNotLoad: state.setToRaffleNotLoad,
        setToAnimateFadeIn: state.setToAnimateFadeIn,
        setToLoad: state.setToLoad,
      }),
      shallow,
    );

  const [rafflesImagesUrls, setRafflesImagesUrls] = useState([null]);

  const navigate = useNavigate();

  const convertProgress = (current, total) => {
    return (100 * current) / total;
  };

  useEffect(() => {
    setRaffles([]);

    setToAnimateFadeIn();
    setToLoad();
  }, []);

  useEffect(() => {
    const fetchRaffles = () => {
      if (raffles.length === 0) {
        setToRaffleLoad();

        api
          .get("/raffle/get-all-raffles")
          .then((res) => {
            setRaffles(
              res.data.filter(
                (raffle) =>
                  raffle.isFinished === false &&
                  raffle.quantBuyedNumbers < raffle.quantNumbers,
              ),
            );

            const rafflesToImages = res.data.filter(
              (raffle) =>
                !raffle.isFinished &&
                raffle.quantBuyedNumbers < raffle.quantNumbers,
            );

            const urls = [];
            for (let i = 0; i < rafflesToImages.length; i++) {
              if (
                rafflesToImages[i].raffleImage &&
                !rafflesToImages[i].isFinished
              ) {
                if (
                  JSON.stringify(import.meta.env.MODE) ===
                  JSON.stringify("development")
                ) {
                  urls.push(
                    `${import.meta.env.VITE_API_KEY_DEV}${
                      import.meta.env.VITE_API_PORT
                    }/raffle-uploads/${rafflesToImages[i].raffleImage}`,
                  );
                } else {
                  urls.push(
                    `${import.meta.env.VITE_API_KEY}/raffle-uploads/${
                      rafflesToImages[i].raffleImage
                    }`,
                  );
                }
              } else {
                urls.push(null);
              }
            }

            setRafflesImagesUrls(urls);
            setToRaffleNotLoad();
          })
          .catch((error) => console.error(error));
      }
    };

    fetchRaffles();
  }, [raffles, setRaffles]);

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
          image={rafflesImagesUrls[0] || DefaultPrize}
          title={raffles[0]?.title}
          subtitle={raffles[0]?.subtitle}
          progress={convertProgress(
            raffles[0]?.quantBuyedNumbers,
            raffles[0]?.quantNumbers,
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
            image={rafflesImagesUrls[index + 1] || DefaultPrize}
            progress={convertProgress(
              raffle?.quantBuyedNumbers,
              raffle?.quantNumbers,
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
  const { raffles } = useRaffleStore((state) => ({
    raffles: state.raffles,
  }));
  const { setToAnimateFadeIn, setToAnimateFadeOut, setToLoad, setNotToLoad } =
    useGeneralStore((state) => ({
      setToAnimateFadeIn: state.setToAnimateFadeIn,
      setToAnimateFadeOut: state.setToAnimateFadeOut,
      setToLoad: state.setToLoad,
      setNotToLoad: state.setNotToLoad,
    }));

  const [winners, setWinners] = useState([]);
  const [winnersImagesUrls, setWinnersImagesUrls] = useState([]);
  const [winnersRafflesImagesUrls, setWinnersRafflesImagesUrls] = useState([]);

  useEffect(() => {
    const fetchWinners = () => {
      setToAnimateFadeIn();
      setToLoad();

      api
        .get("/winner/get-all-winners")
        .then((res) => {
          setWinners(res.data);

          const allWinners = res.data;

          const winnersUrls = [];
          const rafflesUrls = [];

          for (let i = 0; i < allWinners.length; i++) {
            if (allWinners[i].profileImage) {
              if (
                JSON.stringify(import.meta.env.MODE) ===
                JSON.stringify("development")
              ) {
                winnersUrls.push(
                  `${import.meta.env.VITE_API_KEY_DEV}${
                    import.meta.env.VITE_API_PORT
                  }/user-uploads/${allWinners[i].profileImage}`,
                );
              } else {
                winnersUrls.push(
                  `${import.meta.env.VITE_API_KEY}/user-uploads/${
                    allWinners[i].profileImage
                  }`,
                );
              }
            } else {
              winnersUrls.push(null);
            }

            if (allWinners[i].raffleImage) {
              if (
                JSON.stringify(import.meta.env.MODE) ===
                JSON.stringify("development")
              ) {
                rafflesUrls.push(
                  `${import.meta.env.VITE_API_KEY_DEV}${
                    import.meta.env.VITE_API_PORT
                  }/raffle-uploads/${allWinners[i].raffleImage}`,
                );
              } else {
                rafflesUrls.push(
                  `${import.meta.env.VITE_API_KEY}/raffle-uploads/${
                    allWinners[i].raffleImage
                  }`,
                );
              }
            } else {
              rafflesUrls.push(null);
            }
          }

          setWinnersImagesUrls(winnersUrls);
          setWinnersRafflesImagesUrls(rafflesUrls);
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setToAnimateFadeOut();

          setTimeout(() => {
            setNotToLoad();
          }, 400);
        });
    };

    fetchWinners();
  }, [setWinners, raffles]);

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
          winners.map((winner, index) => (
            <WinnerBox
              key={winner.tel}
              profileImage={winnersImagesUrls[index] || NoUserPhoto}
              name={winner.name}
              raffleTitle={winner.raffleTitle}
              raffleNumber={winner.raffleNumber}
              raffleImage={winnersRafflesImagesUrls[index] || DefaultPrize}
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
