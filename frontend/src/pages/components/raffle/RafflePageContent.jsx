import React from 'react'
import Prizes from '../Prizes';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const RafflePageContent = () => {
  return (
    <div className="raffle__raffle-content">
      <div className="raffle__raffle-content__container">
        <div className="raffle__raffle-content__container__above-box">
          <h1 className="raffle__raffle-content__container__above-box__title">
            ⚡ Prêmios
          </h1>

          <span className="raffle__raffle-content__container__above-box__desc">
            Escolha sua sorte
          </span>
        </div>

        <div className="raffle__raffle-content__container__filter-box">
          <span className="raffle__raffle-content__container__filter-box__desc">
            LISTAR
          </span>

          <div className="raffle__raffle-content__container__filter-box__btn-wrapper">
            <button className="raffle__raffle-content__container__filter-box__btn-wrapper__btn filter-btn-active">
              Ativos
            </button>
            <button className="raffle__raffle-content__container__filter-box__btn-wrapper__btn">
              Concluídos
            </button>
            <button className="raffle__raffle-content__container__filter-box__btn-wrapper__btn">
              Em breve
            </button>
          </div>
        </div>

        <div className="raffle__raffle-content__container__prizes-wrapper">
          <Prizes />
          <Prizes />
          <Prizes />
          <Prizes />
          <Prizes />
          <Prizes />
          <Prizes />
          <Prizes />
          <Prizes />
          <Prizes />
        </div>

        <div className="raffle__raffle-content__container__pages-btn-wrapper">
          <button className="raffle__raffle-content__container__pages-btn-wrapper__btn desactive">
            <BsChevronLeft /> Anterior
          </button>
          <button className="raffle__raffle-content__container__pages-btn-wrapper__btn">
            Próximo <BsChevronRight />
          </button>
        </div>
      </div>
    </div>
  )
}

export default RafflePageContent;
