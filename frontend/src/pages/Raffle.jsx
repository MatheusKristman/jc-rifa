import React from "react";

import { Header, Footer } from "./components";
import RafflePageContent from "./components/raffle/RafflePageContent";
import useIsUserLogged from "../hooks/useIsUserLogged";

const Raffle = () => {
  useIsUserLogged();

  return (
    <div className="raffle">
      <Header />
      <RafflePageContent />
      <Footer />
    </div>
  );
};

export default Raffle;
