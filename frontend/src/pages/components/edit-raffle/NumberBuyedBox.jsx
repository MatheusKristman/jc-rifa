import React from "react";

import defaultWinner from "../../../assets/default-winner.jpg";

const NumberBuyedBox = ({ image, name, numbers }) => {
  return (
    <div className="numbers-buyed-box">
      <div className="numbers-buyed-box__wrapper">
        <div className="numbers-buyed-box__wrapper__image-box">
          <img
            src={image || defaultWinner}
            alt="Ganhador"
            className="numbers-buyed-box__wrapper__image-box__image"
          />
        </div>

        <div className="numbers-buyed-box__wrapper__infos-box">
          <h3 className="numbers-buyed-box__wrapper__infos-box__name">
            {name}
          </h3>

          <div className="numbers-buyed-box__wrapper__infos-box__numbers-box">
            {numbers?.map((number, index) => (
              <span
                key={`number-${index}`}
                className="numbers-buyed-box__wrapper__infos-box__numbers-box__number"
              >
                {number}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="numbers-buyed-box__numbers-quant-box">
        <span className="numbers-buyed-box__numbers-quant-box__quant-title">
          Quantidade
        </span>
        <h3 className="numbers-buyed-box__numbers-quant-box__quant-value">
          {numbers?.length}
        </h3>
      </div>
    </div>
  );
};

export default NumberBuyedBox;
