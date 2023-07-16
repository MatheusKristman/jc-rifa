import React, { useEffect } from "react";
import useNewRaffleStore from "../stores/useNewRaffleStore";
import useRaffleStore from "../stores/useRaffleStore";
import useGeneralStore from "../stores/useGeneralStore";

import { Header, Footer } from "./components";
import EditRaffleContent from "./components/edit-raffle/EditRaffleContent";
import AlertBox from "./components/AlertBox";
import DeleteConfirmationBox from "./components/edit-raffle/DeleteConfirmationBox";
import Loading from "./components/Loading";

const EditRaffle = () => {
  const { isRaffleCreated, submitError, raffleCreatedMessage } =
    useNewRaffleStore((state) => ({
      isRaffleCreated: state.isRaffleCreated,
      submitError: state.submitError,
      raffleCreatedMessage: state.raffleCreatedMessage,
    }));
  const { isDeleteConfirmationOpen, raffleSelected } = useRaffleStore(
    (state) => ({
      isDeleteConfirmationOpen: state.isDeleteConfirmationOpen,
      raffleSelected: state.raffleSelected,
    }),
  );
  const { isLoading } = useGeneralStore((state) => ({
    isLoading: state.isLoading,
  }));

  useEffect(() => {
    console.log(raffleSelected);
  }, [raffleSelected]);

  return (
    <div className="edit-raffle">
      <Header />
      <EditRaffleContent />
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
      {isDeleteConfirmationOpen && <DeleteConfirmationBox />}
      {isLoading && <Loading>Excluindo a rifa, aguarde um momento.</Loading>}
    </div>
  );
};

export default EditRaffle;
