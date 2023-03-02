import React from 'react'
import defaultWinner from '../../assets/default-winner.jpg';
import prize2 from '../../assets/prize-2.jpg';

const WinnerBox = () => {
  return (
    <div className="winner-box">
      <div className="winner-box__winner-wrapper">
        <div className="winner-box__winner-wrapper__image-box">
          <img src={defaultWinner} alt="Ganhador" className="winner-box__winner-wrapper__image-box__image" />
        </div>

        <div className="winner-box__winner-wrapper__infos-box">
          <h3 className="winner-box__winner-wrapper__infos-box__name">
            David Perroni
          </h3>

          <span className="winner-box__winner-wrapper__infos-box__desc">
            {'Ganhou 04ºRAPIDINHA DO PIX VALENDO R$2.000!! !(CLASSICOS) cota 12268'}
          </span>
        </div>
      </div>

      <div className="winner-box__prize-image-box">
        <img src={prize2} alt="Prêmio" className="winner-box__prize-image-box__image" />
      </div>
    </div>
  );
}

export default WinnerBox