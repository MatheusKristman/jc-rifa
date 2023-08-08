import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { ToastContainer } from "react-toastify";

import { Header, Footer } from "./components";
import QueryNumbersContent from "./components/query-numbers/QueryNumbersContent";
import QueryNumbersModal from "./components/query-numbers/QueryNumbersModal";
import useQueryNumbersStore from "../stores/useQueryNumbersStore";
import useUserStore from "../stores/useUserStore";
import api from "../services/api";
import useRaffleStore from "../stores/useRaffleStore";
import useIsUserLogged from "../hooks/useIsUserLogged";
import useGeneralStore from "../stores/useGeneralStore";

const QueryNumbers = () => {
  const {
    isQueryNumbersModalOpen,
    openModal,
    setUserRafflesBuyed,
    rafflesConcluded,
    setRafflesConcluded,
    setRafflesImagesUrls,
  } = useQueryNumbersStore(
    (state) => ({
      isQueryNumbersModalOpen: state.isQueryNumbersModalOpen,
      openModal: state.openModal,
      setUserRafflesBuyed: state.setUserRafflesBuyed,
      rafflesConcluded: state.rafflesConcluded,
      setRafflesConcluded: state.setRafflesConcluded,
      setRafflesImagesUrls: state.setRafflesImagesUrls,
    }),
    shallow,
  );

  const { setToLoad, setNotToLoad, setToAnimateFadeIn, setToAnimateFadeOut } =
    useGeneralStore((state) => ({
      setToLoad: state.setToLoad,
      setNotToLoad: state.setNotToLoad,
      setToAnimateFadeIn: state.setToAnimateFadeIn,
      setToAnimateFadeOut: state.setToAnimateFadeOut,
    }));

  useIsUserLogged();

  const { isUserLogged, user } = useUserStore(
    (state) => ({
      isUserLogged: state.isUserLogged,
      user: state.user,
    }),
    shallow,
  );

  const { setRaffles } = useRaffleStore((state) => ({
    setRaffles: state.setRaffles,
  }));

  useEffect(() => {
    setRaffles([]);
    setUserRafflesBuyed([]);

    if (isUserLogged) {
      setToLoad();
      setToAnimateFadeIn();

      api
        .get(`/account/get-raffle-numbers/${user.cpf}`)
        .then((res) => {
          setUserRafflesBuyed(res.data);

          const rafflesFromUser = res.data;

          api
            .get("raffle/get-all-raffles")
            .then((res) => {
              setRaffles(
                res.data.filter(
                  (raffle, index) =>
                    raffle._id === rafflesFromUser[index].raffleId,
                ),
              );

              const rafflesBuyed = res.data.filter(
                (raffle, index) =>
                  raffle._id === rafflesFromUser[index].raffleId,
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
            })
            .finally(() => {
              setToAnimateFadeOut();

              setTimeout(() => {
                setNotToLoad();
              }, 400);
            });
        })
        .catch((error) => console.log(error));

      api
        .get(`winner/get-all-winners`)
        .then((res) => setRafflesConcluded(res.data))
        .catch((error) => console.error(error));
    } else {
      openModal();
    }
  }, [setRaffles, setUserRafflesBuyed]);

  useEffect(() => {
    console.log("rafflesConcluded", rafflesConcluded);
  }, [rafflesConcluded]);

  return (
    <div className="query-numbers">
      <ToastContainer />
      <Header />
      <QueryNumbersContent />
      {isQueryNumbersModalOpen && <QueryNumbersModal />}
      <Footer />
    </div>
  );
};

export default QueryNumbers;
