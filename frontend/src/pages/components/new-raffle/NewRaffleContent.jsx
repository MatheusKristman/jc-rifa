import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useNewRaffleStore from "../../../stores/useNewRaffleStore";
import useGeneralStore from "../../../stores/useGeneralStore";
import api from "../../../services/api";
import DefaultPrize from "../../../assets/default-prize.jpg";

const schema = Yup.object().shape({
  raffleImage: Yup.mixed(),
  title: Yup.string().required("Título é obrigatório"),
  subtitle: Yup.string().required("Subtítulo é obrigatório"),
  description: Yup.string(),
  price: Yup.string().required("Preço é obrigatório"),
  QuantNumbers: Yup.number().required("Quantidade de Números é obrigatória"),
});

const NewRaffleContent = () => {
  const { resetValues } = useNewRaffleStore(
    (state) => ({
      resetValues: state.resetValues,
    }),
    shallow,
  );
  const { setToLoad, setNotToLoad } = useGeneralStore((state) => ({
    setToLoad: state.setToLoad,
    setNotToLoad: state.setNotToLoad,
  }));

  const [newRaffleData, setNewRaffleData] = useState({
    raffleImage: null,
    title: "",
    subtitle: "",
    description: "",
    price: "",
    raffleNumbers: 25,
  });
  const [actualRaffleImageUrl, setActualRaffleImageUrl] = useState("");
  const [raffleImageError, setRaffleImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [numbersOptions, setNumbersOptions] = useState([
    25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700,
    750, 800, 850, 900, 950, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000,
    9000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000,
    1000000,
  ]);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = await e.target.files[0];

    if (!file) {
      return;
    }

    if (file && file.type.startsWith("image/")) {
      setActualRaffleImageUrl(URL.createObjectURL(file));
      setNewRaffleData((prev) => ({ ...prev, raffleImage: file }));
    } else {
      toast.error("O arquivo selecionado não é uma imagem válida", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleFormChange = (option, value) => {
    setNewRaffleData((prev) => ({ ...prev, [option]: value }));
  };

  function coinMask(event) {
    const onlyDigits = event.target.value
      .split("")
      .filter((s) => /\d/.test(s))
      .join("")
      .padStart(3, "0");
    const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2);
    event.target.value = maskCurrency(digitsFloat);
  }

  function maskCurrency(valor, locale = "pt-BR", currency = "BRL") {
    const valueConverted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(valor);

    setNewRaffleData((prev) => ({ ...prev, price: valueConverted }));

    return valueConverted;
  }

  const onSubmit = (data) => {
    if (!newRaffleData.raffleImage) {
      setRaffleImageError("Imagem é obrigatória");
      return;
    }

    setRaffleImageError("");
    setIsSubmitting(true);
  };

  useEffect(() => {
    const submitData = () => {
      if (isSubmitting) {
        const sendRaffleToDB = () => {
          setToLoad();
          const formData = new FormData();

          formData.append("raffleImage", newRaffleData.raffleImage);
          formData.append("title", newRaffleData.title);
          formData.append("subtitle", newRaffleData.subtitle);
          formData.append("description", newRaffleData.description);
          formData.append("price", newRaffleData.price);
          formData.append("quantNumbers", newRaffleData.raffleNumbers);

          api
            .post("/raffle/create-raffle", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then(() => {
              toast.success("Rifa criada com sucesso", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            })
            .catch((error) => {
              if (error.response?.data === "Rifa já cadastrada") {
                toast.error("Rifa já cadastrada", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              } else {
                toast.error("Ocorreu um erro na criação da rifa", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              }

              console.error(error);
            })
            .finally(() => {
              setNotToLoad();
              setIsSubmitting(false);
              navigate("/raffle-management");
            });
        };

        sendRaffleToDB();
      }
    };

    submitData();
  }, [isSubmitting]);

  // useEffect(() => {
  //   if (isRaffleCreated) {
  //     setTimeout(() => {
  //       raffleCreatedCancel();
  //       submitCancel();
  //       resetValues();
  //       navigate("/raffle-management");
  //     }, 3000);
  //   }
  //
  //   if (submitError) {
  //     setTimeout(() => {
  //       errorDontExist();
  //       submitCancel();
  //     }, 4000);
  //   }
  // }, [isRaffleCreated, submitError]);

  return (
    <div className="new-raffle__content">
      <div className="new-raffle__content__container">
        <h1 className="new-raffle__content__container__title">
          Criando uma nova rifa
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="new-raffle__content__container__form"
        >
          <label
            htmlFor="raffleImage"
            className="new-raffle__content__container__form__image-label"
          >
            <div
              className="new-raffle__content__container__form__image-label__image-box"
              style={
                raffleImageError ? { border: "2px solid rgb(209, 52, 52)" } : {}
              }
            >
              <img
                src={actualRaffleImageUrl ? actualRaffleImageUrl : DefaultPrize}
                alt="Perfil"
                className="new-raffle__content__container__form__image-label__image-box__image"
              />
            </div>

            <input
              {...register("raffleImage")}
              type="file"
              name="raffleImage"
              id="raffleImage"
              onChange={handleFileChange}
              className="new-raffle__content__container__form__image-label__input"
            />

            {raffleImageError && <span>{raffleImageError}</span>}
          </label>

          <div className="new-raffle__content__container__form__inputs-box">
            <label
              htmlFor="title"
              className="new-raffle__content__container__form__inputs-box__label"
            >
              Título
              <input
                {...register("title")}
                type="text"
                name="title"
                id="title"
                value={newRaffleData.title}
                onChange={(event) =>
                  handleFormChange("title", event.target.value)
                }
                style={
                  errors.title ? { border: "2px solid rgb(209, 52, 52)" } : {}
                }
                className="new-raffle__content__container__form__inputs-box__label__input"
              />
            </label>
            {errors.title && <span>{errors.title.message}</span>}

            <label
              htmlFor="subtitle"
              className="new-raffle__content__container__form__inputs-box__label"
            >
              Subtítulo
              <input
                {...register("subtitle")}
                type="text"
                name="subtitle"
                id="subtitle"
                value={newRaffleData.subtitle}
                onChange={(event) =>
                  handleFormChange("subtitle", event.target.value)
                }
                style={
                  errors.subtitle
                    ? { border: "2px solid rgb(209, 52, 52)" }
                    : {}
                }
                className="new-raffle__content__container__form__inputs-box__label__input"
              />
            </label>
            {errors.subtitle && <span>{errors.subtitle.message}</span>}

            <label
              htmlFor="description"
              className="new-raffle__content__container__form__inputs-box__label"
            >
              Descrição
              <textarea
                {...register("description")}
                id="description"
                name="description"
                value={newRaffleData.description}
                onChange={(event) =>
                  handleFormChange("description", event.target.value)
                }
                style={
                  errors.description
                    ? { border: "2px solid rgb(209, 52, 52)" }
                    : {}
                }
                className="new-raffle__content__container__form__inputs-box__label__textarea"
              />
            </label>
            {errors.description && <span>{errors.description.message}</span>}

            <label
              htmlFor="price"
              className="new-raffle__content__container__form__inputs-box__label"
            >
              Preço por números
              <input
                {...register("price")}
                type="text"
                name="price"
                id="price"
                value={newRaffleData.price}
                onChange={(event) => coinMask(event)}
                style={
                  errors.price ? { border: "2px solid rgb(209, 52, 52)" } : {}
                }
                className="new-raffle__content__container__form__inputs-box__label__input"
              />
            </label>
            {errors.price && <span>{errors.price.message}</span>}

            <label
              htmlFor="QuantNumbers"
              className="new-raffle__content__container__form__inputs-box__label"
            >
              Quantidade de Números
              <select
                {...register("QuantNumbers")}
                name="QuantNumbers"
                id="QuantNumbers"
                value={newRaffleData.raffleNumbers}
                onChange={(event) =>
                  handleFormChange("raffleNumbers", event.target.value)
                }
                style={
                  errors.QuantNumbers
                    ? { border: "2px solid rgb(209, 52, 52)" }
                    : {}
                }
                className="new-raffle__content__container__form__inputs-box__label__select"
              >
                {numbersOptions.map((numbers, index) => (
                  <option key={`number-${index}`} value={numbers}>
                    {numbers}
                  </option>
                ))}
              </select>
            </label>
            {errors.QuantNumbers && <span>{errors.QuantNumbers.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="new-raffle__content__container__form__submit-btn"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRaffleContent;
