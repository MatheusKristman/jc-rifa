import React, { useRef, useState } from "react";
import useQueryNumbersStore from "../../../stores/useQueryNumbersStore";
import useGeneralStore from "../../../stores/useGeneralStore";
import useRaffleStore from "../../../stores/useRaffleStore";
import api from "../../../services/api";
import { toast } from "react-toastify";

const QueryNumbersModal = () => {
  const { setToLoad, setNotToLoad, setToAnimateFadeIn, setToAnimateFadeOut } =
    useGeneralStore((state) => ({
      setToLoad: state.setToLoad,
      setNotToLoad: state.setNotToLoad,
      setToAnimateFadeIn: state.setToAnimateFadeIn,
      setToAnimateFadeOut: state.setToAnimateFadeOut,
    }));

  const { closeModal, setUserRafflesBuyed, setRafflesImagesUrls } =
    useQueryNumbersStore((state) => ({
      closeModal: state.closeModal,
      setUserRafflesBuyed: state.setUserRafflesBuyed,
      setRafflesImagesUrls: state.setRafflesImagesUrls,
    }));

  const { setRaffles } = useRaffleStore((state) => ({
    setRaffles: state.setRaffles,
  }));

  const [cpf, setCpf] = useState("");
  const [CPFError, setCPFError] = useState(false);

  const overlayRef = useRef();
  const boxRef = useRef();

  const handleCpfChange = (e) => {
    const { value } = e.target;

    const cpf = value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");

    return cpf;
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (cpf.length === 14) {
      setCPFError(false);
      setToLoad();
      setToAnimateFadeIn();

      api.get(`/account/get-raffle-numbers/${cpf}`).then((res) => {
        setUserRafflesBuyed(res.data);

        const rafflesFromUser = res.data;

        api
          .get("/raffle/get-all-raffles")
          .then((res) => {
            setRaffles(
              res.data.filter(
                (raffle, index) =>
                  raffle._id === rafflesFromUser[index].raffleId,
              ),
            );

            const rafflesBuyed = res.data.filter(
              (raffle, index) => raffle._id === rafflesFromUser[index].raffleId,
            );
            const urls = [];

            for (let i = 0; i < rafflesFromUser.length; i++) {
              for (let j = 0; j < rafflesBuyed.length; j++) {
                if (
                  rafflesFromUser[i].raffleId === rafflesBuyed[j]._id &&
                  rafflesBuyed[j].raffleImage
                ) {
                  if (
                    JSON.stringify(import.meta.env.MODE) ===
                    JSON.stringify("development")
                  ) {
                    urls.push(
                      `${import.meta.env.VITE_API_KEY_DEV}${
                        import.meta.env.VITE_API_PORT
                      }/raffle-uploads/${rafflesBuyed[j].raffleImage}`,
                    );
                  } else {
                    urls.push(
                      `${import.meta.env.VITE_API_KEY}/raffle-uploads/${
                        rafflesBuyed[j].raffleImage
                      }`,
                    );
                  }
                } else {
                  urls.push(null);
                }
              }
            }

            setRafflesImagesUrls(urls);
          })
          .catch((error) => {
            console.error(error);

            toast.error("Nenhum número encontrado nesse CPF", {
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
          .finally(() => {
            setToAnimateFadeOut();

            overlayRef.current.style.animation =
              "loginFadeOut 0.4s ease forwards";
            boxRef.current.style.animation = "loginBoxOut 0.4s ease forwards";

            setTimeout(() => {
              closeModal();
              setNotToLoad();
            }, 400);
          });
      });
    } else {
      setCPFError(true);
    }
  };

  const handleCloseModalOnOverlay = (e) => {
    if (
      e.target.classList.contains("query-numbers__query-numbers-modal-overlay")
    ) {
      overlayRef.current.style.animation = "loginFadeOut 0.4s ease forwards";
      boxRef.current.style.animation = "loginBoxOut 0.4s ease forwards";

      setTimeout(() => {
        closeModal();
      }, 400);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleCloseModalOnOverlay}
      className="query-numbers__query-numbers-modal-overlay"
    >
      <div
        ref={boxRef}
        className="query-numbers__query-numbers-modal-overlay__box"
      >
        <div className="query-numbers__query-numbers-modal-overlay__box__container">
          <h3 className="query-numbers__query-numbers-modal-overlay__box__container__title">
            Buscar compras
          </h3>

          <form className="query-numbers__query-numbers-modal-overlay__box__container__form">
            <label
              htmlFor="queryNumber"
              className="query-numbers__query-numbers-modal-overlay__box__container__form__label"
            >
              Informe seu CPF
              <input
                type="text"
                autoComplete="off"
                autoCorrect="off"
                name="queryNumber"
                id="queryNumber"
                value={cpf}
                onChange={(event) => setCpf(handleCpfChange(event))}
                style={CPFError ? { border: "2px solid rgb(209, 52, 52)" } : {}}
                className="query-numbers__query-numbers-modal-overlay__box__container__form__label__input"
              />
              {CPFError && (
                <span className="query-numbers__query-numbers-modal-overlay__box__container__form__label__error">
                  {cpf.length === 0 ? "Campo obrigatório" : "CPF Invalido"}
                </span>
              )}
            </label>

            <button
              type="button"
              onClick={handleSearch}
              className="query-numbers__query-numbers-modal-overlay__box__container__form__submit-btn"
            >
              Buscar compras
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QueryNumbersModal;
