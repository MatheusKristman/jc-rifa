import React from "react";

import useGeneralStore from "../../stores/useGeneralStore";
import defaultPrize from "../../assets/default-prize.jpg";

const PrizeDisplayed = ({ image, title, subtitle, progress, winner }) => {
  const { isRaffleLoading } = useGeneralStore((state) => ({
    isRaffleLoading: state.isRaffleLoading,
  }));

  return (
    <div className="prize-displayed prize-clickable">
      <div
        className={
          isRaffleLoading
            ? "prize-displayed__image-box loading"
            : "prize-displayed__image-box"
        }
      >
        <img
          src={image || defaultPrize}
          alt="Prêmio"
          className="prize-displayed__image-box__image"
        />
      </div>

      <div className="prize-displayed__infos-box">
        <h3
          className={
            isRaffleLoading
              ? "prize-displayed__infos-box__title loading"
              : "prize-displayed__infos-box__title"
          }
        >
          {title ? title : "Título Carregando"}
        </h3>

        <span
          className={
            isRaffleLoading
              ? "prize-displayed__infos-box__desc loading"
              : "prize-displayed__infos-box__desc"
          }
        >
          {subtitle ? subtitle : "Subtítulo Carregando"}
        </span>

        <span
          className={
            isRaffleLoading
              ? "prize-displayed__infos-box__status loading"
              : winner
              ? "prize-displayed__infos-box__status finished"
              : progress <= 50
              ? "prize-displayed__infos-box__status new"
              : "prize-displayed__infos-box__status finishing"
          }
        >
          {winner
            ? "Concluído"
            : progress <= 50
            ? "Adquira já"
            : "Corre que está acabando!"}
        </span>
      </div>
    </div>
  );
};

export default PrizeDisplayed;
