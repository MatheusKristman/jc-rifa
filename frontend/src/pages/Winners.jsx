import React, { useEffect } from "react";
import useWinnerStore from "../stores/useWinnerStore";
import { Header, Footer } from "./components";
import WinnersContent from "./components/winners/WinnersContent";
import api from "../services/api";
import useGeneralStore from "../stores/useGeneralStore";
import Loading from "./components/Loading";

const Winners = () => {
  const { setWinners, setWinnersImagesUrls } = useWinnerStore((state) => ({
    setWinners: state.setWinners,
    setWinnersImagesUrls: state.setWinnersImagesUrls,
  }));

  const {
    isLoading,
    setToLoad,
    setNotToLoad,
    setToAnimateFadeIn,
    setToAnimateFadeOut,
  } = useGeneralStore((state) => ({
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
        .get("/winner/get-all-winners")
        .then((res) => {
          setWinners(res.data);

          const urls = [];
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].profileImage) {
              if (
                JSON.stringify(import.meta.env.MODE) ===
                JSON.stringify("development")
              ) {
                urls.push(
                  `${import.meta.env.VITE_API_KEY_DEV}${
                    import.meta.env.VITE_API_PORT
                  }/raffle-uploads/${res.data[i].profileImage}`,
                );
              } else {
                urls.push(
                  `${import.meta.env.VITE_API_KEY}/raffle-uploads/${
                    res.data[i].profileImage
                  }`,
                );
              }
            } else {
              urls.push(null);
            }
          }

          setWinnersImagesUrls(urls);

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
