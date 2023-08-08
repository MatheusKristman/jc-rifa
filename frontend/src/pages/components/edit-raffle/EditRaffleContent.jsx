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
    isDeletingWinner,
    setToDeleteWinner,
    setNotToDeleteWinner,
    isFetchingWinner,
    setToFetchWinner,
    setNotToFetchWinner,
    activateDeleteConfirmationAnimation,
    openDeleteConfirmation,
    resetOnEditRaffle,
    isDeleteButtonEnabled,
    enableDeleteButton,
    disableDeleteButton,
    profilesImagesUrls,
    setProfilesImagesUrls,
    winnerImageUrl,
    setWinnerImageUrl,
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
      isDeletingWinner: state.isDeletingWinner,
      setToDeleteWinner: state.setToDeleteWinner,
      setNotToDeleteWinner: state.setNotToDeleteWinner,
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
      profilesImagesUrls: state.profilesImagesUrls,
      setProfilesImagesUrls: state.setProfilesImagesUrls,
      winnerImageUrl: state.winnerImageUrl,
      setWinnerImageUrl: state.setWinnerImageUrl,
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

          const actualWinner = res.data;

          setFinishNumberError("");

          if (actualWinner.profileImage) {
            if (
              JSON.stringify(import.meta.env.MODE) ===
              JSON.stringify("development")
            ) {
              setWinnerImageUrl(
                `${import.meta.env.VITE_API_KEY_DEV}${
                  import.meta.env.VITE_API_PORT
                }/user-uploads/${actualWinner.profileImage}`,
              );
            } else {
              setWinnerImageUrl(
                `${import.meta.env.VITE_API_KEY}/user-uploads/${
                  actualWinner.profileImage
                }`,
              );
            }
          } else {
            setWinnerImageUrl(null);
          }
        })
        .catch((error) => {
          console.log(error);
          if (
            error?.response.data ===
            "Número não foi comprado, insira outro número"
          ) {
            setFinishNumberError(error.response.data);
            setWinner({});
          } else {
            setFinishNumberError("Ocorreu um erro, insiro um novo número");
            setWinner({});
          }
        })
        .finally(() => {
          setNotToChooseWinner();
        });
    } else {
      setFinishNumberError("");
      setWinner({});
    }
  };

  const resetWinner = () => {
    setToDeleteWinner();

    api
      .delete(`/winner/delete-winner/${winner.winnerId}`)
      .then((res) => {
        if (res.data) {
          setWinner({});
          setFinishNumberFromFetch("");
          setFinishNumberError("");

          toast.success("Ganhador removido com sucesso", {
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
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Ocorreu um erro ao remover ganhador da Rifa, tente novamente",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          },
        );
      })
      .finally(() => {
        setNotToDeleteWinner();
      });
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
    const fetchRaffleParticipants = (id) => {
      if (participants.length === 0) {
        console.log("Carregando participantes");

        setToLoadUsersNumberBuyed();

        api
          .post("/account/get-users-with-raffle-numbers", {
            id,
          })
          .then((res) => {
            setParticipants(res.data);

            const allParticipants = res.data;

            const profilesUrls = [];

            for (let i = 0; i < allParticipants.length; i++) {
              if (allParticipants[i].profileImage) {
                if (
                  JSON.stringify(import.meta.env.MODE) ===
                  JSON.stringify("development")
                ) {
                  profilesUrls.push(
                    `${import.meta.env.VITE_API_KEY_DEV}${
                      import.meta.env.VITE_API_PORT
                    }/user-uploads/${allParticipants[i].profileImage}`,
                  );
                } else {
                  profilesUrls.push(
                    `${import.meta.env.VITE_API_KEY}/user-uploads/${
                      allParticipants[i].profileImage
                    }`,
                  );
                }
              } else {
                profilesUrls.push(null);
              }
            }

            setProfilesImagesUrls(profilesUrls);
          })
          .catch((error) => {
            console.log(error);
            setParticipants([]);
          })
          .finally(() => {
            setNotToLoadUsersNumberBuyed();
            console.log("finalizado carregamento dos participantes");
          });
      }
    };

    function fetchWinner(raffleId) {
      if (!winner.hasOwnProperty("_id")) {
        setToFetchWinner();

        api
          .post("/winner/get-winner", { raffleId })
          .then((res) => {
            setWinner(res.data);

            const actualWinner = res.data;

            setFinishNumberError("");

            if (actualWinner.profileImage) {
              if (
                JSON.stringify(import.meta.env.MODE) ===
                JSON.stringify("development")
              ) {
                setWinnerImageUrl(
                  `${import.meta.env.VITE_API_KEY_DEV}${
                    import.meta.env.VITE_API_PORT
                  }/user-uploads/${actualWinner.profileImage}`,
                );
              } else {
                setWinnerImageUrl(
                  `${import.meta.env.VITE_API_KEY}/user-uploads/${
                    actualWinner.profileImage
                  }`,
                );
              }
            } else {
              setWinnerImageUrl(null);
            }
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setNotToFetchWinner();
          });
      }
    }

    const fetchRaffleSelected = (id) => {
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

          fetchWinner(res.data._id);
          fetchRaffleParticipants(res.data._id);

          console.log("peguei os dados");
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setToAnimateFadeOut();

          setTimeout(() => {
            setNotToLoad();
          }, 400);
        });
    };

    fetchRaffleSelected(id);
  }, []);

  useEffect(() => {
    if (
      raffleSelected?.hasOwnProperty("quantNumbers") &&
      raffleSelected?.hasOwnProperty("quantBuyedNumbers")
    ) {
      setProgress(
        raffleSelected.quantBuyedNumbers,
        raffleSelected.quantNumbers,
      );
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
    if (raffleSelected?.hasOwnProperty("_id")) {
      enableDeleteButton();
    }
  }, [raffleSelected, participants]);

  useEffect(() => {
    console.log("winner: ", winner);
  }, [winner]);

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
            onClick={() => handleDeleteButton(raffleSelected?._id)}
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
              participants.map((user, userIndex) => {
                return user.rafflesBuyed.map((raffle) => (
                  <NumberBuyedBox
                    key={user.id}
                    image={profilesImagesUrls[userIndex]}
                    name={user.name}
                    numbers={raffle.numbersBuyed}
                  />
                ));
              })
            ) : (
              <p>Nenhum número comprado no momento</p>
            )}
          </div>

          <div className="edit-raffle__content__container__statistics-wrapper__numbers-status">
            <div className="edit-raffle__content__container__statistics-wrapper__numbers-status__numbers-quant">
              <h3 className="edit-raffle__content__container__statistics-wrapper__numbers-status__numbers-quant__quant">
                {raffleSelected?.quantNumbers -
                  raffleSelected?.quantBuyedNumbers}
              </h3>
              <p className="edit-raffle__content__container__statistics-wrapper__numbers-status__numbers-quant__desc">
                Disponível
              </p>
            </div>
            <div className="edit-raffle__content__container__statistics-wrapper__numbers-status__numbers-quant">
              <h3 className="edit-raffle__content__container__statistics-wrapper__numbers-status__numbers-quant__quant">
                {raffleSelected?.quantBuyedNumbers}
              </h3>
              <p className="edit-raffle__content__container__statistics-wrapper__numbers-status__numbers-quant__desc">
                Comprados
              </p>
            </div>
          </div>
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
          {winner.hasOwnProperty("winnerId") ? null : (
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

          {winner.hasOwnProperty("winnerId") ? (
            <button
              type="button"
              onClick={resetWinner}
              disabled={isDeletingWinner}
              className="edit-raffle__content__container__finish-raffle-container__reset-btn"
            >
              {isDeletingWinner ? "Deletando Ganhador" : "Sortear Novamente"}
            </button>
          ) : (
            <button
              type="button"
              onClick={finishRaffle}
              disabled={isChoosingWinner}
              className="edit-raffle__content__container__finish-raffle-container__finish-btn"
            >
              {isChoosingWinner ? "Finalizando" : "Finalizar"}
            </button>
          )}

          <div className="edit-raffle__content__container__finish-raffle-container__winner-display-box">
            {winner.hasOwnProperty("winnerId") ? (
              <div
                key={winner.name}
                className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box"
              >
                <div className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__image-box">
                  <img
                    className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__image-box__image"
                    src={winnerImageUrl || NoUserPhoto}
                    alt="Ganhador"
                  />
                </div>

                <div className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box">
                  <div className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box__contacts">
                    <h3 className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box__contacts__name">
                      {winner.name}
                    </h3>

                    <div className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box__contacts__contact-wrapper">
                      <span className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box__contacts__contact-wrapper__label">
                        Contato:{" "}
                      </span>

                      <span className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box__contacts__contact-wrapper__value">
                        {winner.tel}
                      </span>
                    </div>

                    <div className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box__contacts__email-wrapper">
                      <span className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box__contacts__email-wrapper__label">
                        Email:{" "}
                      </span>

                      <span className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box__contacts__email-wrapper__value">
                        {winner.email}
                      </span>
                    </div>
                  </div>

                  <div className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box__winner-number-box">
                    <span className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box__winner-number-box__label">
                      Número
                    </span>

                    <span className="edit-raffle__content__container__finish-raffle-container__winner-display-box__winner-box__info-box__winner-number-box__winner-number">
                      {winner.raffleNumber}
                    </span>
                  </div>
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
