import React, { useEffect, useState } from "react";
import { BsWhatsapp, BsCart, BsCheck2Circle } from "react-icons/bs";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { Link, useParams } from "react-router-dom";
import { shallow } from "zustand/shallow";
import { toast } from "react-toastify";

import PrizeDisplayed from "../PrizeDisplayed";
import buyingLoading from "../../../assets/buying-loading.svg";
import api from "../../../services/api";
import useBuyNumbersStore from "../../../stores/useBuyNumbersStore";
import useUserStore from "../../../stores/useUserStore";
import useHeaderStore from "../../../stores/useHeaderStore";
import useGeneralStore from "../../../stores/useGeneralStore";

const RaffleSelectedContent = () => {
  const { openPaymentModal, setQrCodePayment, setPaymentLink, numberQuant, setNumberQuant } = useBuyNumbersStore();
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

  const [raffleSelected, setRaffleSelected] = useState({});
  const [raffleSelectedImageUrl, setRaffleSelectedImageUrl] = useState("");
  const [isBuying, setIsBuying] = useState(false);

  const { selected } = useParams();

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

  const incrementNumberQuant = (quant) => {
    if (
      numberQuant >=
      raffleSelected.quantNumbers - raffleSelected.quantBuyedNumbers
    ) {
      return;
    }

    setNumberQuant(numberQuant + quant);
  };

  const decrementNumberQuant = (quant) => {
    if (numberQuant === 0) {
      return;
    }

    setNumberQuant(numberQuant - quant);
  };

  const finishBuy = () => {
    if (numberQuant === 0) {
      toast.error("Selecione as quantidades de números que deseja comprar");
      return;
    }

    if (raffleSelected.isFinished) {
      toast.error("Essa rifa já foi finalizada, não é mais possivel comprar números");
      return;
    }

    if (numberQuant > raffleSelected.quantNumbers - raffleSelected.quantBuyedNumbers) {
      toast.error(`Selecione a quantidade até ${raffleSelected.quantNumbers - raffleSelected.quantBuyedNumbers}`);
      return;
    }

    openPaymentModal();
  }

  const handleBuy = () => {
    if (numberQuant === 0 || raffleSelected.isFinished) {
      return;
    }

    if (
      numberQuant <=
      raffleSelected.quantNumbers - raffleSelected.quantBuyedNumbers &&
      isUserLogged
    ) {
      setIsBuying(true);

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

              decrementNumberQuant(numberQuant);

              setIsBuying(false);
              setUser(res.data);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);

          setIsBuying(false);

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
              theme: "colored",
            },
          );
        });
    } else if (
      numberQuant >
      raffleSelected.quantNumbers - raffleSelected.quantBuyedNumbers
    ) {
      toast.error(
        `Selecione a quantidade até ${raffleSelected.quantNumbers - raffleSelected.quantBuyedNumbers
        }`,
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
    } else {
      openLogin();
    }
  };

  useEffect(() => {
    setRaffleSelected({});
    setQrCodePayment("");
    setPaymentLink("");
    // setIsBuying(false);
  }, []);

  useEffect(() => {
    const fetchRaffleSelected = () => {
      if (!raffleSelected?.hasOwnProperty("_id")) {
        setToRaffleLoad();

        api
          .get(`/raffle/get-raffle-selected/${selected}`)
          .then((res) => {
            setRaffleSelected(res.data);

            let url = "";
            const raffle = res.data;

            if (raffle.raffleImage) {
              if (
                JSON.stringify(import.meta.env.MODE) ===
                JSON.stringify("development")
              ) {
                url = `${import.meta.env.VITE_API_KEY_DEV}${import.meta.env.VITE_API_PORT
                  }/raffle-uploads/${raffle.raffleImage}`;
              } else {
                url = `${import.meta.env.VITE_API_KEY}/raffle-uploads/${raffle.raffleImage
                  }`;
              }
            } else {
              url = null;
            }

            setRaffleSelectedImageUrl(url);

            setToRaffleNotLoad();
          })
          .catch((error) => console.error(error));
      }
    };

    fetchRaffleSelected();
  }, [setRaffleSelected, raffleSelected]);

  useEffect(() => {
    if (isBuying) {
      document.documentElement.style.overflowY = "hidden";
    } else {
      document.documentElement.style.overflowY = "unset";
    }
  }, [isBuying]);

  return (
    <div className="raffle-selected__raffle-selected-content">
      <div className="raffle-selected__raffle-selected-content__container">
        <div className="raffle-selected__raffle-selected-content__container__raffle-displayed">
          <PrizeDisplayed
            image={raffleSelectedImageUrl || null}
            title={raffleSelected?.title}
            subtitle={raffleSelected?.subtitle}
            progress={convertProgress(
              raffleSelected?.quantBuyedNumbers,
              raffleSelected?.quantNumbers,
            )}
            winner={raffleSelected?.isFinished}
          />
        </div>

        <span className="raffle-selected__raffle-selected-content__container__price-tag">
          POR APENAS <strong>{raffleSelected?.price}</strong>
        </span>

        <div className="raffle-selected__raffle-selected-content__container__desc-card">
          <p className="raffle-selected__raffle-selected-content__container__desc-card__desc">
            {raffleSelected?.description}
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

        {!raffleSelected?.isFinished ||
          raffleSelected?.quantBuyedNumbers < raffleSelected?.quantNumbers ? (
          <>
            <div className="raffle-selected__raffle-selected-content__container__buy-numbers-box">
              <span className="raffle-selected__raffle-selected-content__container__buy-numbers-box__desc">
                Selecione a quantidade de números
              </span>

              <div className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper">
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

              <div className="raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper">
                <button
                  onClick={() => {
                    if (numberQuant !== 0) {
                      decrementNumberQuant(1);
                    }
                  }}
                  disabled={numberQuant === 0 || isBuying}
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
                  disabled={
                    numberQuant ===
                    raffleSelected?.quantNumbers -
                    raffleSelected?.quantBuyedNumbers || isBuying
                  }
                  type="button"
                  className="raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper__btn"
                >
                  <CiCirclePlus />
                </button>
              </div>
            </div>

            <button
              onClick={finishBuy}
              type="button"
              style={
                isBuying
                  ? {
                    filter: "brightness(80%)",
                    pointerEvents: "none",
                  }
                  : isRaffleLoading
                    ? { pointerEvents: "none" }
                    : raffleSelected?.quantNumbers ===
                      raffleSelected?.quantBuyedNumbers
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
                {calcValues(raffleSelected?.price, numberQuant)}
              </span>
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default RaffleSelectedContent;
