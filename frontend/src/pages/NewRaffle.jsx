import React from "react";
import useIsUserLogged from "../hooks/useIsUserLogged";
import useNewRaffleStore from "../stores/useNewRaffleStore";

import { Header, Footer } from "./components";
import NewRaffleContent from "./components/new-raffle/NewRaffleContent";
import AlertBox from "./components/AlertBox";

const NewRaffle = () => {
  const { isRaffleCreated, submitError, raffleCreatedMessage } =
    useNewRaffleStore((state) => ({
      isRaffleCreated: state.isRaffleCreated,
      submitError: state.submitError,
      raffleCreatedMessage: state.raffleCreatedMessage,
    }));

  useIsUserLogged("create-new-raffle");

  return (
    <div className="new-raffle">
      <Header />
      <NewRaffleContent />
      <Footer />
      {isRaffleCreated && (
        <AlertBox
          success={isRaffleCreated}
          error={submitError}
          message={raffleCreatedMessage}
        />
      )}
      {submitError && (
        <AlertBox
          success={isRaffleCreated}
          error={submitError}
          message={raffleCreatedMessage}
        />
      )}
    </div>
  );
};

export default NewRaffle;
