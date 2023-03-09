import React, { useEffect } from 'react'

import defaultWinner from '../../../assets/default-winner.jpg';
import prize2 from '../../../assets/prize-2.jpg';
import _arrayBufferToBase64 from '../../../hooks/useArrayBufferToBase64';

const NumberBuyedBox = ({image, name, numbers, raffleImage}) => {
  return (
    <div className="numbers-buyed-box">
      <div className="numbers-buyed-box__wrapper">
        <div className="numbers-buyed-box__wrapper__image-box">
          <img src={image?.data ? `data:${image.contentType};base64,${_arrayBufferToBase64(image.data.data)}` : defaultWinner} alt="Ganhador" className="numbers-buyed-box__wrapper__image-box__image" />
        </div>

        <div className="numbers-buyed-box__wrapper__infos-box">
          <h3 className="numbers-buyed-box__wrapper__infos-box__name">
            {name}
          </h3>

          <div className="numbers-buyed-box__wrapper__infos-box__numbers-box">
            {numbers?.map((number, index) => (
              <span key={`number-${index}`} className="numbers-buyed-box__wrapper__infos-box__numbers-box__number">{number}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="numbers-buyed-box__prize-image-box">
        <img src={raffleImage?.data ? `data:${raffleImage.contentType};base64,${_arrayBufferToBase64(raffleImage.data.data)}` : prize2} alt="Prêmio" className="numbers-buyed-box__prize-image-box__image" />
      </div>
    </div>
  )
}

export default NumberBuyedBox;
