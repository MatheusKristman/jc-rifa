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
    if (location.search.includes("status=approved") && user.hasOwnProperty("_id")) {
      api
        .get("/get-payment-data" + location.search)
        .then((res) => {
          axios
            .get(`https://api.mercadopago.com/v1/payments/${String(res.data)}`, {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN}`,
              },
            })
            .then((res) => {
              api
                .post("/raffles/buy", {
                  paymentId: res.data.id,
                  id: user._id,
                  raffleId: res.data.additional_info.items[0].id,
                  pricePaid: res.data.additional_info.items[0].unit_price,
                  status: res.data.status,
                  numberQuant: res.data.additional_info.items[0].quantity,
                })
                .then((res) => {
                  window.location.replace("http://localhost:5173");
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));
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
