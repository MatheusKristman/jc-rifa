import React from "react";
import { ToastContainer } from "react-toastify";

import useIsUserLogged from "../hooks/useIsUserLogged";
import useGeneralStore from "../stores/useGeneralStore";
import NewRaffleContent from "./components/new-raffle/NewRaffleContent";
import { Header, Footer } from "./components";
import Loading from "./components/Loading";

const NewRaffle = () => {
  const { isLoading } = useGeneralStore((state) => ({
    isLoading: state.isLoading,
  }));

  useIsUserLogged();

  return (
    <div className="new-raffle">
      <Header />
      <NewRaffleContent />
      <Footer />
      <ToastContainer />
      {isLoading && <Loading>Criando rifa...</Loading>}
    </div>
  );
};

export default NewRaffle;
