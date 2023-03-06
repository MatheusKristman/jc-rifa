import React from "react";
import { shallow } from "zustand/shallow";

import DefaultPrize from "../../../assets/default-prize.jpg";
import useNewRaffleStore from "../../../stores/useNewRaffleStore";

const NewRaffleContent = () => {
  const {
    numbersOptions,
    raffleImage,
    setRaffleImage,
    title,
    setTitle,
    subtitle,
    setSubtitle,
    description,
    setDescription,
    price,
    setPrice,
    raffleNumbers,
    setRaffleNumbers,
  } = useNewRaffleStore(
    (state) => ({
      numbersOptions: state.numbersOptions,
      raffleImage: state.raffleImage,
      setRaffleImage: state.setRaffleImage,
      title: state.title,
      setTitle: state.setTitle,
      subtitle: state.subtitle,
      setSubtitle: state.setSubtitle,
      description: state.description,
      setDescription: state.setDescription,
      price: state.price,
      setPrice: state.setPrice,
      raffleNumbers: state.raffleNumbers,
      setRaffleNumbers: state.setRaffleNumbers,
    }),
    shallow
  );

  const handleFileChange = async (e) => {
    const file = await e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        setRaffleImage({
          file,
          url: reader.result,
        });
      };
    }
  };

  function coinMask(event) {
    const onlyDigits = event.target.value
      .split("")
      .filter(s => /\d/.test(s))
      .join("")
      .padStart(3, "0")
    const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2)
    event.target.value = maskCurrency(digitsFloat)
  }
  
  function maskCurrency(valor, locale = 'pt-BR', currency = 'BRL') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(valor)
  }

  return (
    <div className="new-raffle__content">
      <div className="new-raffle__content__container">
        <h1 className="new-raffle__content__container__title">Criando uma nova rifa</h1>

        <form className="new-raffle__content__container__form">
          <label
            htmlFor="raffleImage"
            className="new-raffle__content__container__form__image-label"
          >
            <div className="new-raffle__content__container__form__image-label__image-box">
              <img
                src={raffleImage?.url ? raffleImage.url : DefaultPrize}
                alt="Perfil"
                className="new-raffle__content__container__form__image-label__image-box__image"
              />
            </div>

            <input
              type="file"
              name="raffleImage"
              id="raffleImage"
              onChange={handleFileChange}
              className="new-raffle__content__container__form__image-label__input"
            />
          </label>

          <div className="new-raffle__content__container__form__inputs-box">
            <label
              htmlFor="title"
              className="new-raffle__content__container__form__inputs-box__label"
            >
              Título
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={setTitle}
                className="new-raffle__content__container__form__inputs-box__label__input"
              />
            </label>

            <label
              htmlFor="subtitle"
              className="new-raffle__content__container__form__inputs-box__label"
            >
              Subtítulo
              <input
                type="text"
                name="subtitle"
                id="subtitle"
                value={subtitle}
                onChange={setSubtitle}
                className="new-raffle__content__container__form__inputs-box__label__input"
              />
            </label>

            <label
              htmlFor="description"
              className="new-raffle__content__container__form__inputs-box__label"
            >
              Descrição
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={setDescription}
                className="new-raffle__content__container__form__inputs-box__label__textarea"
              />
            </label>

            <label
              htmlFor="price"
              className="new-raffle__content__container__form__inputs-box__label"
            >
              Preço por números
              <input
                type="text"
                name="price"
                id="price"
                value={price}
                onChange={(e) => setPrice(coinMask(e))}
                className="new-raffle__content__container__form__inputs-box__label__input"
              />
            </label>

            <label
              htmlFor="raffleNumbers"
              className="new-raffle__content__container__form__inputs-box__label"
            >
              Quantidade de Números
              <select
                name="raffleNumbers"
                id="raffleNumbers"
                value={raffleNumbers}
                onChange={setRaffleNumbers}
                className="new-raffle__content__container__form__inputs-box__label__select"
              >
                <option>-- Selecionar --</option>
                {numbersOptions.map((numbers, index) => (
                  <option key={`number-${index}`} value={numbers}>
                    {numbers}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button type="submit" className="new-raffle__content__container__form__submit-btn">
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRaffleContent;
