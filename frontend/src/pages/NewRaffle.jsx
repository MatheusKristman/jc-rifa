import React from "react";

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
      {isLoading && <Loading>Criando rifa...</Loading>}
    </div>
  );
};

export default NewRaffle;
