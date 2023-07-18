import React from "react";
import useIsUserLogged from "../hooks/useIsUserLogged";

import NewRaffleContent from "./components/new-raffle/NewRaffleContent";
import useNewRaffleStore from "../stores/useNewRaffleStore";
import useGeneralStore from "../stores/useGeneralStore";
import { Header, Footer } from "./components";
import AlertBox from "./components/AlertBox";
import Loading from "./components/Loading";

const NewRaffle = () => {
  const { isRaffleCreated, submitError, raffleCreatedMessage } =
    useNewRaffleStore((state) => ({
      isRaffleCreated: state.isRaffleCreated,
      submitError: state.submitError,
      raffleCreatedMessage: state.raffleCreatedMessage,
    }));
  const { isLoading } = useGeneralStore((state) => ({
    isLoading: state.isLoading,
  }));

  useIsUserLogged();

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
      {isLoading && <Loading>Criando rifa...</Loading>}
    </div>
  );
};

export default NewRaffle;
