import React, { useEffect } from "react";
import { BsFacebook, BsTelegram, BsTwitter, BsWhatsapp, BsCart, BsCheck2Circle } from 'react-icons/bs';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { shallow } from "zustand/shallow";

import PrizeDisplayed from "../PrizeDisplayed";
import useRaffleStore from "../../../stores/useRaffleStore";
import api from '../../../services/api';
import useBuyNumbersStore from "../../../stores/useBuyNumbersStore";

const RaffleSelectedContent = () => {
  const {
    raffleSelected,
    setRaffleSelected
  } = useRaffleStore(
    (state) => ({
      raffleSelected: state.raffleSelected,
      setRaffleSelected: state.setRaffleSelected,
    }), shallow
  );

  const {
    numberQuant,
    incrementNumberQuant,
    decrementNumberQuant,
  } = useBuyNumbersStore(
    (state) => ({
      numberQuant: state.numberQuant,
      incrementNumberQuant: state.incrementNumberQuant,
      decrementNumberQuant: state.decrementNumberQuant,
    })
  )

  useEffect(() => {
    const fetchRaffleSelected = () => {
      if (!raffleSelected.hasOwnProperty('_id')) {
        api
          .get(window.location.pathname)
          .then((res) => setRaffleSelected(res.data))
          .catch((error) => console.log(error));
      }
    }

    fetchRaffleSelected();
  }, [setRaffleSelected]);
  
  useEffect(() => {    
    console.log(raffleSelected.description)
  }, [raffleSelected]);

  const convertProgress = (current, total) => {
    return (100 * current) / total;
  };

  return (
    <div className="raffle-selected__raffle-selected-content">
      <div className="raffle-selected__raffle-selected-content__container">
        <div className="raffle-selected__raffle-selected-content__container__raffle-displayed">
          <PrizeDisplayed image={raffleSelected.raffleImage} title={raffleSelected.title} subtitle={raffleSelected.subtitle} progress={convertProgress(
            raffleSelected?.QuantNumbers - raffleSelected?.NumbersAvailable?.length,
            raffleSelected?.QuantNumbers
          )} />
        </div>

        <span className="raffle-selected__raffle-selected-content__container__price-tag">
          POR APENAS <strong>{raffleSelected.price}</strong>
        </span>

        <div className="raffle-selected__raffle-selected-content__container__desc-card">
          <p className="raffle-selected__raffle-selected-content__container__desc-card__desc">
            {raffleSelected.description}
          </p>
        </div>

        <div className="raffle-selected__raffle-selected-content__container__social-wrapper">
          <a href="#" className="raffle-selected__raffle-selected-content__container__social-wrapper__social">
            <BsFacebook />
          </a>
          <a href="#" className="raffle-selected__raffle-selected-content__container__social-wrapper__social">
            <BsTelegram />
          </a>
          <a href="#" className="raffle-selected__raffle-selected-content__container__social-wrapper__social">
            <BsTwitter />
          </a>
          <a href="#" className="raffle-selected__raffle-selected-content__container__social-wrapper__social">
            <BsWhatsapp />
          </a>
        </div>

        <div className="raffle-selected__raffle-selected-content__container__title-wrapper">
          <h1 className="raffle-selected__raffle-selected-content__container__title-wrapper__title">
            ⚡ Cotas
          </h1>

          <span className="raffle-selected__raffle-selected-content__container__title-wrapper__desc">
            Escolha sua sorte
          </span>
        </div>

        <Link to="/query-numbers" className="raffle-selected__raffle-selected-content__container__link-query-numbers">
          <BsCart /> Ver meus números
        </Link>

        <div className="raffle-selected__raffle-selected-content__container__buy-numbers-box">
          <span className="raffle-selected__raffle-selected-content__container__buy-numbers-box__desc">
            Selecione a quantidade de números
          </span>

          <div className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper">
            <button onClick={() => incrementNumberQuant(10)} type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn">
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>10
              </h1>
              
              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>

            <button onClick={() => incrementNumberQuant(15)} type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn emphasis">
              <span className="emphasis-tag">
                Mais popular
              </span>
              
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>15
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>

            <button onClick={() => incrementNumberQuant(200)} type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn">
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>200
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>

            <button onClick={() => incrementNumberQuant(250)} type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn">
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>250
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>

            <button onClick={() => incrementNumberQuant(300)} type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn">
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>300
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>

            <button onClick={() => incrementNumberQuant(350)} type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn">
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>350
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>
          </div>

          <div className="raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper">
            <button onClick={() => {
              if (numberQuant !== 0) {
                decrementNumberQuant(1);
              }
            }} type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper__btn">
              <CiCircleMinus />
            </button>

            <div onClick={() => decrementNumberQuant(numberQuant)} className="raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper__selected-numbers-display">
              {numberQuant}
            </div>

            <button onClick={() => incrementNumberQuant(1)} type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper__btn">
              <CiCirclePlus />
            </button>
          </div>
        </div>

        <button type="button" className="raffle-selected__raffle-selected-content__container__buy-btn">
          <span className="raffle-selected__raffle-selected-content__container__buy-btn__desc">
            <BsCheck2Circle /> Participar do sorteio
          </span>

          <span className="raffle-selected__raffle-selected-content__container__buy-btn__price">
            R$ 0,00
          </span>
        </button>
      </div>
    </div>
  );
};

export default RaffleSelectedContent;
