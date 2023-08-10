import React, { useEffect } from "react";
import axios from "axios";

import useIsUserLogged from "../hooks/useIsUserLogged";
import useUserStore from "../stores/useUserStore";
import api from "../services/api";
import useGeneralStore from "../stores/useGeneralStore";
import { Header, Footer, HomeContent } from "./components";
import Loading from "./components/Loading";

const Home = () => {
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const {
    isLoading,
    setToLoad,
    setNotToLoad,
    setToAnimateFadeIn,
    setToAnimateFadeOut,
  } = useGeneralStore((state) => ({
    isLoading: state.isLoading,
    setToLoad: state.setToLoad,
    setNotToLoad: state.setNotToLoad,
    setToAnimateFadeIn: state.setToAnimateFadeIn,
    setToAnimateFadeOut: state.setToAnimateFadeOut,
  }));

  useIsUserLogged();

  useEffect(() => {
    function fetchUserBuyedNumbers() {
      if (user.hasOwnProperty("_id")) {
        setToAnimateFadeIn();
        setToLoad();

        let paymentIds = [];

        paymentIds = user.rafflesBuyed.map((raffle) => raffle.paymentId);

        if (paymentIds.length !== 0) {
          paymentIds.forEach((id) => {
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
