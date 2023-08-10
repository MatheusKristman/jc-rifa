import React from "react";
import defaultWinner from "../../assets/default-winner.jpg";
import defaultPrize from "../../assets/default-prize.jpg";

const WinnerBox = ({
  profileImage,
  name,
  raffleTitle,
  raffleNumber,
  raffleImage,
}) => {
  return (
    <div className="winner-box">
      <div className="winner-box__winner-wrapper">
        <div className="winner-box__winner-wrapper__image-box">
          <img
            src={profileImage || defaultWinner}
            alt="Ganhador"
            className="winner-box__winner-wrapper__image-box__image"
          />
        </div>

        <div className="winner-box__winner-wrapper__infos-box">
          <h3 className="winner-box__winner-wrapper__infos-box__name">
            {name}
          </h3>

          <span className="winner-box__winner-wrapper__infos-box__desc">
            {`Ganhou ${raffleTitle} cota ${raffleNumber}`}
          </span>
        </div>
      </div>

      <div className="winner-box__prize-image-box">
        <img
          src={raffleImage || defaultPrize}
          alt="Prêmio"
          className="winner-box__prize-image-box__image"
        />
      </div>
    </div>
  );
};

export default WinnerBox;
