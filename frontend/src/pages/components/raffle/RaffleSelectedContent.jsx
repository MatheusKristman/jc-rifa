import React, { useEffect } from "react";
import {
  BsFacebook,
  BsTelegram,
  BsTwitter,
  BsWhatsapp,
  BsCart,
  BsCheck2Circle,
} from "react-icons/bs";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { Link, useParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import buyingLoading from "../../../assets/buying-loading.svg";
import PrizeDisplayed from "../PrizeDisplayed";
import useRaffleStore from "../../../stores/useRaffleStore";
import api from "../../../services/api";
import useBuyNumbersStore from "../../../stores/useBuyNumbersStore";
import useUserStore from "../../../stores/useUserStore";
import useHeaderStore from "../../../stores/useHeaderStore";
import useGeneralStore from "../../../stores/useGeneralStore";
import { toast } from "react-toastify";

// TODO adaptar criação e outras paginas para receber o novo formato da rifa

const RaffleSelectedContent = () => {
  const {
    raffleSelected,
    setRaffleSelected,
    raffleSelectedImageUrl,
    setRaffleSelectedImageUrl,
  } = useRaffleStore((state) => ({
    raffleSelected: state.raffleSelected,
    setRaffleSelected: state.setRaffleSelected,
    raffleSelectedImageUrl: state.raffleSelectedImageUrl,
    setRaffleSelectedImageUrl: state.setRaffleSelectedImageUrl,
  }));

  const {
    numberQuant,
    incrementNumberQuant,
    decrementNumberQuant,
    openPaymentModal,
    isBuying,
    setToBuy,
    setToNotBuy,
    setQrCodePayment,
    setPaymentLink,
  } = useBuyNumbersStore(
    (state) => ({
      numberQuant: state.numberQuant,
      incrementNumberQuant: state.incrementNumberQuant,
      decrementNumberQuant: state.decrementNumberQuant,
      openPaymentModal: state.openPaymentModal,
      isBuying: state.isBuying,
      setToBuy: state.setToBuy,
      setToNotBuy: state.setToNotBuy,
      setQrCodePayment: state.setQrCodePayment,
      setPaymentLink: state.setPaymentLink,
    }),
    shallow,
  );

  const { openLogin } = useHeaderStore((state) => ({
    openLogin: state.openLogin,
  }));

  const { user, isUserLogged, setUser } = useUserStore((state) => ({
    user: state.user,
    isUserLogged: state.isUserLogged,
    setUser: state.setUser,
  }));

  const { isRaffleLoading, setToRaffleLoad, setToRaffleNotLoad } =
    useGeneralStore((state) => ({
      isRaffleLoading: state.isRaffleLoading,
      setToRaffleLoad: state.setToRaffleLoad,
      setToRaffleNotLoad: state.setToRaffleNotLoad,
    }));
  const { selected } = useParams();

  useEffect(() => {
    setRaffleSelected({});
    setQrCodePayment("");
    setPaymentLink("");
    setToNotBuy();
  }, []);

  useEffect(() => {
    const fetchRaffleSelected = () => {
      if (!raffleSelected.hasOwnProperty("_id")) {
        setToRaffleLoad();
        console.log(selected);
        api
          .get(`/raffle/get-raffle-selected/${selected}`)
          .then((res) => {
            setRaffleSelected(res.data);

            let url = "";
            if (res.data.raffleImage) {
              if (
                JSON.stringify(import.meta.env.MODE) ===
                JSON.stringify("development")
              ) {
                url = `${import.meta.env.VITE_API_KEY_DEV}${
                  import.meta.env.VITE_API_PORT
                }/raffle-uploads/${res.data.raffleImage}`;
              } else {
                url = `${import.meta.env.VITE_API_KEY}/raffle-uploads/${
                  res.data.raffleImage
                }`;
              }
            } else {
              url = null;
            }

            setRaffleSelectedImageUrl(url);

            setToRaffleNotLoad();
          })
          .catch((error) => console.log(error));
      }
    };

    fetchRaffleSelected();
  }, [setRaffleSelected, raffleSelected]);

  useEffect(() => {
    console.log(raffleSelected);
  }, [raffleSelected]);

  useEffect(() => {
    if (isBuying) {
      document.documentElement.style.overflowY = "hidden";
    } else {
      document.documentElement.style.overflowY = "unset";
    }
  }, [isBuying]);

  function calcValues(value, factor) {
    const valueFormated = convertCurrencyToNumber(value);
    const calc = valueFormated * factor;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(calc);
  }

  function convertCurrencyToNumber(value) {
    if (value) {
      const onlyDigits = value.replace(/[^\d,-]/g, "");
      const digitsFloat = onlyDigits.replace(",", ".");
      const numberValue = parseFloat(digitsFloat);

      return numberValue;
    }
  }

  const convertProgress = (current, total) => {
    return (100 * current) / total;
  };

  const handleBuy = () => {
    if (numberQuant === 0 || raffleSelected.isFinished) {
      return; // colocar alerta para informar para selecionar um número
    }

    if (
      numberQuant <=
        raffleSelected.quantNumbers - raffleSelected.quantBuyedNumbers &&
      isUserLogged
    ) {
      setToBuy();

      const priceNumber = convertCurrencyToNumber(raffleSelected.price);

      const data = {
        id: user._id,
        fullPrice: priceNumber * numberQuant,
        title: raffleSelected.title,
        email: user.email,
        firstName: user.name.split(" ")[0],
        lastName: user.name.split(" ").slice(1).join(" "),
        cpf: user.cpf,
      };
      api
        .post(`/payment/payment-management`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data.response.response);

          const qrCode =
            res.data.response.response.point_of_interaction.transaction_data
              .qr_code;
          const ticketUrl =
            res.data.response.response.point_of_interaction.transaction_data
              .ticket_url;

          api
            .post("/account/raffle-buy", {
              id: user._id,
              raffleId: raffleSelected._id,
              paymentId: res.data.response.response.id,
              pricePaid: res.data.response.response.transaction_amount,
              status: res.data.response.response.status,
              numberQuant: numberQuant,
            })
            .then((res) => {
              setQrCodePayment(qrCode);
              setPaymentLink(ticketUrl);

              openPaymentModal();

              setToNotBuy();

              setUser(res.data);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.error(error);
          setToNotBuy();

          toast.error(
            "Ocorreu um erro durante a compra, tente novamente mais tarde",
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
        });
    } else if (
      numberQuant >
      raffleSelected.quantNumbers - raffleSelected.quantBuyedNumbers
    ) {
      toast.error(
        "Selecione a quantidade até " + numbersAvailableToBuy.length,
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
    } else {
      openLogin();
    }
  };

  return (
    <div className="raffle-selected__raffle-selected-content">
      <div className="raffle-selected__raffle-selected-content__container">
        <div className="raffle-selected__raffle-selected-content__container__raffle-displayed">
          <PrizeDisplayed
            image={raffleSelectedImageUrl || null}
            title={raffleSelected.title}
            subtitle={raffleSelected.subtitle}
            progress={convertProgress(
              raffleSelected?.QuantNumbers -
                raffleSelected?.NumbersAvailable?.length,
              raffleSelected?.QuantNumbers,
            )}
            winner={raffleSelected?.isFinished}
          />
        </div>

        <span className="raffle-selected__raffle-selected-content__container__price-tag">
          POR APENAS <strong>{raffleSelected.price}</strong>
        </span>

        <div className="raffle-selected__raffle-selected-content__container__desc-card">
          <p className="raffle-selected__raffle-selected-content__container__desc-card__desc">
            {raffleSelected.description}
          </p>
        </div>

        <div className="raffle-selected__raffle-selected-content__container__social-wrapper">
          <a
            href={`${import.meta.env.VITE_WHATSAPP_BASE_API}`}
            target="_blank"
            rel="norefferer noopener"
            className="raffle-selected__raffle-selected-content__container__social-wrapper__social"
          >
            <BsWhatsapp />
          </a>
        </div>

        <div className="raffle-selected__raffle-selected-content__container__title-wrapper">
          <h1 className="raffle-selected__raffle-selected-content__container__title-wrapper__title">
            ⚡ Cotas
          </h1>

          <span className="raffle-selected__raffle-selected-content__container__title-wrapper__desc">
            Escolha sua sorte
          </span>
        </div>

        <Link
          to="/query-numbers"
          className="raffle-selected__raffle-selected-content__container__link-query-numbers"
        >
          <BsCart /> Ver meus números
        </Link>

        <div className="raffle-selected__raffle-selected-content__container__buy-numbers-box">
          <span className="raffle-selected__raffle-selected-content__container__buy-numbers-box__desc">
            Selecione a quantidade de números
          </span>

          <div
            className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper"
            style={
              raffleSelected.NumbersAvailable?.length === 0
                ? { pointerEvents: "none" }
                : {}
            }
          >
            <button
              onClick={() => incrementNumberQuant(10)}
              type="button"
              className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn"
            >
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>10
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>

            <button
              onClick={() => incrementNumberQuant(15)}
              type="button"
              className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn emphasis"
            >
              <span className="emphasis-tag">Mais popular</span>

              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>15
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>

            <button
              onClick={() => incrementNumberQuant(200)}
              type="button"
              className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn"
            >
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>200
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>

            <button
              onClick={() => incrementNumberQuant(250)}
              type="button"
              className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn"
            >
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>250
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>

            <button
              onClick={() => incrementNumberQuant(300)}
              type="button"
              className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn"
            >
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>300
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>

            <button
              onClick={() => incrementNumberQuant(350)}
              type="button"
              className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn"
            >
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>350
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>
          </div>

          <div
            className="raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper"
            style={
              raffleSelected.NumbersAvailable?.length === 0
                ? { pointerEvents: "none" }
                : {}
            }
          >
            <button
              onClick={() => {
                if (numberQuant !== 0) {
                  decrementNumberQuant(1);
                }
              }}
              type="button"
              className="raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper__btn"
            >
              <CiCircleMinus />
            </button>

            <div
              onClick={() => decrementNumberQuant(numberQuant)}
              className="raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper__selected-numbers-display"
            >
              {numberQuant}
            </div>

            <button
              onClick={() => incrementNumberQuant(1)}
              type="button"
              className="raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper__btn"
            >
              <CiCirclePlus />
            </button>
          </div>
        </div>

        <button
          onClick={handleBuy}
          type="button"
          style={
            isBuying
              ? {
                  filter: "brightness(80%)",
                  pointerEvents: "none",
                }
              : isRaffleLoading
              ? { pointerEvents: "none" }
              : raffleSelected.NumbersAvailable?.length === 0
              ? {
                  filter: "brightness(80%)",
                  pointerEvents: "none",
                }
              : {}
          }
          className="raffle-selected__raffle-selected-content__container__buy-btn"
        >
          {isBuying ? (
            <span className="raffle-selected__raffle-selected-content__container__buy-btn__desc">
              <img src={buyingLoading} alt="Processando..." />
            </span>
          ) : (
            <span className="raffle-selected__raffle-selected-content__container__buy-btn__desc">
              <BsCheck2Circle /> Participar do sorteio
            </span>
          )}

          <span className="raffle-selected__raffle-selected-content__container__buy-btn__price">
            {calcValues(raffleSelected.price, numberQuant)}
          </span>
        </button>
      </div>
    </div>
  );
};

export default RaffleSelectedContent;
