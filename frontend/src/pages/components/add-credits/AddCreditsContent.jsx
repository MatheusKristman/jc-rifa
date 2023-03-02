import React from 'react';
import { BiMoney } from 'react-icons/bi';

const AddCreditsContent = () => {
  return (
    <div className="add-credits__content">
      <div className="add-credits__content__container">
        <div className="add-credits__content__container__infos">
          <h1 className="add-credits__content__container__infos__title">💲 Créditos</h1>

          <span className="add-credits__content__container__infos__desc">
            adicione saldo em sua conta
          </span>
        </div>

        <div className="add-credits__content__container__box">
          <span className="add-credits__content__container__box__desc">
            Faça pagamentos instantâneos com créditos em sua conta
          </span>

          <div className="add-credits__content__container__box__btn-wrapper">
            <button type="button" className="add-credits__content__container__box__btn-wrapper__btn">
              R$ 1.000,00
            </button>

            <button type="button" className="add-credits__content__container__box__btn-wrapper__btn">
              R$ 500,00
            </button>

            <button type="button" className="add-credits__content__container__box__btn-wrapper__btn">
              R$ 250,00
            </button>

            <button type="button" className="add-credits__content__container__box__btn-wrapper__btn">
              R$ 100,00
            </button>

            <button type="button" className="add-credits__content__container__box__btn-wrapper__btn">
              R$ 50,00
            </button>

            <button type="button" className="add-credits__content__container__box__btn-wrapper__btn">
              R$ 30,00
            </button>
          </div>

          <div className="add-credits__content__container__box__value-input-wrapper">
            <label htmlFor="credit" className="add-credits__content__container__box__value-input-wrapper__label">
              R$
            </label>

            <input type="text" name="credit" id="credit" placeholder='Ou, informe o valor' className="add-credits__content__container__box__value-input-wrapper__input" />
          </div>

          <span className="add-credits__content__container__box__tip">
            * O VALOR MÍNIMO PERMITIDO É DE R$ 20,00
          </span>

          <span className="add-credits__content__container__box__total">
            <strong>Total: </strong> R$ 0,00
          </span>
        </div>

        <button className="add-credits__content__container__buy-btn">
          Efetuar Pagamento <BiMoney />
        </button>
      </div>
    </div>
  )
}

export default AddCreditsContent