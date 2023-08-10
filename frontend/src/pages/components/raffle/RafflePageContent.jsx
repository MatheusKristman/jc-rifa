import React, { useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Link } from "react-router-dom";

import Prizes from "../Prizes";
import Loading from "../Loading";
import useRaffleStore from "../../../stores/useRaffleStore";
import api from "../../../services/api";
import useGeneralStore from "../../../stores/useGeneralStore";

const RafflePageContent = () => {
  const { raffles, setRaffles } = useRaffleStore((state) => ({
    raffles: state.raffles,
    setRaffles: state.setRaffles,
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

  const [activeRafflesImagesUrls, setActiveRafflesImagesUrls] = useState([]);
  const [concludedRafflesImagesUrls, setConcludedRafflesImagesUrls] = useState(
    [],
  );
  const [activeRafflesDisplaying, setActiveRafflesDisplaying] = useState([]);
  const [concludedRafflesDisplaying, setConcludedRafflesDisplaying] = useState(
    [],
  );
  const [page, setPage] = useState(1);
  const [isPreviousPageBtnDisplayed, setIsPreviousPageBtnDisplayed] =
    useState(false);
  const [isNextPageBtnDisplayed, setIsNextPageBtnDisplayed] = useState(false);
  const [isActiveOn, setIsActiveOn] = useState(true);
  const [isConcludedOn, setIsConcludedOn] = useState(false);

  const rafflesPerPage = 10;
  const sliceBegin = (page - 1) * rafflesPerPage;
  const sliceEnd = page * rafflesPerPage;

  // const sliceEndBiggerThanRaffles = (value) => {
  //   setSliceEnd(value);
  // };

  const setNextPage = () => {
    window.scrollTo(0, 0);

    setPage((prev) => prev + 1);
  };

  const setPreviousPage = () => {
    window.scrollTo(0, 0);

    setPage((prev) => prev - 1);
  };

  const handleActiveBtn = () => {
    setPage(1);

    setIsActiveOn(true);
    setIsConcludedOn(false);
  };

  const handleConcludedBtn = () => {
    setPage(1);

    setIsConcludedOn(true);
    setIsActiveOn(false);
  };

  const convertProgress = (current, total) => {
    return (100 * current) / total;
  };

  useEffect(() => {
    setRaffles([]);
    setActiveRafflesDisplaying([]);
    setConcludedRafflesDisplaying([]);
  }, []);

  useEffect(() => {
    const fetchRaffles = () => {
      setToLoad();
      setToAnimateFadeIn();

      api
        .get("/raffle/get-all-raffles")
        .then((res) => {
          setRaffles(res.data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setToAnimateFadeOut();

          setTimeout(() => {
            setNotToLoad();
          }, 400);
        });
    };

    fetchRaffles();
  }, [setRaffles]);

  useEffect(() => {
    const handlePage = () => {
      if (raffles.length !== 0) {
        if (isActiveOn) {
          setActiveRafflesDisplaying(
            raffles
              .filter(
                (raffle) =>
                  convertProgress(
                    raffle?.quantBuyedNumbers,
                    raffle?.quantNumbers,
                  ) < 100 && !raffle?.isFinished,
              )
              .slice(sliceBegin, sliceEnd),
          );
        }

        if (isConcludedOn) {
          setConcludedRafflesDisplaying(
            raffles.filter(
              (raffle) =>
                convertProgress(
                  raffle?.quantBuyedNumbers,
                  raffle?.quantNumbers,
                ) === 100 || raffle?.isFinished,
            ),
          );
        }
      }
    };

    handlePage();
  }, [
    setActiveRafflesDisplaying,
    setConcludedRafflesDisplaying,
    isActiveOn,
    isConcludedOn,
    raffles,
    page,
  ]);

  useEffect(() => {
    const activeUrls = [];
    const concludedUrls = [];

    for (let i = 0; i < activeRafflesDisplaying.length; i++) {
      if (activeRafflesDisplaying[i].raffleImage) {
        if (
          JSON.stringify(import.meta.env.MODE) === JSON.stringify("development")
        ) {
          activeUrls.push(
            `${import.meta.env.VITE_API_KEY_DEV}${
              import.meta.env.VITE_API_PORT
            }/raffle-uploads/${activeRafflesDisplaying[i].raffleImage}`,
          );
        } else {
          activeUrls.push(
            `${import.meta.env.VITE_API_KEY}/raffle-uploads/${
              activeRafflesDisplaying[i].raffleImage
            }`,
          );
        }
      } else {
        activeUrls.push(null);
      }
    }

    for (let i = 0; i < concludedRafflesDisplaying.length; i++) {
      if (concludedRafflesDisplaying[i].raffleImage) {
        if (
          JSON.stringify(import.meta.env.MODE) === JSON.stringify("development")
        ) {
          concludedUrls.push(
            `${import.meta.env.VITE_API_KEY_DEV}${
              import.meta.env.VITE_API_PORT
            }/raffle-uploads/${concludedRafflesDisplaying[i].raffleImage}`,
          );
        } else {
          concludedUrls.push(
            `${import.meta.env.VITE_API_KEY}/raffle-uploads/${
              concludedRafflesDisplaying[i].raffleImage
            }`,
          );
        }
      } else {
        concludedUrls.push(null);
      }
    }

    setActiveRafflesImagesUrls(activeUrls);
    setConcludedRafflesImagesUrls(concludedUrls);
  }, [activeRafflesDisplaying, concludedRafflesDisplaying]);

  return (
    <div className="raffle__raffle-content">
      {isLoading && <Loading>Buscando Sorteios</Loading>}
      <div className="raffle__raffle-content__container">
        <div className="raffle__raffle-content__container__above-box">
          <h1 className="raffle__raffle-content__container__above-box__title">
            ⚡ Prêmios
          </h1>

          <span className="raffle__raffle-content__container__above-box__desc">
            Escolha sua sorte
          </span>
        </div>

        <div className="raffle__raffle-content__container__filter-box">
          <span className="raffle__raffle-content__container__filter-box__desc">
            LISTAR
          </span>

          <div className="raffle__raffle-content__container__filter-box__btn-wrapper">
            <button
              onClick={handleActiveBtn}
              className={
                isActiveOn
                  ? "raffle__raffle-content__container__filter-box__btn-wrapper__btn filter-btn-active"
                  : "raffle__raffle-content__container__filter-box__btn-wrapper__btn"
              }
            >
              Ativos
            </button>
            <button
              onClick={handleConcludedBtn}
              className={
                isConcludedOn
                  ? "raffle__raffle-content__container__filter-box__btn-wrapper__btn filter-btn-active"
                  : "raffle__raffle-content__container__filter-box__btn-wrapper__btn"
              }
            >
              Concluídos
            </button>
          </div>
        </div>

        <div className="raffle__raffle-content__container__prizes-wrapper">
          {isActiveOn && activeRafflesDisplaying.length !== 0 ? (
            activeRafflesDisplaying.map((raffle, index) => (
              <Link key={raffle._id} to={`/raffles/${raffle._id}`}>
                <Prizes
                  title={raffle.title}
                  subtitle={raffle.subtitle}
                  image={activeRafflesImagesUrls[index] || null}
                  progress={convertProgress(
                    raffle?.quantBuyedNumbers,
                    raffle?.quantNumbers,
                  )}
                  winner={raffle?.isFinished}
                />
              </Link>
            ))
          ) : isActiveOn && activeRafflesDisplaying.length === 0 ? (
            <div className="raffle__raffle-content__container__prizes-wrapper__no-concluded-raffle-box">
              <p className="raffle__raffle-content__container__prizes-wrapper__no-concluded-raffle-box__no-concluded-raffle-text">
                Nenhuma rifa ativa no momento
              </p>
            </div>
          ) : null}

          {isConcludedOn && concludedRafflesDisplaying.length !== 0 ? (
            concludedRafflesDisplaying.map((raffle, index) => (
              <Link key={raffle._id} to={`/raffles/${raffle._id}`}>
                <Prizes
                  title={raffle.title}
                  subtitle={raffle.subtitle}
                  image={concludedRafflesImagesUrls[index] || null}
                  progress={convertProgress(
                    raffle?.quantBuyedNumbers,
                    raffle?.quantNumbers,
                  )}
                  winner={raffle?.isFinished}
                />
              </Link>
            ))
          ) : isConcludedOn && concludedRafflesDisplaying.length === 0 ? (
            <div className="raffle__raffle-content__container__prizes-wrapper__no-concluded-raffle-box">
              <p className="raffle__raffle-content__container__prizes-wrapper__no-concluded-raffle-box__no-concluded-raffle-text">
                Nenhuma rifa concluída no momento
              </p>
            </div>
          ) : null}
        </div>

        <div className="raffle__raffle-content__container__pages-btn-wrapper">
          <button
            onClick={setPreviousPage}
            disabled={page === 1 || isConcludedOn}
            className="raffle__raffle-content__container__pages-btn-wrapper__btn"
          >
            <BsChevronLeft /> Anterior
          </button>
          <button
            onClick={setNextPage}
            disabled={sliceEnd >= raffles.length || isConcludedOn}
            className="raffle__raffle-content__container__pages-btn-wrapper__btn"
          >
            Próximo <BsChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RafflePageContent;
