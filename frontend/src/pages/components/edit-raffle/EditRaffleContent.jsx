import React, { useEffect, useLayoutEffect, useState } from "react";
import * as Yup from "yup";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import useRaffleStore from "../../../stores/useRaffleStore";
import useGeneralStore from "../../../stores/useGeneralStore";
import api from "../../../services/api";
import NumberBuyedBox from "./NumberBuyedBox";
import DefaultPrize from "../../../assets/default-prize.jpg";
import NoUserPhoto from "../../../assets/no-user-photo.png";
import NumberBuyedLoading from "./NumberBuyedLoading";
import WinnerLoading from "./WinnerLoading";

const schema = Yup.object().shape({
  editTitle: Yup.string().required("Título é obrigatório"),
  editSubtitle: Yup.string().required("Subtítulo é obrigatório"),
  editDescription: Yup.string(),
  editPrice: Yup.string().required("Preço é obrigatório"),
});

const EditRaffleContent = () => {
  const {
    progress,
    setProgress,
    activateDeleteConfirmationAnimation,
    openDeleteConfirmation,
    setIdSelected,
  } = useRaffleStore(
    (state) => ({
      progress: state.progress,
      setProgress: state.setProgress,
      activateDeleteConfirmationAnimation:
        state.activateDeleteConfirmationAnimation,
      openDeleteConfirmation: state.openDeleteConfirmation,
      setIdSelected: state.setIdSelected,
    }),
    shallow,
  );

  const {
    setToLoad,
    setNotToLoad,
    setToAnimateFadeIn,
    setToAnimateFadeOut,
    setLoadingMessage,
  } = useGeneralStore((state) => ({
    isLoading: state.isLoading,
    setToLoad: state.setToLoad,
    setNotToLoad: state.setNotToLoad,
    setToAnimateFadeIn: state.setToAnimateFadeIn,
    setToAnimateFadeOut: state.setToAnimateFadeOut,
    setLoadingMessage: state.setLoadingMessage,
  }));

  const [editRaffleData, setEditRaffleData] = useState({
    raffleImage: null,
    title: "",
    subtitle: "",
    description: "",
    price: "",
  });
  const [raffleSelected, setRaffleSelected] = useState({});
  const [winner, setWinner] = useState({});
  const [profilesImagesUrls, setProfilesImagesUrls] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isParticipantsFetching, setIsParticipantsFetching] = useState(false);
  const [isWinnerChoosing, setIsWinnerChoosing] = useState(false);
  const [isWinnerDeleting, setIsWinnerDeleting] = useState(false);
  const [isWinnerFetching, setIsWinnerFetching] = useState(false);
  const [enabledToDelete, setEnabledToDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableNumbers, setAvailableNumbers] = useState(0);
  const [buyedNumbers, setBuyedNumbers] = useState(0);
  const [actualRaffleImageUrl, setActualRaffleImageUrl] = useState("");
  const [finishNumberError, setFinishNumberError] = useState("");
  const [winnerImageUrl, setWinnerImageUrl] = useState("");
  const [finishNumber, setFinishNumber] = useState("");

  const navigate = useNavigate();

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const { id } = useParams();

  const resetEditRaffle = () => {
    setWinner({});
    setParticipants([]);
    setRaffleSelected({});
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

    setEditRaffleData((prev) => ({ ...prev, price: valueConverted }));

    return valueConverted;
  }

  const handleFileChange = async (e) => {
    const file = await e.target.files[0];

    if (!file) {
      return;
    }

    if (file && file.type.startsWith("image/")) {
      setActualRaffleImageUrl(URL.createObjectURL(file));
      setEditRaffleData((prev) => ({ ...prev, raffleImage: file }));
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

  const submitConfirm = () => {
    setIsSubmitting(true);
  };

  const submitCancel = () => {
    setIsSubmitting(false);
  };

  const onSubmit = (data) => {
    submitConfirm();
  };

  const finishRaffle = () => {
    if (finishNumber) {
      setIsWinnerChoosing(true);

      api
        .post("/raffle/generate-a-winner", {
          id: raffleSelected._id,
          number: finishNumber,
        })
        .then((res) => {
          setWinner(res.data);
          setEnabledToDelete(true);

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
          setIsWinnerChoosing(false);
        });
    } else {
      setFinishNumberError("");
      setWinner({});
    }
  };

  const resetWinner = () => {
    setIsWinnerDeleting(true);

    api
      .delete(`/winner/delete-winner/${winner.winnerId}`)
      .then((res) => {
        if (res.data) {
          setWinner({});
          setFinishNumber("");
          setFinishNumberError("");
          setEnabledToDelete(false);

          toast.success("Ganhador removido com sucesso", {
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
      })
      .catch((error) => {
        console.error(error);
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
            theme: "colored",
          },
        );
      })
      .finally(() => {
        setIsWinnerDeleting(false);
      });
  };

  const handleBackButton = () => {
    resetEditRaffle();
    setEnabledToDelete(false);
    navigate("/raffle-management");
  };

  const openDeleteConfirmationModal = () => {
    openDeleteConfirmation();
    activateDeleteConfirmationAnimation();
    setIdSelected(raffleSelected._id);
  };

  const handleDeleteButton = () => {
    openDeleteConfirmationModal();
  };

  const handleFormChange = (option, value) => {
    setEditRaffleData((prev) => ({ ...prev, [option]: value }));
  };

  useLayoutEffect(() => {
    const fetchRaffleParticipants = (id) => {
      setIsParticipantsFetching(true);

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
          console.error(error);
          setParticipants([]);
        })
        .finally(() => {
          setIsParticipantsFetching(false);
        });
    };

    function fetchWinner(raffleId) {
      if (!winner.hasOwnProperty("_id")) {
        setIsWinnerFetching(true);

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
            console.error(error);
          })
          .finally(() => {
            setIsWinnerFetching(false);
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

          setAvailableNumbers(
            res.data.quantNumbers - res.data.quantBuyedNumbers,
          );
          setBuyedNumbers(res.data.quantBuyedNumbers);
          setEnabledToDelete(res.data.isFinished);

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

          setEditRaffleData((prev) => ({
            ...prev,
            title: res.data.title,
            subtitle: res.data.subtitle,
            description: res.data.description,
            price: res.data.price,
          }));

          setValue("editTitle", res.data.title);
          setValue("editSubtitle", res.data.subtitle);
          setValue("editDescription", res.data.description);
          setValue("editPrice", res.data.price);

          setFinishNumberError("");
          setParticipants([]);
          setWinner({});
          setFinishNumber("");

          fetchWinner(res.data._id);
          fetchRaffleParticipants(res.data._id);
        })
        .catch((error) => {
          console.error(error);
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
          formData.append("raffleImage", editRaffleData.raffleImage);
          formData.append("title", editRaffleData.title);
          formData.append("subtitle", editRaffleData.subtitle);
          formData.append("description", editRaffleData.description);
          formData.append("price", editRaffleData.price);

          api
            .put("/raffle/update-raffle", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              setRaffleSelected(res.data);

              toast.success("Rifa atualizada com sucesso", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });

              setToAnimateFadeOut();

              setTimeout(() => {
                setNotToLoad();
              }, 400);
            })
            .catch((error) => {
              toast.error("Ocorreu um erro na atualização da rifa", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });

              console.error(error);

              setToAnimateFadeOut();

              setTimeout(() => {
                setNotToLoad();
              }, 400);
            })
            .finally(() => {
              submitCancel();
            });
        };

        sendDataToDB();
      }
    };

    submitData();
  }, [isSubmitting]);

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
            disabled={!enabledToDelete}
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
            {isParticipantsFetching ? (
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
            {isParticipantsFetching ? (
              <NumberBuyedLoading />
            ) : (
              <>
                <div className="edit-raffle__content__container__statistics-wrapper__numbers-status__numbers-quant">
                  <h3 className="edit-raffle__content__container__statistics-wrapper__numbers-status__numbers-quant__quant">
                    {availableNumbers}
                  </h3>
                  <p className="edit-raffle__content__container__statistics-wrapper__numbers-status__numbers-quant__desc">
                    Disponível
                  </p>
                </div>
                <div className="edit-raffle__content__container__statistics-wrapper__numbers-status__numbers-quant">
                  <h3 className="edit-raffle__content__container__statistics-wrapper__numbers-status__numbers-quant__quant">
                    {buyedNumbers}
                  </h3>
                  <p className="edit-raffle__content__container__statistics-wrapper__numbers-status__numbers-quant__desc">
                    Comprados
                  </p>
                </div>
              </>
            )}
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
                value={editRaffleData.title}
                onChange={(event) =>
                  handleFormChange("title", event.target.value)
                }
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
                value={editRaffleData.subtitle}
                onChange={(event) =>
                  handleFormChange("subtitle", event.target.value)
                }
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
                value={editRaffleData.description}
                onChange={(event) =>
                  handleFormChange("description", event.target.value)
                }
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
                value={editRaffleData.price}
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
            disabled={isSubmitting}
            className="edit-raffle__content__container__form__submit-btn"
          >
            Salvar
          </button>
        </form>

        <h1 className="edit-raffle__content__container__title">
          Finalizar rifa
        </h1>

        <div className="edit-raffle__content__container__finish-raffle-container">
          {isWinnerFetching ? <WinnerLoading /> : null}
          {winner.hasOwnProperty("winnerId") ? null : (
            <input
              type="text"
              value={finishNumber}
              onChange={(event) => setFinishNumber(event.target.value)}
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
              disabled={isWinnerDeleting}
              className="edit-raffle__content__container__finish-raffle-container__reset-btn"
            >
              {isWinnerDeleting ? "Deletando Ganhador" : "Sortear Novamente"}
            </button>
          ) : (
            <button
              type="button"
              onClick={finishRaffle}
              disabled={isWinnerChoosing}
              className="edit-raffle__content__container__finish-raffle-container__finish-btn"
            >
              {isWinnerChoosing ? "Finalizando" : "Finalizar"}
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
