import React from 'react';
import { BsInfoCircle } from 'react-icons/bs';

const MyPurchasesContent = () => {
  return (
    <div className="my-purchases__my-purchases-content">
      <div className="my-purchases__my-purchases-content__container">
        <div className="my-purchases__my-purchases-content__container__info-wrapper">
          <h1 className="my-purchases__my-purchases-content__container__info-wrapper__title">
            🛒 Compras
          </h1>

          <span className="my-purchases__my-purchases-content__container__info-wrapper__desc">
            recentes
          </span>
        </div>

        <div className="my-purchases__my-purchases-content__container__result-box">
          <div className="my-purchases__my-purchases-content__container__result-box__alert-box">
            <span className="my-purchases__my-purchases-content__container__result-box__alert-box__desc">
              <BsInfoCircle /> Nenhuma compra encontrada
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPurchasesContent;
