import React, { useEffect } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Link } from "react-router-dom";

import Prizes from "../Prizes";
import useRaffleStore from "../../../stores/useRaffleStore";
import api from "../../../services/api";
import _arrayBufferToBase64 from "../../../hooks/useArrayBufferToBase64";

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
    pageMultiplier,
    setSliceBegin,
    setSliceEnd,
    setNextPage,
    setPreviousPage,
    rafflesDisplaying,
    setRafflesDisplaying,
    isPreviousPageBtnDisplayed,
    showPreviousPageBtn,
    hidePreviousPageBtn,
    isNextPageBtnDisplayed,
    showNextPageBtn,
    hideNextPageBtn,
    resetPageMultiplier,
    resetSliceBegin,
    resetSliceEnd,
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
    pageMultiplier: state.pageMultiplier,
    setSliceBegin: state.setSliceBegin,
    setSliceEnd: state.setSliceEnd,
    setNextPage: state.setNextPage,
    setPreviousPage: state.setPreviousPage,
    rafflesDisplaying: state.rafflesDisplaying,
    setRafflesDisplaying: state.setRafflesDisplaying,
    isPreviousPageBtnDisplayed: state.isPreviousPageBtnDisplayed,
    showPreviousPageBtn: state.showPreviousPageBtn,
    hidePreviousPageBtn: state.hidePreviousPageBtn,
    isNextPageBtnDisplayed: state.isNextPageBtnDisplayed,
    showNextPageBtn: state.showNextPageBtn,
    hideNextPageBtn: state.hideNextPageBtn,
    resetPageMultiplier: state.resetPageMultiplier,
    resetSliceBegin: state.resetSliceBegin,
    resetSliceEnd: state.resetSliceEnd,
  }));

  // useEffect(() => {
  //   setRaffles([]);
  //   setRafflesDisplaying([]);
  // }, []);

  useEffect(() => {
    const fetchRaffles = () => {
      api
        .get("/raffles/get-all")
        .then((res) => setRaffles(res.data))
        .catch((error) => console.log(error));
    };

    fetchRaffles();
  }, [setRaffles]);

  useEffect(() => {
    const handlePage = () => {
      if (raffles.length !== 0) {
        if (raffles.length > 10 && rafflesDisplaying.length <= 10) {
          showPreviousPageBtn();
          showNextPageBtn();
        }

        if (sliceBegin === 0 && rafflesDisplaying.length <= 10) {
          hidePreviousPageBtn();
          hideNextPageBtn();
        }

        if (sliceEnd >= raffles.length) {
          showPreviousPageBtn();
          hideNextPageBtn();
        }

        if (sliceBegin === 0 && raffles.length > 10) {
          hidePreviousPageBtn();
          showNextPageBtn();
        }

        if (isConcludedOn) {
          hideNextPageBtn();
          hidePreviousPageBtn();
        }

        if (isActiveOn) {
          setRafflesDisplaying(
            raffles
              .filter(
                (raffle) =>
                  convertProgress(
                    raffle?.QuantNumbers - raffle?.NumbersAvailable.length,
                    raffle?.QuantNumbers
                  ) < 100 && !raffle?.isFinished
              )
              .slice(sliceBegin, sliceEnd)
          );
        }

        if (isConcludedOn) {
          setRafflesDisplaying(
            raffles.filter(
              (raffle) =>
                convertProgress(
                  raffle?.QuantNumbers - raffle?.NumbersAvailable.length,
                  raffle?.QuantNumbers
                ) === 100 || raffle?.isFinished
            )
          );
        }
      }
    };

    handlePage();
  }, [
    pageMultiplier,
    setRafflesDisplaying,
    showNextPageBtn,
    showPreviousPageBtn,
    hideNextPageBtn,
    hidePreviousPageBtn,
    isActiveOn,
    isConcludedOn,
    raffles,
  ]);

  const handleActiveBtn = () => {
    resetPageMultiplier();
    resetSliceBegin();
    resetSliceEnd();
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
      <div className="raffle__raffle-content__container">
        <div className="raffle__raffle-content__container__above-box">
          <h1 className="raffle__raffle-content__container__above-box__title">⚡ Prêmios</h1>

          <span className="raffle__raffle-content__container__above-box__desc">
            Escolha sua sorte
          </span>
        </div>

        <div className="raffle__raffle-content__container__filter-box">
          <span className="raffle__raffle-content__container__filter-box__desc">LISTAR</span>

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
          {isActiveOn &&
            rafflesDisplaying.map((raffle) => (
              <Link to={`/raffles/${raffle._id}`}>
                <Prizes
                  key={raffle._id}
                  title={raffle.title}
                  subtitle={raffle.subtitle}
                  image={
                    raffle.raffleImage.data
                      ? `data:${raffle.raffleImage.contentType};base64,${_arrayBufferToBase64(
                          raffle.raffleImage.data.data
                        )}`
                      : null
                  }
                  progress={convertProgress(
                    raffle?.QuantNumbers - raffle?.NumbersAvailable.length,
                    raffle?.QuantNumbers
                  )}
                  winner={raffle?.isFinished}
                />
              </Link>
            ))}

          {isConcludedOn &&
            rafflesDisplaying.map((raffle) => (
              <Link to={`/raffles/${raffle._id}`}>
                <Prizes
                  key={raffle._id}
                  title={raffle.title}
                  subtitle={raffle.subtitle}
                  image={
                    raffle.raffleImage.data
                      ? `data:${raffle.raffleImage.contentType};base64,${_arrayBufferToBase64(
                          raffle.raffleImage.data.data
                        )}`
                      : null
                  }
                  progress={convertProgress(
                    raffle?.QuantNumbers - raffle?.NumbersAvailable.length,
                    raffle?.QuantNumbers
                  )}
                  winner={raffle?.isFinished}
                />
              </Link>
            ))}
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

// TODO loading quando carrega as rifas
