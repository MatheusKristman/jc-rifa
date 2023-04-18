import React, { useEffect } from 'react';
import {
    BsFacebook,
    BsTelegram,
    BsTwitter,
    BsWhatsapp,
    BsCart,
    BsCheck2Circle,
} from 'react-icons/bs';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import buyingLoading from '../../../assets/buying-loading.svg';

import PrizeDisplayed from '../PrizeDisplayed';
import useRaffleStore from '../../../stores/useRaffleStore';
import api from '../../../services/api';
import useBuyNumbersStore from '../../../stores/useBuyNumbersStore';
import useUserStore from '../../../stores/useUserStore';
import useHeaderStore from '../../../stores/useHeaderStore';
import useGeneralStore from '../../../stores/useGeneralStore';

const RaffleSelectedContent = () => {
    const { raffleSelected, setRaffleSelected } = useRaffleStore((state) => ({
        raffleSelected: state.raffleSelected,
        setRaffleSelected: state.setRaffleSelected,
    }));

    const {
        numberQuant,
        incrementNumberQuant,
        decrementNumberQuant,
        isMessageBoxDisplaying,
        setToMessageBoxDisplay,
        setToMessageBoxDontDisplay,
        setMessageText,
        isErrorBoxDisplaying,
        setToErrorBoxDisplay,
        setToErrorBoxDontDisplay,
        openPaymentModal,
        closePaymentModal,
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
            isMessageBoxDisplaying: state.isMessageBoxDisplaying,
            setToMessageBoxDisplay: state.setToMessageBoxDisplay,
            setToMessageBoxDontDisplay: state.setToMessageBoxDontDisplay,
            setMessageText: state.setMessageText,
            isErrorBoxDisplaying: state.isErrorBoxDisplaying,
            setToErrorBoxDisplay: state.setToErrorBoxDisplay,
            setToErrorBoxDontDisplay: state.setToErrorBoxDontDisplay,
            openPaymentModal: state.openPaymentModal,
            closePaymentModal: state.closePaymentModal,
            isBuying: state.isBuying,
            setToBuy: state.setToBuy,
            setToNotBuy: state.setToNotBuy,
            setQrCodePayment: state.setQrCodePayment,
            setPaymentLink: state.setPaymentLink,
        }),
        shallow
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

    useEffect(() => {
        setRaffleSelected({});
        setQrCodePayment('');
        setPaymentLink('');
        setToNotBuy();
    }, []);

    useEffect(() => {
        const fetchRaffleSelected = () => {
            if (!raffleSelected.hasOwnProperty('_id')) {
                setToRaffleLoad();
                api.get(window.location.pathname)
                    .then((res) => {
                        setRaffleSelected(res.data);
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
        if (isMessageBoxDisplaying) {
            setTimeout(() => {
                setToMessageBoxDontDisplay();
            }, 4000);
        }

        if (isErrorBoxDisplaying) {
            setTimeout(() => {
                setToErrorBoxDontDisplay();
            }, 4000);
        }
    }, [isMessageBoxDisplaying, isErrorBoxDisplaying]);

    useEffect(() => {
        if (isBuying) {
            document.documentElement.style.overflowY = 'hidden';
        } else {
            document.documentElement.style.overflowY = 'unset';
        }
    }, [isBuying]);

    function calcValues(value, factor) {
        const valueFormated = convertCurrencyToNumber(value);
        const calc = valueFormated * factor;
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(calc);
    }

    function convertCurrencyToNumber(value) {
        if (value) {
            const onlyDigits = value.replace(/[^\d,-]/g, '');
            const digitsFloat = onlyDigits.replace(',', '.');
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

        const numbersAvailableToBuy = [...raffleSelected.NumbersAvailable];
        const numbersBuyed = [];

        if (numberQuant <= numbersAvailableToBuy.length && isUserLogged) {
            setToBuy();

            const priceNumber = convertCurrencyToNumber(raffleSelected.price);

            for (let i = 0; i < numberQuant; i++) {
                const random = Math.floor(
                    Math.random() * numbersAvailableToBuy.length
                );
                const chosenNumber = numbersAvailableToBuy.splice(random, 1)[0];
                numbersBuyed.push(chosenNumber);
            }

            console.log(
                '🚀 ~ file: RaffleSelectedContent.jsx:147 ~ handleBuy ~ numbersBuyed:',
                numbersBuyed
            );
            console.log(
                '🚀 ~ file: RaffleSelectedContent.jsx:146 ~ handleBuy ~ numbersAvailableToBuy:',
                numbersAvailableToBuy
            );
            api.post(`/payment`, {
                id: user._id,
                fullPrice: priceNumber * numberQuant,
                title: raffleSelected.title,
                email: user.email,
                firstName: user.name.split(' ')[0],
                lastName: user.name.split(' ').slice(1).join(' '),
                cpf: user.cpf,
            })
                .then((res) => {
                    console.log(res.data.response.response);
                    setQrCodePayment(
                        res.data.response.response.point_of_interaction
                            .transaction_data.qr_code
                    );

                    setPaymentLink(
                        res.data.response.response.point_of_interaction
                            .transaction_data.ticket_url
                    );

                    api.post('/raffles/buy', {
                        id: user._id,
                        raffleId: raffleSelected._id,
                        paymentId: res.data.response.response.id,
                        numbersAvailableToBuy: numbersAvailableToBuy,
                        numbersBuyed: numbersBuyed,
                        pricePaid:
                            res.data.response.response.transaction_amount,
                        status: res.data.response.response.status,
                        numberQuant: numberQuant,
                    })
                        .then((res) => {
                            openPaymentModal();
                            setToNotBuy();
                            setUser(res.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((error) => console.error(error));
        } else if (numberQuant > numbersAvailableToBuy.length) {
            setToMessageBoxDisplay();
            setMessageText(
                'Selecione a quantidade até ' + numbersAvailableToBuy.length
            );
        } else {
            openLogin();
        }
    };

    return (
        <div className='raffle-selected__raffle-selected-content'>
            <div className='raffle-selected__raffle-selected-content__container'>
                <div className='raffle-selected__raffle-selected-content__container__raffle-displayed'>
                    <PrizeDisplayed
                        image={raffleSelected.raffleImage}
                        title={raffleSelected.title}
                        subtitle={raffleSelected.subtitle}
                        progress={convertProgress(
                            raffleSelected?.QuantNumbers -
                                raffleSelected?.NumbersAvailable?.length,
                            raffleSelected?.QuantNumbers
                        )}
                        winner={raffleSelected?.isFinished}
                    />
                </div>

                <span className='raffle-selected__raffle-selected-content__container__price-tag'>
                    POR APENAS <strong>{raffleSelected.price}</strong>
                </span>

                <div className='raffle-selected__raffle-selected-content__container__desc-card'>
                    <p className='raffle-selected__raffle-selected-content__container__desc-card__desc'>
                        {raffleSelected.description}
                    </p>
                </div>

                <div className='raffle-selected__raffle-selected-content__container__social-wrapper'>
                    <a
                        href='#'
                        className='raffle-selected__raffle-selected-content__container__social-wrapper__social'
                    >
                        <BsFacebook />
                    </a>
                    <a
                        href='#'
                        className='raffle-selected__raffle-selected-content__container__social-wrapper__social'
                    >
                        <BsTelegram />
                    </a>
                    <a
                        href='#'
                        className='raffle-selected__raffle-selected-content__container__social-wrapper__social'
                    >
                        <BsTwitter />
                    </a>
                    <a
                        href='#'
                        className='raffle-selected__raffle-selected-content__container__social-wrapper__social'
                    >
                        <BsWhatsapp />
                    </a>
                </div>

                <div className='raffle-selected__raffle-selected-content__container__title-wrapper'>
                    <h1 className='raffle-selected__raffle-selected-content__container__title-wrapper__title'>
                        ⚡ Cotas
                    </h1>

                    <span className='raffle-selected__raffle-selected-content__container__title-wrapper__desc'>
                        Escolha sua sorte
                    </span>
                </div>

                <Link
                    to='/query-numbers'
                    className='raffle-selected__raffle-selected-content__container__link-query-numbers'
                >
                    <BsCart /> Ver meus números
                </Link>

                <div className='raffle-selected__raffle-selected-content__container__buy-numbers-box'>
                    <span className='raffle-selected__raffle-selected-content__container__buy-numbers-box__desc'>
                        Selecione a quantidade de números
                    </span>

                    <div
                        className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper'
                        style={
                            raffleSelected.NumbersAvailable?.length === 0
                                ? { pointerEvents: 'none' }
                                : {}
                        }
                    >
                        <button
                            onClick={() => incrementNumberQuant(10)}
                            type='button'
                            className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn'
                        >
                            <h1 className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title'>
                                <small>+</small>10
                            </h1>

                            <p className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc'>
                                Selecionar
                            </p>
                        </button>

                        <button
                            onClick={() => incrementNumberQuant(15)}
                            type='button'
                            className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn emphasis'
                        >
                            <span className='emphasis-tag'>Mais popular</span>

                            <h1 className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title'>
                                <small>+</small>15
                            </h1>

                            <p className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc'>
                                Selecionar
                            </p>
                        </button>

                        <button
                            onClick={() => incrementNumberQuant(200)}
                            type='button'
                            className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn'
                        >
                            <h1 className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title'>
                                <small>+</small>200
                            </h1>

                            <p className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc'>
                                Selecionar
                            </p>
                        </button>

                        <button
                            onClick={() => incrementNumberQuant(250)}
                            type='button'
                            className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn'
                        >
                            <h1 className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title'>
                                <small>+</small>250
                            </h1>

                            <p className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc'>
                                Selecionar
                            </p>
                        </button>

                        <button
                            onClick={() => incrementNumberQuant(300)}
                            type='button'
                            className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn'
                        >
                            <h1 className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title'>
                                <small>+</small>300
                            </h1>

                            <p className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc'>
                                Selecionar
                            </p>
                        </button>

                        <button
                            onClick={() => incrementNumberQuant(350)}
                            type='button'
                            className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn'
                        >
                            <h1 className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title'>
                                <small>+</small>350
                            </h1>

                            <p className='raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc'>
                                Selecionar
                            </p>
                        </button>
                    </div>

                    <div
                        className='raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper'
                        style={
                            raffleSelected.NumbersAvailable?.length === 0
                                ? { pointerEvents: 'none' }
                                : {}
                        }
                    >
                        <button
                            onClick={() => {
                                if (numberQuant !== 0) {
                                    decrementNumberQuant(1);
                                }
                            }}
                            type='button'
                            className='raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper__btn'
                        >
                            <CiCircleMinus />
                        </button>

                        <div
                            onClick={() => decrementNumberQuant(numberQuant)}
                            className='raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper__selected-numbers-display'
                        >
                            {numberQuant}
                        </div>

                        <button
                            onClick={() => incrementNumberQuant(1)}
                            type='button'
                            className='raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper__btn'
                        >
                            <CiCirclePlus />
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleBuy}
                    type='button'
                    style={
                        isBuying
                            ? {
                                  filter: 'brightness(80%)',
                                  pointerEvents: 'none',
                              }
                            : isRaffleLoading
                            ? { pointerEvents: 'none' }
                            : raffleSelected.NumbersAvailable?.length === 0
                            ? {
                                  filter: 'brightness(80%)',
                                  pointerEvents: 'none',
                              }
                            : {}
                    }
                    className='raffle-selected__raffle-selected-content__container__buy-btn'
                >
                    {isBuying ? (
                        <span className='raffle-selected__raffle-selected-content__container__buy-btn__desc'>
                            <img src={buyingLoading} alt='Processando...' />
                        </span>
                    ) : (
                        <span className='raffle-selected__raffle-selected-content__container__buy-btn__desc'>
                            <BsCheck2Circle /> Participar do sorteio
                        </span>
                    )}

                    <span className='raffle-selected__raffle-selected-content__container__buy-btn__price'>
                        {calcValues(raffleSelected.price, numberQuant)}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default RaffleSelectedContent;

//TODO não disponibilizar para compra quando não tiver numero disponivel
