import React from "react";

import { Header, Footer } from "./components";
import WinnersContent from "./components/winners/WinnersContent";
import Loading from "./components/Loading";
import useGeneralStore from "../stores/useGeneralStore";

const Winners = () => {
  const { isLoading } = useGeneralStore((state) => ({
    isLoading: state.isLoading,
  }));

  return (
    <div className="winners">
      <Header />
      <WinnersContent />
      {isLoading && <Loading>Procurando Ganhadores</Loading>}
      <Footer />
    </div>
  );
};

export default Winners;
