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

  const { raffles, setRaffles, setRafflesImagesUrls } = useRaffleStore(
    (state) => ({
      raffles: state.raffles,
      setRaffles: state.setRaffles,
      setRafflesImagesUrls: state.setRafflesImagesUrls,
    }),
  );

  const { setWinners, setWinnersImagesUrls, setWinnersRafflesImagesUrls } =
    useWinnerStore((state) => ({
      setWinners: state.setWinners,
      setWinnersImagesUrls: state.setWinnersImagesUrls,
      setWinnersRafflesImagesUrls: state.setWinnersRafflesImagesUrls,
    }));

  const {
    setToRaffleLoad,
    setToRaffleNotLoad,
    isLoading,
    setToLoad,
    setNotToLoad,
    setToAnimateFadeIn,
    setToAnimateFadeOut,
  } = useGeneralStore((state) => ({
    setToRaffleLoad: state.setToRaffleLoad,
    setToRaffleNotLoad: state.setToRaffleNotLoad,
    isLoading: state.isLoading,
    setToLoad: state.setToLoad,
    setNotToLoad: state.setNotToLoad,
    setToAnimateFadeIn: state.setToAnimateFadeIn,
    setToAnimateFadeOut: state.setToAnimateFadeOut,
  }));

  const [searchParams] = useSearchParams();

  useIsUserLogged();

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
                  Authorization: `Bearer ${
                    import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN
                  }`,
                },
              })
              .then((res) => {
                const body = {
                  id: user._id,
                  paymentId: res.data.id,
                  status: res.data.status,
                };

                const raffleToBeDeleted = user.rafflesBuyed.filter(
                  (raffle) => raffle.paymentId == res.data.id,
                );

                if (
                  body.status === "rejected" ||
                  body.status === "cancelled" ||
                  body.status === "refunded" ||
                  body.status === "charged_back"
                ) {
                  api
                    .delete(
                      `/account/payment-cancel?id=${body.id}&paymentId=${body.paymentId}&raffleId=${raffleToBeDeleted[0].raffleId}`,
                    )
                    .then((res) => {
                      console.log(res.data);

                      const body = {
                        raffleId: raffleToBeDeleted[0].raffleId,
                        quantToBeRemoved: res.data.quantToBeRemoved,
                      };

                      api
                        .post("/account/delete-canceled-numbers", body)
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
                  api
                    .post("/account/check-payment-status", body)
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
        api
          .get("/raffle/get-all-raffles")
          .then((res) => {
            setRaffles(
              res.data.filter(
                (raffle) =>
                  raffle.isFinished === false &&
                  raffle.quantBuyedNumbers < raffle.quantNumbers,
              ),
            );

            const urls = [];
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].raffleImage) {
                if (
                  JSON.stringify(import.meta.env.MODE) ===
                  JSON.stringify("development")
                ) {
                  urls.push(
                    `${import.meta.env.VITE_API_KEY_DEV}${
                      import.meta.env.VITE_API_PORT
                    }/raffle-uploads/${res.data[i].raffleImage}`,
                  );
                } else {
                  urls.push(
                    `${import.meta.env.VITE_API_KEY}/raffle-uploads/${
                      res.data[i].raffleImage
                    }`,
                  );
                }
              } else {
                urls.push(null);
              }
            }

            setRafflesImagesUrls(urls);

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

      api
        .get("/winner/get-all-winners")
        .then((res) => {
          setWinners(res.data);

          const allWinners = res.data;

          console.log("allWinners: ", allWinners);

          const winnersUrls = [];
          const rafflesUrls = [];

          for (let i = 0; i < allWinners.length; i++) {
            if (allWinners[i].profileImage) {
              if (
                JSON.stringify(import.meta.env.MODE) ===
                JSON.stringify("development")
              ) {
                winnersUrls.push(
                  `${import.meta.env.VITE_API_KEY_DEV}${
                    import.meta.env.VITE_API_PORT
                  }/user-uploads/${allWinners[i].profileImage}`,
                );
              } else {
                winnersUrls.push(
                  `${import.meta.env.VITE_API_KEY}/user-uploads/${
                    allWinners[i].profileImage
                  }`,
                );
              }
            } else {
              winnersUrls.push(null);
            }

            if (allWinners[i].raffleImage) {
              if (
                JSON.stringify(import.meta.env.MODE) ===
                JSON.stringify("development")
              ) {
                rafflesUrls.push(
                  `${import.meta.env.VITE_API_KEY_DEV}${
                    import.meta.env.VITE_API_PORT
                  }/raffle-uploads/${allWinners[i].raffleImage}`,
                );
              } else {
                rafflesUrls.push(
                  `${import.meta.env.VITE_API_KEY}/raffle-uploads/${
                    allWinners[i].raffleImage
                  }`,
                );
              }
            } else {
              rafflesUrls.push(null);
            }
          }

          setWinnersImagesUrls(winnersUrls);
          setWinnersRafflesImagesUrls(rafflesUrls);
        })
        .catch((error) => console.log(error))
        .finally(() => {
          setToAnimateFadeOut();

          setTimeout(() => {
            setNotToLoad();
          }, 400);
        });
    };

    fetchWinners();
  }, [setWinners, raffles]);

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
