import React from 'react'
import prizeDisplayedImg from '../../assets/prize-displayed.jpg';

const PrizeDisplayed = () => {
  return (
    <div className="prize-displayed prize-clickable">
      <div className="prize-displayed__image-box">
        <img src={prizeDisplayedImg} alt="Prêmio" className="prize-displayed__image-box__image" />
      </div>

      <div className="prize-displayed__infos-box">
        <h3 className="prize-displayed__infos-box__title">
          vw - jetta gli + corolla altis ou 300 mil na conta
        </h3>

        <span className="prize-displayed__infos-box__desc">
          {'metade ja foi< vem garantir suas cotas'}
        </span>

        <span className="prize-displayed__infos-box__status waiting-raffle">
          Aguarde o sorteio!
        </span>
      </div>
    </div>
  );
}

export default PrizeDisplayed