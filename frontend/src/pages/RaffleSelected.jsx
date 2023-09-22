import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";

import { Header, Footer } from "./components";
import RaffleSelectedContent from "./components/raffle/RaffleSelectedContent";
import PaymentModal from "./components/raffle/PaymentModal";
import Checkout from "./components/raffle/Checkout";
import useIsUserLogged from "../hooks/useIsUserLogged";
import useBuyNumbersStore from "../stores/useBuyNumbersStore";

const RaffleSelected = () => {
  useIsUserLogged();

  const { isPaymentModalOpen } = useBuyNumbersStore(
    (state) => ({
      isPaymentModalOpen: state.isPaymentModalOpen,
    }),
    shallow,
  );

  useEffect(() => {
    if (isPaymentModalOpen) {
      document.documentElement.style.overflowY = "hidden";
    } else {
      document.documentElement.style.overflowY = "unset";
    }
  }, [isPaymentModalOpen]);

  return (
    <div className="raffle-selected">
      <Header />
      <RaffleSelectedContent />
      {/* <PaymentModal /> */}
      {isPaymentModalOpen && <Checkout />}
      <Footer />
    </div>
  );
};

export default RaffleSelected;
