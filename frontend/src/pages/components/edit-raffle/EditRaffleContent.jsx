import React, { useEffect, useLayoutEffect } from "react";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import api from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import NumberBuyedBox from "./NumberBuyedBox";
import DefaultPrize from "../../../assets/default-prize.jpg";
import NoUserPhoto from "../../../assets/no-user-photo.png";
import useRaffleStore from "../../../stores/useRaffleStore";
import useNewRaffleStore from "../../../stores/useNewRaffleStore";
import _arrayBufferToBase64 from "../../../hooks/useArrayBufferToBase64";
import useGeneralStore from "../../../stores/useGeneralStore";
import NumberBuyedLoading from "./NumberBuyedLoading";
import WinnerLoading from "./WinnerLoading";
import Loading from "../Loading";

const schema = Yup.object().shape({
  editTitle: Yup.string().required("Título é obrigatório"),
  editSubtitle: Yup.string().required("Subtítulo é obrigatório"),
  editDescription: Yup.string(),
  editPrice: Yup.string().required("Preço é obrigatório"),
});

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
    isUsersNumberBuyedLoading,
    setToLoadUsersNumberBuyed,
    setNotToLoadUsersNumberBuyed,
    isChoosingWinner,
    setToChooseWinner,
    setNotToChooseWinner,
    isFetchingWinner,
    setToFetchWinner,
    setNotToFetchWinner,
    activateDeleteConfirmationAnimation,
    openDeleteConfirmation,
    resetOnEditRaffle,
    isDeleteButtonEnabled,
    enableDeleteButton,
    disableDeleteButton,
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
      isUsersNumberBuyedLoading: state.isUsersNumberBuyedLoading,
      setToLoadUsersNumberBuyed: state.setToLoadUsersNumberBuyed,
      setNotToLoadUsersNumberBuyed: state.setNotToLoadUsersNumberBuyed,
      isChoosingWinner: state.isChoosingWinner,
      setToChooseWinner: state.setToChooseWinner,
      setNotToChooseWinner: state.setNotToChooseWinner,
      isFetchingWinner: state.isFetchingWinner,
      setToFetchWinner: state.setToFetchWinner,
      setNotToFetchWinner: state.setNotToFetchWinner,
      activateDeleteConfirmationAnimation:
        state.activateDeleteConfirmationAnimation,
      openDeleteConfirmation: state.openDeleteConfirmation,
      resetOnEditRaffle: state.resetOnEditRaffle,
      isDeleteButtonEnabled: state.isDeleteButtonEnabled,
      enableDeleteButton: state.enableDeleteButton,
      disableDeleteButton: state.disableDeleteButton,
    }),
    shallow,
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
    actualRaffleImageUrl,
    setActualRaffleImageUrl,
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
      actualRaffleImageUrl: state.actualRaffleImageUrl,
      setActualRaffleImageUrl: state.setActualRaffleImageUrl,
    }),
    shallow,
  );

  const {
    setToLoad,
    setNotToLoad,
    setToAnimateFadeIn,
    setToAnimateFadeOut,
    isLoading,
    setLoadingMessage,
  } = useGeneralStore((state) => ({
    isLoading: state.isLoading,
    setToLoad: state.setToLoad,
    setNotToLoad: state.setNotToLoad,
    setToAnimateFadeIn: state.setToAnimateFadeIn,
    setToAnimateFadeOut: state.setToAnimateFadeOut,
    setLoadingMessage: state.setLoadingMessage,
  }));

  const navigate = useNavigate();

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const { id } = useParams();

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

    if (!file) {
      return;
    }

    if (file && file.type.startsWith("image/")) {
      setActualRaffleImageUrl(URL.createObjectURL(file));
      setRaffleImage(file);
    } else {
      toast.error("O arquivo selecionado não é uma imagem válida", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const onSubmit = (data) => {
    submitConfirm();
  };

  const finishRaffle = () => {
    if (finishNumber) {
      setToChooseWinner();
      api
        .post("/raffle/generate-a-winner", {
          id: raffleSelected._id,
          number: finishNumber,
        })
        .then((res) => {
          setWinner(res.data);
          setFinishNumberError("");
          setNotToChooseWinner();
        })
        .catch((error) => {
          console.log(error);
          setNotToChooseWinner();
          if (
            error?.response.data ===
            "Número não foi comprado, insira outro número"
          ) {
            setFinishNumberError(error.response.data);
            setWinner({});
          } else if (
            error?.response.data ===
            "Usuário não encontrado, insira um novo número"
          ) {
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
      .delete(`/winner/delete-winner/${winner._id}`)
      .then((res) => {
        if (res.data) {
          setWinner({});
          setFinishNumberFromFetch("");
          setFinishNumberError("");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleBackButton = () => {
    resetOnEditRaffle();
    disableDeleteButton();
    navigate("/raffle-management");
  };

  const openDeleteConfirmationModal = () => {
    openDeleteConfirmation();
    activateDeleteConfirmationAnimation();
  };

  const handleDeleteButton = (id) => {
    console.log("Abrir Modal", id);
    openDeleteConfirmationModal();
  };

  useLayoutEffect(() => {
    const fetchRaffleParticipants = () => {
      if (raffleSelected.hasOwnProperty("_id") && participants.length === 0) {
        setToLoadUsersNumberBuyed();
        api
          .post("/edit-raffle/get-users", {
            id: raffleSelected._id,
          })
          .then((res) => {
            setNotToLoadUsersNumberBuyed();
            setParticipants(res.data);
          })
          .catch((error) => {
            console.log(error);
            setParticipants([]);
            setNotToLoadUsersNumberBuyed();
          });
      }
    };

    function fetchWinner() {
      if (
        !winner.hasOwnProperty("_id") &&
        raffleSelected.hasOwnProperty("_id")
      ) {
        setToFetchWinner();
        api
          .post("/edit-raffle/winner", { title: raffleSelected.title })
          .then((res) => {
            setWinner(res.data);
            setNotToFetchWinner();
          })
          .catch((error) => {
            setNotToFetchWinner();
          });
      }
    }

    const fetchRaffleSelected = () => {
      setToLoad();
      setToAnimateFadeIn();
      setLoadingMessage("Aguarde um momento");

      api
        .get(`/raffle/get-raffle-selected/${id}`)
        .then((res) => {
          setRaffleSelected(res.data);
          if (res.data.raffleImage) {
            if (
              JSON.stringify(import.meta.env.MODE) ===
              JSON.stringify("development")
            ) {
              setActualRaffleImageUrl(
                `${import.meta.env.VITE_API_KEY_DEV}${
                  import.meta.env.VITE_API_PORT
                }/raffle-uploads/${res.data.raffleImage}`,
              );
            } else {
              setActualRaffleImageUrl(
                `${import.meta.env.VITE_API_KEY}/raffle-uploads/${
                  res.data.raffleImage
                }`,
              );
            }
          } else {
            setActualRaffleImageUrl(null);
          }

          setTitleFromFetch(res.data.title);
          setValue("editTitle", res.data.title);

          setSubtitleFromFetch(res.data.subtitle);
          setValue("editSubtitle", res.data.subtitle);

          setDescriptionFromFetch(res.data.description);
          setValue("editDescription", res.data.description);

          setPrice(res.data.price);
          setValue("editPrice", res.data.price);

          setFinishNumberError("");

          setParticipants([]);

          setWinner({});
          setFinishNumberFromFetch("");

          console.log("peguei os dados");
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          console.log("finalizado o loading dos raffle selected");
          fetchWinner();
          fetchRaffleParticipants();

          setToAnimateFadeOut();

          setTimeout(() => {
            setNotToLoad();
          }, 400);
        });
    };

    fetchRaffleSelected();
  }, []);

  useEffect(() => {
    if (raffleSelected.hasOwnProperty("NumbersAvailable")) {
      const actualProgress =
        raffleSelected.QuantNumbers - raffleSelected.NumbersAvailable.length;
      setProgress(actualProgress, raffleSelected.QuantNumbers);
    }
  }, [raffleSelected]);

  useEffect(() => {
    const submitData = () => {
      if (isSubmitting) {
        const sendDataToDB = () => {
          setToLoad();
          setLoadingMessage("Enviando dados editados, aguarde um momento");
          setToAnimateFadeIn();

          const formData = new FormData();

          formData.append("id", raffleSelected._id);
          formData.append("raffleImage", raffleImage);
          formData.append("title", title);
          formData.append("subtitle", subtitle);
          formData.append("description", description);
          formData.append("price", price);

          api
            .put("/raffle/update-raffle", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              raffleCreatedSuccess();
              setRaffleCreatedMessage("Rifa atualizada com sucesso");
              setRaffleSelected(res.data);

              setToAnimateFadeOut();

              setTimeout(() => {
                setNotToLoad();
              }, 400);
            })
            .catch((error) => {
              if (error) {
                setRaffleCreatedMessage(
                  "Ocorreu um erro na atualização da rifa",
                );
              }

              errorExist();
              console.log(error);

              setToAnimateFadeOut();

              setTimeout(() => {
                setNotToLoad();
              }, 400);
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
    if (raffleSelected.hasOwnProperty("_id")) {
      enableDeleteButton();
    }
  }, [raffleSelected, participants]);

  useEffect(() => {
    console.log("raffleSelected: ", raffleSelected);
  }, [raffleSelected]);

  return (
    <div className="edit-raffle__content">
      <div className="edit-raffle__content__container">
        <div className="edit-raffle__content__container__btns">
          <button
            onClick={handleBackButton}
            className="edit-raffle__content__container__btns__back-btn"
          >
            Voltar
          </button>

          <button
            type="button"
            onClick={() => handleDeleteButton(raffleSelected._id)}
            disabled={!isDeleteButtonEnabled}
            className="edit-raffle__content__container__btns__delete-btn"
          >
            Apagar
          </button>
        </div>

        <h1 className="edit-raffle__content__container__title">Estatísticas</h1>

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
            {isUsersNumberBuyedLoading ? (
              <NumberBuyedLoading />
            ) : participants?.length !== 0 ? (
              participants.map((user) => (
                <NumberBuyedBox
                  key={user._id}
                  image={user.profileImage}
                  name={user.name}
                  numbers={
                    user.rafflesBuyed.filter(
                      (raffle) => raffle.raffleId === raffleSelected._id,
                    )[0]?.numbersBuyed
                  }
                  raffleImage={
                    user.rafflesBuyed.filter(
                      (raffle) => raffle.raffleId === raffleSelected._id,
                    )[0]?.raffleImage
                  }
                />
              ))
            ) : (
              <p>Nenhum número comprado no momento</p>
            )}
          </div>

          <textarea
            className="edit-raffle__content__container__statistics-wrapper__remaining-numbers"
            value={raffleSelected.NumbersAvailable?.map(
              (number) => " " + number,
            )}
            readOnly
          />
        </div>

        <h1 className="edit-raffle__content__container__title">Editar Rifa</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="edit-raffle__content__container__form"
        >
          <label
            htmlFor="editRaffleImage"
            className="edit-raffle__content__container__form__image-label"
          >
            <div className="edit-raffle__content__container__form__image-label__image-box">
              <img
                src={actualRaffleImageUrl ? actualRaffleImageUrl : DefaultPrize}
                alt="Perfil"
                className="edit-raffle__content__container__form__image-label__image-box__image"
              />
            </div>

            <input
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
                style={
                  errors.editTitle
                    ? { border: "2px solid rgb(209, 52, 52)" }
                    : {}
                }
                className="edit-raffle__content__container__form__inputs-box__label__input"
              />
              {errors.editTitle && <span>{errors.editTitle?.message}</span>}
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
                style={
                  errors.editSubtitle
                    ? { border: "2px solid rgb(209, 52, 52)" }
                    : {}
                }
                className="edit-raffle__content__container__form__inputs-box__label__input"
              />
              {errors.editSubtitle && (
                <span>{errors.editSubtitle?.message}</span>
              )}
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
                style={
                  errors.editDescription
                    ? { border: "2px solid rgb(209, 52, 52)" }
                    : {}
                }
                className="edit-raffle__content__container__form__inputs-box__label__textarea"
              />
              {errors.editDescription && (
                <span>{errors.editDescription?.message}</span>
              )}
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
                style={
                  errors.editPrice
                    ? { border: "2px solid rgb(209, 52, 52)" }
                    : {}
                }
                className="edit-raffle__content__container__form__inputs-box__label__input"
              />
              {errors.editPrice && <span>{errors.editPrice?.message}</span>}
            </label>
          </div>

          <button
            type="submit"
            className="edit-raffle__content__container__form__submit-btn"
          >
            Salvar
          </button>
        </form>

        <h1 className="edit-raffle__content__container__title">
          Finalizar rifa
        </h1>

        <div className="edit-raffle__content__container__finish-raffle-container">
          {isFetchingWinner ? <WinnerLoading /> : null}
          {winner.hasOwnProperty("_id") ? null : (
            <input
              type="text"
              value={finishNumber}
              onChange={setFinishNumber}
              placeholder="Insira número sorteado"
              style={
                finishNumberError
                  ? { border: "2px solid rgb(209, 52, 52)" }
                  : {}
              }
              className="edit-raffle__content__container__finish-raffle-container__input"
            />
          )}
          {finishNumberError && (
            <span className="finish-number-error">{finishNumberError}</span>
          )}

          {isChoosingWinner ? (
            <button
              type="button"
              className="edit-raffle__content__container__finish-raffle-container__finishing-btn"
            >
              Finalizando
            </button>
          ) : winner.hasOwnProperty("_id") ? (
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
              <div
                key={winner._id}
                className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box"
              >
                <div className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__image-box">
                  <img
                    className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__image-box__image"
                    src={
                      winner.profileImage.data
                        ? `data:${
                            winner.profileImage.contentType
                          };base64,${_arrayBufferToBase64(
                            winner.profileImage.data.data,
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
