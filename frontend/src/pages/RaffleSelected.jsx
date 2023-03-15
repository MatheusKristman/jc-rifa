import React from "react";
import { shallow } from "zustand/shallow";

import { Header, Footer } from "./components";
import useBuyNumbersStore from "../stores/useBuyNumbersStore";
import RaffleSelectedContent from "./components/raffle/RaffleSelectedContent";
import useIsUserLogged from "../hooks/useIsUserLogged";
import AlertBox from "./components/AlertBox";

const RaffleSelected = () => {
  useIsUserLogged("/raffles");

  const { isMessageBoxDisplaying, isErrorBoxDisplaying, messageText } = useBuyNumbersStore(
    (state) => ({
      isMessageBoxDisplaying: state.isMessageBoxDisplaying,
      isErrorBoxDisplaying: state.isErrorBoxDisplaying,
      messageText: state.messageText,
    }),
    shallow
  );

  return (
    <div className="raffle-selected">
      <Header />
      <RaffleSelectedContent />
      {isMessageBoxDisplaying && (
        <AlertBox
          success={isMessageBoxDisplaying}
          error={isErrorBoxDisplaying}
          message={messageText}
        />
      )}
      {isErrorBoxDisplaying && (
        <AlertBox
          success={isMessageBoxDisplaying}
          error={isErrorBoxDisplaying}
          message={messageText}
        />
      )}
      <Footer />
    </div>
  );
};

export default RaffleSelected;
