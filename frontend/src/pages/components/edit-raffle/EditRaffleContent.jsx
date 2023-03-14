import React, { useEffect, useLayoutEffect } from "react";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import api from "../../../services/api";

import NumberBuyedBox from "./NumberBuyedBox";
import DefaultPrize from "../../../assets/default-prize.jpg";
import NoUserPhoto from "../../../assets/no-user-photo.png";
import useRaffleStore from "../../../stores/useRaffleStore";
import useNewRaffleStore from "../../../stores/useNewRaffleStore";
import _arrayBufferToBase64 from "../../../hooks/useArrayBufferToBase64";

const EditRaffleContent = () => {
  const {
    raffleSelected,
    setRaffleSelected,
    progress,
    setProgress,
    participants,
    setParticipants,
    finishNumber,
    setFinishNumber,
    setFinishNumberFromFetch,
    winner,
    setWinner,
    finishNumberError,
    setFinishNumberError,
  } = useRaffleStore(
    (state) => ({
      raffleSelected: state.raffleSelected,
      setRaffleSelected: state.setRaffleSelected,
      progress: state.progress,
      setProgress: state.setProgress,
      participants: state.participants,
      setParticipants: state.setParticipants,
      finishNumber: state.finishNumber,
      setFinishNumber: state.setFinishNumber,
      setFinishNumberFromFetch: state.setFinishNumberFromFetch,
      winner: state.winner,
      setWinner: state.setWinner,
      finishNumberError: state.finishNumberError,
      setFinishNumberError: state.setFinishNumberError,
    }),
    shallow
  );

  const {
    raffleImage,
    setRaffleImage,
    title,
    setTitle,
    setTitleFromFetch,
    subtitle,
    setSubtitle,
    setSubtitleFromFetch,
    description,
    setDescription,
    setDescriptionFromFetch,
    price,
    setPrice,
    isSubmitting,
    submitConfirm,
    submitCancel,
    isRaffleCreated,
    raffleCreatedSuccess,
    raffleCreatedCancel,
    submitError,
    errorExist,
    errorDontExist,
    raffleCreatedMessage,
    setRaffleCreatedMessage,
  } = useNewRaffleStore(
    (state) => ({
      raffleImage: state.raffleImage,
      setRaffleImage: state.setRaffleImage,
      title: state.title,
      setTitle: state.setTitle,
      setTitleFromFetch: state.setTitleFromFetch,
      subtitle: state.subtitle,
      setSubtitle: state.setSubtitle,
      setSubtitleFromFetch: state.setSubtitleFromFetch,
      description: state.description,
      setDescription: state.setDescription,
      setDescriptionFromFetch: state.setDescriptionFromFetch,
      price: state.price,
      setPrice: state.setPrice,
      isSubmitting: state.isSubmitting,
      submitConfirm: state.submitConfirm,
      submitCancel: state.submitCancel,
      isRaffleCreated: state.isRaffleCreated,
      raffleCreatedSuccess: state.raffleCreatedSuccess,
      raffleCreatedCancel: state.raffleCreatedCancel,
      submitError: state.submitError,
      errorExist: state.errorExist,
      errorDontExist: state.errorDontExist,
      raffleCreatedMessage: state.raffleCreatedMessage,
      setRaffleCreatedMessage: state.setRaffleCreatedMessage,
    }),
    shallow
  );

  const schema = Yup.object().shape({
    editRaffleImage: Yup.mixed(),
    editTitle: Yup.string().required("Título é obrigatório"),
    editSubtitle: Yup.string().required("Subtítulo é obrigatório"),
    editDescription: Yup.string(),
    editPrice: Yup.string().required("Preço é obrigatório"),
  });

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  useLayoutEffect(() => {
    if (raffleSelected.hasOwnProperty("_id")) {
      setRaffleImage({
        url: raffleSelected.raffleImage.data
          ? `data:${raffleSelected.raffleImage.contentType};base64,${_arrayBufferToBase64(
              raffleSelected.raffleImage.data.data
            )}`
          : null,
      });

      setTitleFromFetch(raffleSelected.title);
      setValue("editTitle", raffleSelected.title);

      setSubtitleFromFetch(raffleSelected.subtitle);
      setValue("editSubtitle", raffleSelected.subtitle);

      setDescriptionFromFetch(raffleSelected.description);
      setValue("editDescription", raffleSelected.description);

      setPrice(raffleSelected.price);
      setValue("editPrice", raffleSelected.price);

      setFinishNumberError("");

      setParticipants([])

      setWinner({});
      setFinishNumberFromFetch('');
    }
  }, [raffleSelected]);

  useEffect(() => {
    api
      .get(window.location.pathname)
      .then((res) => {
        setRaffleSelected(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setRaffleSelected]);

  useEffect(() => {
    if (raffleSelected.hasOwnProperty("NumbersAvailable")) {
      const actualProgress = raffleSelected.QuantNumbers - raffleSelected.NumbersAvailable.length;
      setProgress(actualProgress, raffleSelected.QuantNumbers);
      console.log(raffleSelected);
    }
  }, [raffleSelected]);

  useEffect(() => {
    const fetchRaffleParticipants = () => {
      if (raffleSelected.hasOwnProperty("_id") && participants.length === 0) {
        console.log("executando participantes da rifa");
        api
          .post("/edit-raffle/get-users", {
            id: raffleSelected._id,
          })
          .then((res) => {
            console.log(res.data);
            setParticipants(res.data);
          })
          .catch((error) => {
            console.log(error)
            setParticipants([]);
          });
      }
    };

    fetchRaffleParticipants();
  }, [setParticipants, raffleSelected]);

  useEffect(() => {
    function fetchWinner() {
      if (!winner.hasOwnProperty("_id") && raffleSelected.hasOwnProperty("_id")) {
        api.post("/edit-raffle/winner", { title: raffleSelected.title }).then((res) => {
          console.log(res.data);
          setWinner(res.data);
        });
      }
    }

    fetchWinner();
  }, [setWinner, raffleSelected]);

  useEffect(() => {
    const submitData = () => {
      if (isSubmitting) {
        const sendDataToDB = () => {
          const formData = new FormData();

          formData.append("id", raffleSelected._id);
          formData.append("raffleImage", raffleImage.file ? raffleImage.file : DefaultPrize);
          formData.append("title", title);
          formData.append("subtitle", subtitle);
          formData.append("description", description);
          formData.append("price", price);

          api
            .put("/edit-raffle/updating", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              raffleCreatedSuccess();
              setRaffleCreatedMessage("Rifa atualizada com sucesso");
              setRaffleSelected(res.data);
            })
            .catch((error) => {
              if (error) {
                setRaffleCreatedMessage("Ocorreu um erro na atualização da rifa");
              }

              errorExist();
              console.log(error);
            });
        };

        sendDataToDB();
      }
    };

    submitData();
  }, [isSubmitting]);

  useEffect(() => {
    if (isRaffleCreated) {
      setTimeout(() => {
        raffleCreatedCancel();
        submitCancel();
      }, 3000);
    }

    if (submitError) {
      setTimeout(() => {
        errorDontExist();
        submitCancel();
      }, 4000);
    }
  }, [isRaffleCreated, submitError]);

  useEffect(() => {
    console.log(
      participants.map((user) =>
        user.rafflesBuyed.filter((raffle) => raffle.raffleId === raffleSelected._id)
      )
    );
  }, []);

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

    setPrice(valueConverted);

    return valueConverted;
  }

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

  const onSubmit = (data) => {
    if (!raffleImage.file) {
      setRaffleImage({
        file: null,
        url: raffleImage.url,
      });
    }

    submitConfirm();
  };

  const finishRaffle = () => {
    if (finishNumber) {
      api
        .post("/edit-raffle/finish", {
          id: raffleSelected._id,
          number: finishNumber,
        })
        .then((res) => {
          setWinner(res.data);
          console.log(res.data);
          setFinishNumberError("");
        })
        .catch((error) => {
          console.log(error);
          if (error?.response.data === "Número não foi comprado, insira outro número") {
            setFinishNumberError(error.response.data);
            setWinner({});
          } else if (error?.response.data === "Usuário não encontrado, insira um novo número") {
            setFinishNumberError(error.response.data);
            setWinner({});
          } else {
            setFinishNumberError("Ocorreu um erro, insiro um novo número");
            setWinner({});
          }
        });
    } else {
      setFinishNumberError("");
      setWinner({});
    }
  };

  const resetWinner = () => {
    api
      .delete(`/edit-raffle/cancel/${winner._id}`)
      .then((res) => {
        if (res.data) {
          setWinner({});
          setFinishNumberFromFetch('');
          setFinishNumberError("");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="edit-raffle__content">
      <div className="edit-raffle__content__container">
        <h1 className="edit-raffle__content__container__title">Estatisticas</h1>

        <div className="edit-raffle__content__container__statistics-wrapper">
          <div className="edit-raffle__content__container__statistics-wrapper__progress-bar">
            <div
              className="edit-raffle__content__container__statistics-wrapper__progress-bar__bar"
              style={{ width: `${progress}%` }}
            >
              <p>{`${progress.toFixed(0)}%`}</p>
            </div>
          </div>

          <div className="edit-raffle__content__container__statistics-wrapper__numbers-buyed">
            {participants?.length !== 0 ? (
              participants.map((user) => (
                <NumberBuyedBox
                  key={user._id}
                  image={user.profileImage}
                  name={user.name}
                  numbers={
                    user.rafflesBuyed.filter((raffle) => raffle.raffleId === raffleSelected._id)[0]
                      ?.numbersBuyed
                  }
                  raffleImage={
                    user.rafflesBuyed.filter((raffle) => raffle.raffleId === raffleSelected._id)[0]
                      ?.raffleImage
                  }
                />
              ))
            ) : (
              <p>Nenhum número comprado no momento</p>
            )}
          </div>

          <textarea
            className="edit-raffle__content__container__statistics-wrapper__remaining-numbers"
            value={raffleSelected.NumbersAvailable?.map((number) => " " + number)}
            readOnly
          />
        </div>

        <h1 className="edit-raffle__content__container__title">Editar Rifa</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="edit-raffle__content__container__form">
          <label
            htmlFor="editRaffleImage"
            className="edit-raffle__content__container__form__image-label"
          >
            <div className="edit-raffle__content__container__form__image-label__image-box">
              <img
                src={raffleImage.url ? raffleImage.url : DefaultPrize}
                alt="Perfil"
                className="edit-raffle__content__container__form__image-label__image-box__image"
              />
            </div>

            <input
              {...register("editRaffleImage")}
              type="file"
              name="editRaffleImage"
              id="editRaffleImage"
              onChange={handleFileChange}
              className="edit-raffle__content__container__form__image-label__input"
            />
          </label>

          <div className="edit-raffle__content__container__form__inputs-box">
            <label
              htmlFor="editTitle"
              className="edit-raffle__content__container__form__inputs-box__label"
            >
              Título
              <input
                {...register("editTitle")}
                type="text"
                name="editTitle"
                id="editTitle"
                value={title}
                onChange={setTitle}
                className="edit-raffle__content__container__form__inputs-box__label__input"
              />
            </label>

            <label
              htmlFor="editSubtitle"
              className="edit-raffle__content__container__form__inputs-box__label"
            >
              Subtítulo
              <input
                {...register("editSubtitle")}
                type="text"
                name="editSubtitle"
                id="editSubtitle"
                value={subtitle}
                onChange={setSubtitle}
                className="edit-raffle__content__container__form__inputs-box__label__input"
              />
            </label>

            <label
              htmlFor="editDescription"
              className="edit-raffle__content__container__form__inputs-box__label"
            >
              Descrição
              <textarea
                {...register("editDescription")}
                id="editDescription"
                name="editDescription"
                value={description}
                onChange={setDescription}
                className="edit-raffle__content__container__form__inputs-box__label__textarea"
              />
            </label>

            <label
              htmlFor="editPrice"
              className="edit-raffle__content__container__form__inputs-box__label"
            >
              Preço por números
              <input
                {...register("editPrice")}
                type="text"
                name="editPrice"
                id="editPrice"
                value={price}
                onChange={(e) => coinMask(e)}
                className="edit-raffle__content__container__form__inputs-box__label__input"
              />
            </label>
          </div>

          <button type="submit" className="edit-raffle__content__container__form__submit-btn">
            Salvar
          </button>
        </form>

        <h1 className="edit-raffle__content__container__title">Finalizar rifa</h1>

        <div className="edit-raffle__content__container__finish-raffle-container">
          {winner.hasOwnProperty("_id") ? null : (
            <input
              type="text"
              value={finishNumber}
              onChange={setFinishNumber}
              placeholder="Insira número sorteado"
              style={finishNumberError ? { border: "2px solid rgb(209, 52, 52)" } : {}}
              className="edit-raffle__content__container__finish-raffle-container__input"
            />
          )}
          {finishNumberError && <span className="finish-number-error">{finishNumberError}</span>}

          {winner.hasOwnProperty("_id") ? (
            <button
              type="button"
              onClick={resetWinner}
              className="edit-raffle__content__container__finish-raffle-container__reset-btn"
            >
              Sortear Novamente
            </button>
          ) : (
            <button
              type="button"
              onClick={finishRaffle}
              className="edit-raffle__content__container__finish-raffle-container__finish-btn"
            >
              Finalizar
            </button>
          )}

          <div className="edit-raffle__content__container__finish-raffle-container__winner-display-box">
            {winner.hasOwnProperty("_id") ? (
              <div key={winner._id} className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box">
                <div className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__image-box">
                  <img
                    className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__image-box__image"
                    src={
                      winner.profileImage.data
                        ? `data:${winner.profileImage.contentType};base64,${_arrayBufferToBase64(
                            winner.profileImage.data.data
                          )}`
                        : NoUserPhoto
                    }
                    alt="Ganhador"
                  />
                </div>

                <div className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box">
                  <div className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box__contacts">
                    <h3 className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box__contacts__name">
                      {winner.name}
                    </h3>

                    <span>Contato: {winner.tel}</span>
                    <span>Email: {winner.email}</span>
                  </div>

                  <span className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box__winner-number">
                    Número: {winner.raffleNumber}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRaffleContent;
