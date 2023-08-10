import React, { useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";

import { WinnerBox } from "..";
import NoUserPhoto from "../../../assets/no-user-photo.png";
import DefaultPrize from "../../../assets/default-prize.jpg";
import useGeneralStore from "../stores/useGeneralStore";
import api from "../services/api";

const WinnersContent = () => {
  const { setToLoad, setNotToLoad, setToAnimateFadeIn, setToAnimateFadeOut } =
    useGeneralStore((state) => ({
      setToLoad: state.setToLoad,
      setNotToLoad: state.setNotToLoad,
      setToAnimateFadeIn: state.setToAnimateFadeIn,
      setToAnimateFadeOut: state.setToAnimateFadeOut,
    }));

  const [winners, setWinners] = useState([]);
  const [winnersImagesUrls, setWinnersImagesUrls] = useState([]);
  const [winnersRafflesImagesUrls, setWinnersRafflesImagesUrls] = useState([]);

  useEffect(() => {
    const fetchWinners = () => {
      setToLoad();
      setToAnimateFadeIn();

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
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setToAnimateFadeOut();

          setTimeout(() => {
            setNotToLoad();
          }, 400);
        });
    };

    fetchWinners();
  }, [setWinners]);

  return (
    <div className="winners__winners-content">
      <div className="winners__winners-content__container">
        <div className="winners__winners-content__container__infos">
          <h1 className="winners__winners-content__container__infos__title">
            🏆 Ganhadores
          </h1>

          <span className="winners__winners-content__container__infos__desc">
            confira os sortudos
          </span>
        </div>

        <div className="winners__winners-content__container__wrapper">
          {winners.length !== 0 ? (
            winners
              .slice(0, 10)
              .map((winner, index) => (
                <WinnerBox
                  key={winner._id}
                  profileImage={winnersImagesUrls[index] || NoUserPhoto}
                  name={winner.name}
                  raffleTitle={winner.raffleTitle}
                  raffleNumber={winner.raffleNumber}
                  raffleImage={winnersRafflesImagesUrls[index] || DefaultPrize}
                />
              ))
          ) : (
            <div className="winners__winners-content__container__wrapper__alert-box">
              <FiAlertTriangle /> Nenhum ganhador no momento
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WinnersContent;

// loading enquanto carrega os ganhadores
