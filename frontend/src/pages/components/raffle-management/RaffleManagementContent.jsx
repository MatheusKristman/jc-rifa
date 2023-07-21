import React, { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";

import Prizes from "../Prizes";
import useRaffleStore from "../../../stores/useRaffleStore";
import _arrayBufferToBase64 from "../../../hooks/useArrayBufferToBase64";
import Loading from "../Loading";
import useGeneralStore from "../../../stores/useGeneralStore";

const RaffleManagementContent = () => {
    const navigate = useNavigate();

    const { raffles, setRaffles, rafflesImagesUrls, setRafflesImagesUrls } = useRaffleStore(
        (state) => ({
            raffles: state.raffles,
            setRaffles: state.setRaffles,
            rafflesImagesUrls: state.rafflesImagesUrls,
            setRafflesImagesUrls: state.setRafflesImagesUrls,
        }),
    );

    const { isLoading, setToLoad, setNotToLoad, setToAnimateFadeIn, setToAnimateFadeOut } =
        useGeneralStore((state) => ({
            isLoading: state.isLoading,
            setToLoad: state.setToLoad,
            setNotToLoad: state.setNotToLoad,
            setToAnimateFadeIn: state.setToAnimateFadeIn,
            setToAnimateFadeOut: state.setToAnimateFadeOut,
        }));

    useEffect(() => {
        const fetchRaffles = () => {
            setToLoad();
            setToAnimateFadeIn();

            api.get("/raffle/get-all-raffles")
                .then((res) => {
                    setRaffles(res.data);
                    console.log(res.data);

                    const urls = [];
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].raffleImage) {
                            if (
                                JSON.stringify(import.meta.env.MODE) ===
                                JSON.stringify("development")
                            ) {
                                urls.push(
                                    `${import.meta.env.VITE_API_KEY_DEV}${
                                        import.meta.env.VITE_API_PORT
                                    }/raffle-uploads/${res.data[i].raffleImage}`,
                                );
                            } else {
                                urls.push(
                                    `${import.meta.env.VITE_API_KEY}/raffle-uploads/${
                                        res.data[i].raffleImage
                                    }`,
                                );
                            }
                        } else {
                            urls.push(null);
                        }
                    }

                    setRafflesImagesUrls(urls);

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
                    });
                });
        };

        fetchRaffles();
    }, [setRaffles]);

    const convertProgress = (current, total) => {
        return (100 * current) / total;
    };

    return (
        <div className="raffle-management__content">
            {isLoading && <Loading>Carregando rifas</Loading>}
            <div className="raffle-management__content__container">
                <div className="raffle-management__content__container__info-wrapper">
                    <h1 className="raffle-management__content__container__info-wrapper__title">
                        ⚙️ Gerenciador de Rifas
                    </h1>

                    <button
                        onClick={() => navigate("/create-new-raffle")}
                        type="button"
                        className="raffle-management__content__container__info-wrapper__add-btn">
                        <AiOutlinePlus color="white" /> Criar
                    </button>
                </div>

                <div className="raffle-management__content__container__raffle-wrapper">
                    <ul className="raffle-management__content__container__raffle-wrapper__list">
                        {raffles.map((raffle, index) => (
                            <li
                                key={raffle._id}
                                className="raffle-management__content__container__raffle-wrapper__list__list-item">
                                <Link
                                    to={`/edit-raffle/${raffle._id}`}
                                    className="raffle-management__content__container__raffle-wrapper__list__list-item__link">
                                    <Prizes
                                        title={raffle.title}
                                        subtitle={raffle.subtitle}
                                        image={rafflesImagesUrls[index]}
                                        progress={convertProgress(
                                            raffle?.QuantNumbers - raffle?.NumbersAvailable.length,
                                            raffle?.QuantNumbers,
                                        )}
                                        winner={raffle?.isFinished}
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RaffleManagementContent;

// TODO adicionar seção de promoção
