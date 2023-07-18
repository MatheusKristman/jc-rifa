import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import useNewRaffleStore from "../../../stores/useNewRaffleStore";
import useGeneralStore from "../../../stores/useGeneralStore";
import DefaultPrize from "../../../assets/default-prize.jpg";
import useRaffleStore from "../../../stores/useRaffleStore";
import api from "../../../services/api";

const NewRaffleContent = () => {
    const {
        numbersOptions,
        raffleImage,
        setRaffleImage,
        title,
        setTitle,
        subtitle,
        setSubtitle,
        description,
        setDescription,
        price,
        setPrice,
        raffleNumbers,
        setRaffleNumbers,
        isSubmitting,
        submitConfirm,
        submitCancel,
        isRaffleCreated,
        raffleCreatedSuccess,
        raffleCreatedCancel,
        submitError,
        errorExist,
        errorDontExist,
        setRaffleCreatedMessage,
        resetValues,
    } = useNewRaffleStore(
        (state) => ({
            numbersOptions: state.numbersOptions,
            raffleImage: state.raffleImage,
            setRaffleImage: state.setRaffleImage,
            title: state.title,
            setTitle: state.setTitle,
            subtitle: state.subtitle,
            setSubtitle: state.setSubtitle,
            description: state.description,
            setDescription: state.setDescription,
            price: state.price,
            setPrice: state.setPrice,
            raffleNumbers: state.raffleNumbers,
            setRaffleNumbers: state.setRaffleNumbers,
            isSubmitting: state.isSubmitting,
            submitConfirm: state.submitConfirm,
            submitCancel: state.submitCancel,
            isRaffleCreated: state.isRaffleCreated,
            raffleCreatedSuccess: state.raffleCreatedSuccess,
            raffleCreatedCancel: state.raffleCreatedCancel,
            submitError: state.submitError,
            errorExist: state.errorExist,
            errorDontExist: state.errorDontExist,
            setRaffleCreatedMessage: state.setRaffleCreatedMessage,
            resetValues: state.resetValues,
        }),
        shallow
        );
    const { setRaffles } = useRaffleStore((state) => ({ setRaffles: state.setRaffles }), shallow);
    const { setToLoad, setNotToLoad } = useGeneralStore((state) => ({
        setToLoad: state.setToLoad,
        setNotToLoad: state.setNotToLoad,
    }));

    const handleFileChange = async (e) => {
        const file = await e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onload = () => {
                setRaffleImage({
                    file,
                    url: reader.result,
                });
            };
        }
    };

    const schema = Yup.object().shape({
        raffleImage: Yup.mixed(),
        title: Yup.string().required("Título é obrigatório"),
        subtitle: Yup.string().required("Subtítulo é obrigatório"),
        description: Yup.string(),
        price: Yup.string().required("Preço é obrigatório"),
        QuantNumbers: Yup.number().required("Quantidade de Números é obrigatória"),
    });

    const { register, handleSubmit, formState, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const { errors } = formState;

    const navigate = useNavigate();

    useEffect(() => {
        const submitData = () => {
            if (isSubmitting) {
                const sendRaffleToDB = () => {
                    setToLoad();
                    const formData = new FormData();

                    formData.append("raffleImage", raffleImage.file ? raffleImage.file : DefaultPrize);
                    formData.append("title", title);
                    formData.append("subtitle", subtitle);
                    formData.append("description", description);
                    formData.append("price", price);
                    formData.append("QuantNumbers", raffleNumbers);

                    api.post("/raffle/create-raffle", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                        .then(() => {
                            api.get("/create-new-raffle/get-raffles")
                                .then((res) => {
                                    setRaffles(res.data);
                                })
                                .catch((error) => {
                                    console.log(error);
                                });

                            raffleCreatedSuccess();
                            setRaffleCreatedMessage("Rifa criada com sucesso");
                        })
                        .catch((error) => {
                            if (error.response?.data === "Rifa já cadastrada") {
                                setRaffleCreatedMessage("Rifa já cadastrada");
                            } else {
                                setRaffleCreatedMessage("Ocorreu um erro na criação da rifa");
                            }

                            errorExist();
                            console.log(error);
                        })
                        .finally(() => {
                            console.log("terminei o load");
                            setNotToLoad();
                        });
                };

                sendRaffleToDB();
            }
        };

        submitData();
    }, [isSubmitting]);

    useEffect(() => {
        if (isRaffleCreated) {
            setTimeout(() => {
                raffleCreatedCancel();
                submitCancel();
                resetValues();
                navigate("/raffle-management");
            }, 3000);
        }

        if (submitError) {
            setTimeout(() => {
                errorDontExist();
                submitCancel();
            }, 4000);
        }
    }, [isRaffleCreated, submitError]);

    function coinMask(event) {
        const onlyDigits = event.target.value
            .split("")
            .filter((s) => /\d/.test(s))
            .join("")
            .padStart(3, "0");
        const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2);
        event.target.value = maskCurrency(digitsFloat);
    }

    function maskCurrency(valor, locale = "pt-BR", currency = "BRL") {
        const valueConverted = new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
        }).format(valor);

        setPrice(valueConverted);

        return valueConverted;
    }

    const onSubmit = (data) => {
        if (!raffleImage.file) {
            setRaffleImage({
                file: null,
                url: DefaultPrize,
            });
        }

        submitConfirm();
    };

    return (
        <div className="new-raffle__content">
            <div className="new-raffle__content__container">
                <h1 className="new-raffle__content__container__title">Criando uma nova rifa</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="new-raffle__content__container__form">
                    <label htmlFor="raffleImage" className="new-raffle__content__container__form__image-label">
                        <div className="new-raffle__content__container__form__image-label__image-box">
                            <img
                                src={raffleImage?.url ? raffleImage.url : DefaultPrize}
                                alt="Perfil"
                                className="new-raffle__content__container__form__image-label__image-box__image"
                            />
                        </div>

                        <input
                            {...register("raffleImage")}
                            type="file"
                            name="raffleImage"
                            id="raffleImage"
                            onChange={handleFileChange}
                            className="new-raffle__content__container__form__image-label__input"
                        />
                    </label>

                    <div className="new-raffle__content__container__form__inputs-box">
                        <label htmlFor="title" className="new-raffle__content__container__form__inputs-box__label">
                            Título
                            <input
                                {...register("title")}
                                type="text"
                                name="title"
                                id="title"
                                value={title}
                                onChange={setTitle}
                                style={errors.title ? { border: "2px solid rgb(209, 52, 52)" } : {}}
                                className="new-raffle__content__container__form__inputs-box__label__input"
                            />
                        </label>
                        {errors.title && <span>{errors.title.message}</span>}

                        <label htmlFor="subtitle" className="new-raffle__content__container__form__inputs-box__label">
                            Subtítulo
                            <input
                                {...register("subtitle")}
                                type="text"
                                name="subtitle"
                                id="subtitle"
                                value={subtitle}
                                onChange={setSubtitle}
                                style={errors.subtitle ? { border: "2px solid rgb(209, 52, 52)" } : {}}
                                className="new-raffle__content__container__form__inputs-box__label__input"
                            />
                        </label>
                        {errors.subtitle && <span>{errors.subtitle.message}</span>}

                        <label htmlFor="description" className="new-raffle__content__container__form__inputs-box__label">
                            Descrição
                            <textarea
                                {...register("description")}
                                id="description"
                                name="description"
                                value={description}
                                onChange={setDescription}
                                style={errors.description ? { border: "2px solid rgb(209, 52, 52)" } : {}}
                                className="new-raffle__content__container__form__inputs-box__label__textarea"
                            />
                        </label>
                        {errors.description && <span>{errors.description.message}</span>}

                        <label htmlFor="price" className="new-raffle__content__container__form__inputs-box__label">
                            Preço por números
                            <input
                                {...register("price")}
                                type="text"
                                name="price"
                                id="price"
                                value={price}
                                onChange={(e) => coinMask(e)}
                                style={errors.price ? { border: "2px solid rgb(209, 52, 52)" } : {}}
                                className="new-raffle__content__container__form__inputs-box__label__input"
                            />
                        </label>
                        {errors.price && <span>{errors.price.message}</span>}

                        <label htmlFor="QuantNumbers" className="new-raffle__content__container__form__inputs-box__label">
                            Quantidade de Números
                            <select
                                {...register("QuantNumbers")}
                                name="QuantNumbers"
                                id="QuantNumbers"
                                value={raffleNumbers}
                                onChange={setRaffleNumbers}
                                style={errors.QuantNumbers ? { border: "2px solid rgb(209, 52, 52)" } : {}}
                                className="new-raffle__content__container__form__inputs-box__label__select"
                            >
                                {numbersOptions.map((numbers, index) => (
                                    <option key={`number-${index}`} value={numbers}>
                                        {numbers}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {errors.QuantNumbers && <span>{errors.QuantNumbers.message}</span>}
                    </div>

                    <button type="submit" className="new-raffle__content__container__form__submit-btn">
                        Salvar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewRaffleContent;
