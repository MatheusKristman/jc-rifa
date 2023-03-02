import React, { useRef } from "react";
import FaqsQuestion from "../FaqsQuestion";
import { shallow } from "zustand/shallow";
import useHomeFaqStore from "../../../stores/useHomeFaqStore";
import { BsArrowRight } from "react-icons/bs";

const ContactContent = () => {
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
    <div className="contact__contact-content">
      <div className="contact__contact-content__container">
        <h1 className="contact__contact-content__container__title">🤷 Perguntas Frequentes</h1>

        <div className="contact__contact-content__container__faq-wrapper">
          <FaqsQuestion
            faqRef={faq1Ref}
            isFaqOpen={isFaqOpen1}
            openFaq={openFaq1}
            closeFaq={closeFaq1}
          />
          <FaqsQuestion
            faqRef={faq2Ref}
            isFaqOpen={isFaqOpen2}
            openFaq={openFaq2}
            closeFaq={closeFaq2}
          />
          <FaqsQuestion
            faqRef={faq3Ref}
            isFaqOpen={isFaqOpen3}
            openFaq={openFaq3}
            closeFaq={closeFaq3}
          />
        </div>

        <div className="contact__contact-content__container__contact-title-wrapper">
          <h1 className="contact__contact-content__container__contact-title-wrapper__title">
            ✉️ Contato
          </h1>

          <span className="contact__contact-content__container__contact-title-wrapper__desc">
            Tire suas dúvidas.
          </span>
        </div>

        <form className="contact__contact-content__container__form">
          <div className="contact__contact-content__container__form__inputs-wrapper">
            <label
              htmlFor="name"
              className="contact__contact-content__container__form__inputs-wrapper__label"
            >
              Nome
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="off"
                autoCorrect="off"
                className="contact__contact-content__container__form__inputs-wrapper__label__input"
              />
            </label>

            <label
              htmlFor="tel"
              className="contact__contact-content__container__form__inputs-wrapper__label"
            >
              Telefone
              <input
                type="text"
                name="tel"
                id="tel"
                autoComplete="off"
                autoCorrect="off"
                className="contact__contact-content__container__form__inputs-wrapper__label__input"
              />
            </label>

            <label
              htmlFor="raffle"
              className="contact__contact-content__container__form__inputs-wrapper__label"
            >
              Sorteio
              <select
                name="raffle"
                id="raffle"
                className="contact__contact-content__container__form__inputs-wrapper__label__select"
              >
                <option value="0">Deseja falar sobre um sorteio?</option>{" "}
                {/* value com o id do sorteio em um array */}
              </select>
            </label>

            <label
              htmlFor="subject"
              className="contact__contact-content__container__form__inputs-wrapper__label"
            >
              Assunto
              <select
                name="subject"
                id="subject"
                className="contact__contact-content__container__form__inputs-wrapper__label__select"
              >
                <option value="Outro(s)">{"Outro(s)"}</option>
                <option value="Dúvidas">{"Dúvidas"}</option>
                <option value="Pagamentos">{"Pagamentos"}</option>
              </select>
            </label>

            <label
              htmlFor="message"
              className="contact__contact-content__container__form__inputs-wrapper__label"
            >
              Mensagem
              <textarea
                name="message"
                id="message"
                minLength={20}
                className="contact__contact-content__container__form__inputs-wrapper__label__textarea"
              />
              <span className="contact__contact-content__container__form__inputs-wrapper__label__tip">Mínimo de 20 caractéres</span>
            </label>
          </div>

          <button type="submit" className="contact__contact-content__container__form__submit-btn">
            Enviar <BsArrowRight />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactContent;
