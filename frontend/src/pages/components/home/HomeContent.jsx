import React, { useRef } from 'react';
import { PrizeDisplayed, Prizes, WinnerBox, FaqsQuestion } from '../../components';
import { shallow } from 'zustand/shallow';
import useHomeFaqStore from '../../../stores/useHomeFaqStore';
import { useNavigate } from 'react-router-dom';

const PrizesHome = () => {
  const navigate = useNavigate();

  return (
    <div className="hero__container__prizes-box">
      <div className="hero__container__prizes-box__above">
        <h1 className="hero__container__prizes-box__above__title">
          ⚡️ Prêmios
        </h1>

        <span className="hero__container__prizes-box__above__desc">
          Escolha sua sorte
        </span>
      </div>

      <div onClick={() => navigate('/raffles/vw-jetta-gli+corolla-altis-ou-300-mil-na-conta')} className="hero__container__prizes-box__prize-displayed-box">
        <PrizeDisplayed />
      </div>
      
      <div onClick={() => navigate('/raffles/vw-voyage-gl-ou-20k-no-pix!!!!')} className="hero__container__prizes-box__prizes-available-box">
        <Prizes />
      </div>

      <div onClick={() => navigate('/raffles/vw-voyage-gl-ou-20k-no-pix!!!!')} className="hero__container__prizes-box__prizes-available-box">
        <Prizes />
      </div>

      <button type="button" className="hero__container__prizes-box__contact-btn">
        <div className="hero__container__prizes-box__contact-btn__icon">
          🤷‍♀️
        </div>

        <div className="hero__container__prizes-box__contact-btn__infos">
          <span className="hero__container__prizes-box__contact-btn__infos__title">
            Dúvidas
          </span>
          <span className="hero__container__prizes-box__contact-btn__infos__desc">
            Fale conosco
          </span>
        </div>
      </button>
    </div>
  );
}

const WinnersHome = () => {
  return (
    <div className="hero__container__winners-box">
      <div className="hero__container__winners-box__above">
        <h1 className="hero__container__winners-box__above__title">
          🎉 Ganhadores
        </h1>

        <span className="hero__container__winners-box__above__desc">
          sortudos
        </span>
      </div>

      <div className="hero__container__winners-box__winners-wrapper">
        <WinnerBox />
        <WinnerBox />
        <WinnerBox />
        <WinnerBox />
        <WinnerBox />
      </div>
    </div>
  );
}

const FaqsHome = () => {
  const { 
    isFaqOpen1,
    isFaqOpen2,
    isFaqOpen3,
    openFaq1,
    openFaq2,
    openFaq3,
    closeFaq1,
    closeFaq2,
    closeFaq3,
  } = useHomeFaqStore(
    (state) => ({
      isFaqOpen1: state.isFaqOpen1,
      isFaqOpen2: state.isFaqOpen2,
      isFaqOpen3: state.isFaqOpen3,
      openFaq1: state.openFaq1,
      openFaq2: state.openFaq2,
      openFaq3: state.openFaq3,
      closeFaq1: state.closeFaq1,
      closeFaq2: state.closeFaq2,
      closeFaq3: state.closeFaq3,
    }),
    shallow
  );

  const faq1Ref = useRef();
  const faq2Ref = useRef();
  const faq3Ref = useRef();

  return (
    <div className="hero__container__faqs-box">
      <h1 className="hero__container__faqs-box__title">
        🤷 Perguntas frequentes
      </h1>

      <div className="hero__container__faqs-box__faqs-wrapper">
        <FaqsQuestion faqRef={faq1Ref} isFaqOpen={isFaqOpen1} openFaq={openFaq1} closeFaq={closeFaq1} />
        <FaqsQuestion faqRef={faq2Ref} isFaqOpen={isFaqOpen2} openFaq={openFaq2} closeFaq={closeFaq2} />
        <FaqsQuestion faqRef={faq3Ref} isFaqOpen={isFaqOpen3} openFaq={openFaq3} closeFaq={closeFaq3} />
      </div>
    </div>
  );
}

const HomeContent = () => {
  return (
    <div className="hero">
      <div className="hero__container">
        <PrizesHome />
        <WinnersHome />
        <FaqsHome />
      </div>
    </div>
  )
}

export default HomeContent;
