import React, { useEffect } from "react";
import useWinnerStore from "../stores/useWinnerStore";
import { Header, Footer } from "./components";
import WinnersContent from "./components/winners/WinnersContent";
import api from "../services/api";
import useGeneralStore from "../stores/useGeneralStore";
import Loading from "./components/Loading";

const Winners = () => {
  const { setWinners, setWinnersImagesUrls, setWinnersRafflesImagesUrls } =
    useWinnerStore((state) => ({
      setWinners: state.setWinners,
      setWinnersImagesUrls: state.setWinnersImagesUrls,
      setWinnersRafflesImagesUrls: state.setWinnersRafflesImagesUrls,
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
          const allWinners = res.data;

          console.log("allWinners: ", allWinners);

          const winnersUrls = [];
          const rafflesUrls = [];

          for (let i = 0; i < allWinners.length; i++) {
            if (allWinners[i].profileImage) {
              if (
                JSON.stringify(import.meta.env.MODE) ===
                JSON.stringify("development")
              ) {
                winnersUrls.push(
                  `${import.meta.env.VITE_API_KEY_DEV}${
                    import.meta.env.VITE_API_PORT
                  }/user-uploads/${allWinners[i].profileImage}`,
                );
              } else {
                winnersUrls.push(
                  `${import.meta.env.VITE_API_KEY}/user-uploads/${
                    allWinners[i].profileImage
                  }`,
                );
              }
            } else {
              winnersUrls.push(null);
            }

            if (allWinners[i].raffleImage) {
              if (
                JSON.stringify(import.meta.env.MODE) ===
                JSON.stringify("development")
              ) {
                rafflesUrls.push(
                  `${import.meta.env.VITE_API_KEY_DEV}${
                    import.meta.env.VITE_API_PORT
                  }/raffle-uploads/${allWinners[i].raffleImage}`,
                );
              } else {
                rafflesUrls.push(
                  `${import.meta.env.VITE_API_KEY}/raffle-uploads/${
                    allWinners[i].raffleImage
                  }`,
                );
              }
            } else {
              rafflesUrls.push(null);
            }
          }

          setWinnersImagesUrls(winnersUrls);
          setWinnersRafflesImagesUrls(rafflesUrls);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
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
