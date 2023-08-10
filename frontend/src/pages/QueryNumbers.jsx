import React from "react";
import { shallow } from "zustand/shallow";
import { ToastContainer } from "react-toastify";

import { Header, Footer } from "./components";
import QueryNumbersContent from "./components/query-numbers/QueryNumbersContent";
import QueryNumbersModal from "./components/query-numbers/QueryNumbersModal";
import useQueryNumbersStore from "../stores/useQueryNumbersStore";
import useIsUserLogged from "../hooks/useIsUserLogged";

const QueryNumbers = () => {
  const { isQueryNumbersModalOpen } = useQueryNumbersStore(
    (state) => ({
      isQueryNumbersModalOpen: state.isQueryNumbersModalOpen,
    }),
    shallow,
  );

  useIsUserLogged();

  return (
    <div className="query-numbers">
      <ToastContainer />
      <Header />
      <QueryNumbersContent />
      {isQueryNumbersModalOpen && <QueryNumbersModal />}
      <Footer />
    </div>
  );
};

export default QueryNumbers;
