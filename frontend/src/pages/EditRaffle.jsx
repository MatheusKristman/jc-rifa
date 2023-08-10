import React from "react";
import { ToastContainer } from "react-toastify";

import useRaffleStore from "../stores/useRaffleStore";
import useGeneralStore from "../stores/useGeneralStore";
import useIsUserLogged from "../hooks/useIsUserLogged";
import { Header, Footer } from "./components";
import EditRaffleContent from "./components/edit-raffle/EditRaffleContent";
import DeleteConfirmationBox from "./components/edit-raffle/DeleteConfirmationBox";
import Loading from "./components/Loading";

const EditRaffle = () => {
  const { isDeleteConfirmationOpen } = useRaffleStore((state) => ({
    isDeleteConfirmationOpen: state.isDeleteConfirmationOpen,
  }));
  const { isLoading, loadingMessage } = useGeneralStore((state) => ({
    isLoading: state.isLoading,
    loadingMessage: state.loadingMessage,
  }));

  useIsUserLogged();

  return (
    <div className="edit-raffle">
      <Header />
      <EditRaffleContent />
      <Footer />
      <ToastContainer />
      {isDeleteConfirmationOpen && <DeleteConfirmationBox />}
      {isLoading && <Loading>{loadingMessage}</Loading>}
    </div>
  );
};

export default EditRaffle;
