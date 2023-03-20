import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import { Header, Footer, HomeContent } from "./components";
import useIsUserLogged from "../hooks/useIsUserLogged";
import useUserStore from "../stores/useUserStore";
import useRaffleStore from "../stores/useRaffleStore";
import useWinnerStore from "../stores/useWinnerStore";
import api from "../services/api";
import useGeneralStore from "../stores/useGeneralStore";
import Loading from "./components/Loading";

const Home = () => {
    const { user, setUser } = useUserStore((state) => ({
        user: state.user,
        setUser: state.setUser,
    }));

    const { raffles, setRaffles } = useRaffleStore((state) => ({
        raffles: state.raffles,
        setRaffles: state.setRaffles,
    }));

    const { winners, setWinners } = useWinnerStore((state) => ({
        winners: state.winners,
        setWinners: state.setWinners,
    }));

    const { setToRaffleLoad, setToRaffleNotLoad, isLoading, setToLoad, setNotToLoad, setToAnimateFadeIn, setToAnimateFadeOut } =
        useGeneralStore((state) => ({
            setToRaffleLoad: state.setToRaffleLoad,
            setToRaffleNotLoad: state.setToRaffleNotLoad,
            isLoading: state.isLoading,
            setToLoad: state.setToLoad,
            setNotToLoad: state.setNotToLoad,
            setToAnimateFadeIn: state.setToAnimateFadeIn,
            setToAnimateFadeOut: state.setToAnimateFadeOut,
        }));

    const [searchParams] = useSearchParams();

    useIsUserLogged("/");

    useEffect(() => {
        setRaffles([]);

        setToAnimateFadeIn();
        setToLoad();
    }, []);

    useEffect(() => {
        function fetchUserBuyedNumbers() {
            if (user.hasOwnProperty("_id")) {
                setToAnimateFadeIn();
                setToLoad();

                let paymentIds = [];

                paymentIds = user.rafflesBuyed.map((raffle) => raffle.paymentId);

                if (paymentIds.length !== 0) {
                    paymentIds.forEach((id, index) => {
                        axios
                            .get(`https://api.mercadopago.com/v1/payments/${id}`, {
                                headers: {
                                    Authorization: `Bearer ${import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN}`,
                                },
                            })
                            .then((res) => {
                                const body = {
                                    id: user._id,
                                    paymentId: res.data.id,
                                    status: res.data.status,
                                };

                                const raffleToBeDeleted = user.rafflesBuyed.filter((raffle) => raffle.paymentId == res.data.id);

                                if (
                                    body.status === "rejected" ||
                                    body.status === "cancelled" ||
                                    body.status === "refunded" ||
                                    body.status === "charged_back"
                                ) {
                                    api.delete(
                                        `/payment-cancel?id=${body.id}&paymentId=${body.paymentId}&raffleId=${raffleToBeDeleted[0].raffleId}`
                                    )
                                        .then((res) => {
                                            console.log(res.data);

                                            const raffleSelected = raffles.filter(
                                                (raffle) => raffle._id == raffleToBeDeleted[0].raffleId
                                            );
                                            let numbersAvailableFromRaffle = [
                                                ...raffleSelected[0].NumbersAvailable,
                                                ...res.data.rafflesBuyed,
                                            ];
                                            let numbersBuyedFromRaffle = [
                                                ...raffleSelected[0].BuyedNumbers.filter(
                                                    (number) => !numbersAvailableFromRaffle.includes(number)
                                                ),
                                            ];

                                            const body = {
                                                raffleId: raffleToBeDeleted[0].raffleId,
                                                numbersAvailableFromRaffle: numbersAvailableFromRaffle,
                                                numbersBuyedFromRaffle: numbersBuyedFromRaffle,
                                            };

                                            api.post("/delete-canceled-numbers", body)
                                                .then(() => {
                                                    setToAnimateFadeOut();

                                                    setTimeout(() => {
                                                        setNotToLoad();
                                                    }, 400);
                                                })
                                                .catch((error) => console.error(error));
                                        })
                                        .catch((error) => console.error(error));
                                } else {
                                    api.post("/get-payment-data", body)
                                        .then((res) => {
                                            console.log(res.data);
                                            setToAnimateFadeOut();

                                            setTimeout(() => {
                                                setNotToLoad();
                                            }, 400);
                                        })
                                        .catch((error) => console.error(error));
                                }
                            })
                            .catch((error) => console.error(error));
                    });
                } else {
                    setToAnimateFadeOut();

                    setTimeout(() => {
                        setNotToLoad();
                    }, 400);
                }
            }
        }

        fetchUserBuyedNumbers();
    }, [user, setToLoad, setNotToLoad]);

    useEffect(() => {
        const fetchRaffles = () => {
            if (raffles.length === 0) {
                setToRaffleLoad();
                api.get("/get-raffles")
                    .then((res) => {
                        setRaffles(res.data.filter((raffle) => raffle.isFinished === false));
                        setToRaffleNotLoad();
                    })
                    .catch((error) => console.log(error));
            }
        };

        fetchRaffles();
    }, [raffles, setRaffles]);

    useEffect(() => {
        const fetchWinners = () => {
            setToAnimateFadeIn();
            setToLoad();
            api.get("/all-winners")
                .then((res) => {
                    setWinners(res.data);

                    setToAnimateFadeOut();

                    setTimeout(() => {
                        setNotToLoad();
                    }, 400);
                })
                .catch((error) => console.log(error));
        };

        fetchWinners();
    }, [setWinners]);

    return (
        <div className="home">
            <Header />
            <HomeContent />
            {isLoading && <Loading>Aguarde um momento</Loading>}
            <Footer />
        </div>
    );
};

export default Home;
