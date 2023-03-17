import React, { useEffect } from "react";
import useWinnerStore from "../stores/useWinnerStore";
import { Header, Footer } from "./components";
import WinnersContent from "./components/winners/WinnersContent";
import api from "../services/api";
import useGeneralStore from "../stores/useGeneralStore";
import Loading from "./components/Loading";

const Winners = () => {
  const { setWinners } = useWinnerStore((state) => ({ setWinners: state.setWinners }));

  const { isLoading, setToLoad, setNotToLoad, setToAnimateFadeIn, setToAnimateFadeOut } = useGeneralStore((state) => ({
    isLoading: state.isLoading,
    setToLoad: state.setToLoad,
    setNotToLoad: state.setNotToLoad,
    setToAnimateFadeIn: state.setToAnimateFadeIn,
    setToAnimateFadeOut: state.setToAnimateFadeOut,
  }));

  useEffect(() => {
    const fetchWinners = () => {
      setToLoad();
      setToAnimateFadeIn();
      api
        .get("/all-winners")
        .then((res) => {
          setWinners(res.data);

          setToAnimateFadeOut();

          setTimeout(() => {
            setNotToLoad();
          }, 400);
        })
        .catch((error) => {
          console.log(error);

          setToAnimateFadeOut();

          setTimeout(() => {
            setNotToLoad();
          }, 400);
        });
    };

    fetchWinners();
  }, [setWinners]);

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
