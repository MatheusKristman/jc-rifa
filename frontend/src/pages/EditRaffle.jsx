import React from "react";
import useNewRaffleStore from "../stores/useNewRaffleStore";
import useRaffleStore from "../stores/useRaffleStore";

import { Header, Footer } from "./components";
import EditRaffleContent from "./components/edit-raffle/EditRaffleContent";
import AlertBox from "./components/AlertBox";
import DeleteConfirmationBox from "./components/edit-raffle/DeleteConfirmationBox";

const EditRaffle = () => {
  const { isRaffleCreated, submitError, raffleCreatedMessage } =
    useNewRaffleStore((state) => ({
      isRaffleCreated: state.isRaffleCreated,
      submitError: state.submitError,
      raffleCreatedMessage: state.raffleCreatedMessage,
    }));
  const { isDeleteConfirmationOpen } = useRaffleStore((state) => ({
    isDeleteConfirmationOpen: state.isDeleteConfirmationOpen,
  }));

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
    </div>
  );
};

export default EditRaffle;
