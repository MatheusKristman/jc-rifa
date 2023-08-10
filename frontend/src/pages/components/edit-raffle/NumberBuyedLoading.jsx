import React from "react";

import LoadingAnimation from "../../../assets/loading.svg";

export default function NumberBuyedLoading() {
  return (
    <div className="number-buyed-loading">
      <div className="number-buyed-loading__box">
        <img
          src={LoadingAnimation}
          alt="Carregando..."
          className="number-buyed-loading__box__loading-animation"
        />
      </div>
    </div>
  );
}
