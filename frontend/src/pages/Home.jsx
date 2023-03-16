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

  const { setToRaffleLoad, setToRaffleNotLoad } = useGeneralStore((state) => ({
    setToRaffleLoad: state.setToRaffleLoad,
    setToRaffleNotLoad: state.setToRaffleNotLoad,
  }));

  const [searchParams] = useSearchParams();

  useIsUserLogged("/");

  useEffect(() => {
    setRaffles([]);
  }, []);

  useEffect(() => {
    if (user.hasOwnProperty("_id")) {
      let paymentIds = [];

      paymentIds = user.rafflesBuyed.map((raffle) => raffle.paymentId);

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

            const raffleToBeDeleted = user.rafflesBuyed.filter(
              (raffle) => raffle.paymentId == res.data.id
            );

            if (
              body.status === "rejected" ||
              body.status === "cancelled" ||
              body.status === "refunded" ||
              body.status === "charged_back"
            ) {
              // TODOdevolver os números para rifa
              api
                .delete(
                  `/payment-cancel?id=${body.id}&paymentId=${body.paymentId}&raffleId=${raffleToBeDeleted[0].raffleId}`
                )
                .then((res) => {
                  console.log(res.data);
                })
                .catch((error) => console.error(error));
            } else {
              api
                .post("/get-payment-data", body)
                .then((res) => {
                  console.log(res.data);
                })
                .catch((error) => console.error(error));
            }
          })
          .catch((error) => console.error(error));
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchRaffles = () => {
      if (raffles.length === 0) {
        setToRaffleLoad();
        api
          .get("/get-raffles")
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
      api
        .get("/all-winners")
        .then((res) => setWinners(res.data))
        .catch((error) => console.log(error));
    };

    fetchWinners();
  }, [setWinners]);

  return (
    <div className="home">
      <Header />
      <HomeContent />
      <Footer />
    </div>
  );
};

export default Home;

// TODO loading até dar fetch em todos os dados
