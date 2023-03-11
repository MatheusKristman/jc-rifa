import React from 'react'
import { BsChevronCompactRight } from 'react-icons/bs';
import prize1 from '../../assets/prize-1.jpg';
import DefaultImage from '../../assets/default-prize.jpg';

const Prizes = ({ title, subtitle, image, progress, winner }) => {
  return (
    <div className="prizes">
      <div className="prizes__image-box">
        <img src={image === null ? DefaultImage : image} alt="Prêmio" className="prizes__image-box__image" />
      </div>

      <div className="prizes__infos-box">
        <h3 className="prizes__infos-box__title">
          {title}
        </h3>

        <span className="prizes__infos-box__desc">
          {subtitle}
        </span>

        <span className={winner ? "prizes__infos-box__status finished" : progress <= 50 ? "prizes__infos-box__status new" : "prizes__infos-box__status finishing"}>
          {winner ? "Concluído" : progress <= 50 ? 'Adquira já' : 'Corre que está acabando!'}
        </span>
      </div>

      <div className="prizes__arrow-box">
        <BsChevronCompactRight />
      </div>
    </div>
  );
}

export default Prizes