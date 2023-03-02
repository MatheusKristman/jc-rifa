import React from 'react'
import { BsChevronCompactRight } from 'react-icons/bs';
import prize1 from '../../assets/prize-1.jpg';

const Prizes = () => {
  return (
    <div className="prizes">
      <div className="prizes__image-box">
        <img src={prize1} alt="Prêmio" className="prizes__image-box__image" />
      </div>

      <div className="prizes__infos-box">
        <h3 className="prizes__infos-box__title">
          vw - voyage gl ou 20k no pix!!!!
        </h3>

        <span className="prizes__infos-box__desc">
          mais uma nave top familia
        </span>

        <span className="prizes__infos-box__status waiting-raffle">
          Aguarde o sorteio!
        </span>
      </div>

      <div className="prizes__arrow-box">
        <BsChevronCompactRight />
      </div>
    </div>
  );
}

export default Prizes