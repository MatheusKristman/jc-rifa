import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { WinnerBox } from "..";
import useWinnerStore from "../../../stores/useWinnerStore";
import NoUserPhoto from "../../../assets/no-user-photo.png";
import DefaultPrize from "../../../assets/default-prize.jpg";
import _arrayBufferToBase64 from "../../../hooks/useArrayBufferToBase64";

const WinnersContent = () => {
  const { winners, winnersImagesUrls, winnersRafflesImagesUrls } =
    useWinnerStore((state) => ({
      winners: state.winners,
      winnersImagesUrls: state.winnersImagesUrls,
      winnersRafflesImagesUrls: state.winnersRafflesImagesUrls,
    }));

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
