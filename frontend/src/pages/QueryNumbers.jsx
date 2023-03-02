import React, { useEffect } from "react";
import { Header, Footer } from "./components";
import QueryNumbersContent from "./components/query-numbers/QueryNumbersContent";
import QueryNumbersModal from "./components/query-numbers/QueryNumbersModal";
import useQueryNumbersStore from "../stores/useQueryNumbersStore";
import { shallow } from "zustand/shallow";

const QueryNumbers = () => {
  const { isQueryNumbersModalOpen, openModal } = useQueryNumbersStore(
    (state) => ({
      isQueryNumbersModalOpen: state.isQueryNumbersModalOpen,
      openModal: state.openModal,
    }),
    shallow
  );

  useEffect(() => {
    openModal();
  }, []);

  return (
    <div className="query-numbers">
      <Header />
      <QueryNumbersContent />
      {isQueryNumbersModalOpen && <QueryNumbersModal /> }
      <Footer />
    </div>
  );
};

export default QueryNumbers;
