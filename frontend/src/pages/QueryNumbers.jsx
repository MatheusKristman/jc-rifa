import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";

import { Header, Footer } from "./components";
import QueryNumbersContent from "./components/query-numbers/QueryNumbersContent";
import QueryNumbersModal from "./components/query-numbers/QueryNumbersModal";
import useQueryNumbersStore from "../stores/useQueryNumbersStore";
import useUserStore from "../stores/useUserStore";
import api from "../services/api";

const QueryNumbers = () => {
  const {
    isQueryNumbersModalOpen,
    openModal,
    setUserRafflesBuyed,
  } = useQueryNumbersStore(
    (state) => ({
      isQueryNumbersModalOpen: state.isQueryNumbersModalOpen,
      openModal: state.openModal,
      setCpf: state.setCpf,
      userRafflesBuyed: state.userRafflesBuyed,
      setUserRafflesBuyed: state.setUserRafflesBuyed,
    }),
    shallow
  );

  const {
    isUserLogged,
    user
  } = useUserStore(
    (state) => ({
      isUserLogged: state.isUserLogged,
      user: state.user,
    }), shallow
  );

  useEffect(() => {
    if (isUserLogged) {
      api
        .get(`/query-numbers/${user.cpf}`)
        .then((res) => setUserRafflesBuyed(res.data))
        .catch((error) => console.log(error));
    } else {
      openModal();
    }
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
