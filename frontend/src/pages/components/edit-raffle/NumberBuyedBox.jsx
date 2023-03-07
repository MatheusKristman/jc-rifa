import React from 'react'

import defaultWinner from '../../../assets/default-winner.jpg';
import prize2 from '../../../assets/prize-2.jpg';

const NumberBuyedBox = () => {
  return (
    <div className="numbers-buyed-box">
      <div className="numbers-buyed-box__wrapper">
        <div className="numbers-buyed-box__wrapper__image-box">
          <img src={defaultWinner} alt="Ganhador" className="numbers-buyed-box__wrapper__image-box__image" />
        </div>

        <div className="numbers-buyed-box__wrapper__infos-box">
          <h3 className="numbers-buyed-box__wrapper__infos-box__name">
            David Perroni
          </h3>

          <span className="numbers-buyed-box__wrapper__infos-box__numbers">
            {'12268'}
          </span>
        </div>
      </div>

      <div className="numbers-buyed-box__prize-image-box">
        <img src={prize2} alt="Prêmio" className="numbers-buyed-box__prize-image-box__image" />
      </div>
    </div>
  )
}

export default NumberBuyedBox;
