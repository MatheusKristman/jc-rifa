import React, { useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Link } from "react-router-dom";

import Prizes from "../Prizes";
import useRaffleStore from "../../../stores/useRaffleStore";
import api from "../../../services/api";
import _arrayBufferToBase64 from "../../../hooks/useArrayBufferToBase64";
import useGeneralStore from "../../../stores/useGeneralStore";
import Loading from "../Loading";

const RafflePageContent = () => {
  const {
    raffles,
    setRaffles,
    isActiveOn,
    setActiveOn,
    setActiveOff,
    isConcludedOn,
    setConcludedOn,
    setConcludedOff,
    sliceBegin,
    sliceEnd,
    sliceEndBiggerThanRaffles,
    pageMultiplier,
    setSliceBegin,
    setSliceEnd,
    setNextPage,
    setPreviousPage,
    activeRafflesDisplaying,
    setActiveRafflesDisplaying,
    concludedRafflesDisplaying,
    setConcludedRafflesDisplaying,
    isPreviousPageBtnDisplayed,
    showPreviousPageBtn,
    hidePreviousPageBtn,
    isNextPageBtnDisplayed,
    showNextPageBtn,
    hideNextPageBtn,
    resetPageMultiplier,
    resetSliceBegin,
    resetSliceEnd,
    rafflesImagesUrls,
    setRafflesImagesUrls,
  } = useRaffleStore((state) => ({
    raffles: state.raffles,
    setRaffles: state.setRaffles,
    isActiveOn: state.isActiveOn,
    setActiveOn: state.setActiveOn,
    setActiveOff: state.setActiveOff,
    isConcludedOn: state.isConcludedOn,
    setConcludedOn: state.setConcludedOn,
    setConcludedOff: state.setConcludedOff,
    sliceBegin: state.sliceBegin,
    sliceEnd: state.sliceEnd,
    sliceEndBiggerThanRaffles: state.sliceEndBiggerThanRaffles,
    pageMultiplier: state.pageMultiplier,
    setSliceBegin: state.setSliceBegin,
    setSliceEnd: state.setSliceEnd,
    setNextPage: state.setNextPage,
    setPreviousPage: state.setPreviousPage,
    activeRafflesDisplaying: state.activeRafflesDisplaying,
    setActiveRafflesDisplaying: state.setActiveRafflesDisplaying,
    concludedRafflesDisplaying: state.concludedRafflesDisplaying,
    setConcludedRafflesDisplaying: state.setConcludedRafflesDisplaying,
    isPreviousPageBtnDisplayed: state.isPreviousPageBtnDisplayed,
    showPreviousPageBtn: state.showPreviousPageBtn,
    hidePreviousPageBtn: state.hidePreviousPageBtn,
    isNextPageBtnDisplayed: state.isNextPageBtnDisplayed,
    showNextPageBtn: state.showNextPageBtn,
    hideNextPageBtn: state.hideNextPageBtn,
    resetPageMultiplier: state.resetPageMultiplier,
    resetSliceBegin: state.resetSliceBegin,
    resetSliceEnd: state.resetSliceEnd,
    rafflesImagesUrls: state.rafflesImagesUrls,
    setRafflesImagesUrls: state.setRafflesImagesUrls,
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

          console.log(sliceEnd);

          if (res.data.length <= sliceEnd) {
            sliceEndBiggerThanRaffles(res.data.length);
          }
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

    fetchRaffles();
  }, [setRaffles]);

  useEffect(() => {
    const verificationPageBtns = () => {
      console.log(sliceEnd);
      if (raffles.length > 10 && activeRafflesDisplaying.length <= 10) {
        showPreviousPageBtn();
        showNextPageBtn();
      }

      if (sliceBegin === 0 && activeRafflesDisplaying.length <= 10) {
        hidePreviousPageBtn();
        hideNextPageBtn();
      }

      if (sliceEnd >= raffles.length) {
        showPreviousPageBtn();
        hideNextPageBtn();
      }

      // roda somente em caso de não ter proximo e nem anterior
      if (sliceEnd <= raffles.length + 1) {
        hidePreviousPageBtn();
        hideNextPageBtn();
      }

      if (sliceBegin === 0 && raffles.length > 10) {
        hidePreviousPageBtn();
        showNextPageBtn();
      }
    };

    const handlePage = () => {
      if (raffles.length !== 0) {
        verificationPageBtns();

        if (isConcludedOn) {
          hideNextPageBtn();
          hidePreviousPageBtn();
        }

        if (isActiveOn) {
          console.log("sliceBegin: ", sliceBegin);
          console.log("sliceEnd: ", sliceEnd);
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
          verificationPageBtns();
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
    pageMultiplier,
    setActiveRafflesDisplaying,
    setConcludedRafflesDisplaying,
    showNextPageBtn,
    showPreviousPageBtn,
    hideNextPageBtn,
    hidePreviousPageBtn,
    isActiveOn,
    isConcludedOn,
    raffles,
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

  const handleActiveBtn = () => {
    if (raffles.length <= sliceEnd) {
      sliceEndBiggerThanRaffles(raffles.length);
    } else {
      resetSliceEnd();
    }
    resetPageMultiplier();
    resetSliceBegin();
    setActiveOn();
    setConcludedOff();
  };

  const handleConcludedBtn = () => {
    resetPageMultiplier();
    resetSliceBegin();
    resetSliceEnd();
    setConcludedOn();
    setActiveOff();
  };

  const handleNextBtn = () => {
    window.scrollTo(0, 0);
    setNextPage();
    setSliceEnd();
    setSliceBegin();
  };

  const handlePreviousBtn = () => {
    window.scrollTo(0, 0);
    setPreviousPage();
    setSliceEnd();
    setSliceBegin();
  };

  const convertProgress = (current, total) => {
    return (100 * current) / total;
  };

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
            onClick={() => {
              if (pageMultiplier !== 1) {
                handlePreviousBtn();
              }
            }}
            className={
              isPreviousPageBtnDisplayed
                ? "raffle__raffle-content__container__pages-btn-wrapper__btn"
                : "raffle__raffle-content__container__pages-btn-wrapper__btn desactive"
            }
          >
            <BsChevronLeft /> Anterior
          </button>
          <button
            onClick={handleNextBtn}
            className={
              isNextPageBtnDisplayed
                ? "raffle__raffle-content__container__pages-btn-wrapper__btn"
                : "raffle__raffle-content__container__pages-btn-wrapper__btn desactive"
            }
          >
            Próximo <BsChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RafflePageContent;
