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

const QueryNumbers = () => {
  const {
    isQueryNumbersModalOpen,
    openModal,
    setUserRafflesBuyed,
    userRafflesBuyed,
    setRafflesConcluded,
  } = useQueryNumbersStore(
    (state) => ({
      isQueryNumbersModalOpen: state.isQueryNumbersModalOpen,
      openModal: state.openModal,
      setCpf: state.setCpf,
      setUserRafflesBuyed: state.setUserRafflesBuyed,
      userRafflesBuyed: state.userRafflesBuyed,
      setRafflesConcluded: state.setRafflesConcluded,
    }),
    shallow
  );

  useIsUserLogged("/query-numbers");

  const { isUserLogged, user } = useUserStore(
    (state) => ({
      isUserLogged: state.isUserLogged,
      user: state.user,
    }),
    shallow
  );

  const { setRaffles } = useRaffleStore((state) => ({
    setRaffles: state.setRaffles,
  }));

  useEffect(() => {
    setRaffles([]);
    setUserRafflesBuyed([]);
    if (isUserLogged) {
      api
        .get(`/query-numbers/${user.cpf}`)
        .then((res) => {
          setUserRafflesBuyed(res.data);
          api
            .get("/get-raffles")
            .then((res) => {
              setRaffles(
                res.data.filter((raffle, index) => raffle._id === userRafflesBuyed[index]?.raffleId)
              );
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => console.log(error));

      api
        .get(`/all-winners`)
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
