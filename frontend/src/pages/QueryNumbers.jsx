import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";

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
    userRafflesBuyed,
    setRafflesConcluded,
    setRafflesImagesUrls,
  } = useQueryNumbersStore(
    (state) => ({
      isQueryNumbersModalOpen: state.isQueryNumbersModalOpen,
      openModal: state.openModal,
      setCpf: state.setCpf,
      setUserRafflesBuyed: state.setUserRafflesBuyed,
      userRafflesBuyed: state.userRafflesBuyed,
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
          api
            .get("raffle/get-all-raffles")
            .then((res) => {
              setRaffles(
                res.data.filter(
                  (raffle, index) =>
                    raffle._id === userRafflesBuyed[index]?.raffleId,
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

              setToAnimateFadeOut();

              setTimeout(() => {
                setNotToLoad();
              }, 400);
            })
            .catch((error) => {
              console.error(error);

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

  return (
    <div className="query-numbers">
      <Header />
      <QueryNumbersContent />
      {isQueryNumbersModalOpen && <QueryNumbersModal />}
      <Footer />
    </div>
  );
};

export default QueryNumbers;
