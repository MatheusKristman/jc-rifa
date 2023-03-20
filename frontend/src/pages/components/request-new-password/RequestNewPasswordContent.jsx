import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

import useRequestNewPasswordStore from "../../../stores/useRequestNewPasswordStore";
import useGeneralStore from "../../../stores/useGeneralStore";
import Loading from "../Loading";

export default function RequestNewPasswordContent() {
    const {
        email,
        setEmail,
        isSubmitting,
        submitting,
        notSubmitting,
        isEmailSended,
        emailSuccess,
        emailFail,
        submitError,
        errorExist,
        errorDontExist,
        setAlertMessage,
    } = useRequestNewPasswordStore(
        (state) => ({
            email: state.email,
            setEmail: state.setEmail,
            isSubmitting: state.isSubmitting,
            submitting: state.submitting,
            notSubmitting: state.notSubmitting,
            isEmailSended: state.isEmailSended,
            emailSuccess: state.emailSuccess,
            emailFail: state.emailFail,
            submitError: state.submitError,
            errorExist: state.errorExist,
            errorDontExist: state.errorDontExist,
            setAlertMessage: state.setAlertMessage,
        }),
        shallow
    );

    const { isLoading, setToLoad, setNotToLoad, setToAnimateFadeIn, setToAnimateFadeOut } = useGeneralStore((state) => ({
        isLoading: state.isLoading,
        setToLoad: state.setToLoad,
        setNotToLoad: state.setNotToLoad,
        setToAnimateFadeIn: state.setToAnimateFadeIn,
        setToAnimateFadeOut: state.setToAnimateFadeOut,
    }));

    const navigate = useNavigate();

    const schema = Yup.object().shape({
        email: Yup.string().email("Email inválido").required("Email é obrigatório"),
    });

    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(schema),
    });
    const { errors } = formState;

    const onSubmit = (data) => {
        submitting();
    };

    useEffect(() => {
        const submitData = () => {
            if (isSubmitting) {
                const sendToDb = () => {
                    setToLoad();
                    setToAnimateFadeIn();

                    api.post("/forgot-password", {
                        email,
                    })
                        .then((res) => {
                            emailSuccess();
                            setAlertMessage("Enviamos uma mensagem no seu email");

                            setToAnimateFadeOut();

                            setTimeout(() => {
                                setNotToLoad();
                            }, 400);
                        })
                        .catch((error) => {
                            window.scrollTo(0, 0);
                            if (error.response.data === "Erro ao enviar email") {
                                setRegisterMessage("Erro ao enviar email");
                            } else {
                                setRegisterMessage("Ocorreu um erro, tente novamente");
                            }
                            errorExist();
                            console.log(error.response);

                            setToAnimateFadeOut();

                            setTimeout(() => {
                                setNotToLoad();
                            }, 400);
                        });
                };

                sendToDb();
            }
        };

        submitData();
    }, [isSubmitting]);

    useEffect(() => {
        if (isEmailSended) {
            setTimeout(() => {
                emailFail();
                notSubmitting();
                navigate("/");
            }, 3000);
        }

        if (submitError) {
            setTimeout(() => {
                errorDontExist();
                notSubmitting();
            }, 4000);
        }
    }, [isEmailSended, submitError]);

    return (
        <div className="request-new-password__content">
            {isLoading && <Loading />}
            <div className="request-new-password__content__container">
                <h1 className="request-new-password__content__container__title">🔐 Esqueceu a senha?</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="request-new-password__content__container__form">
                    <label htmlFor="email">
                        E-mail
                        <input
                            {...register("email")}
                            placeholder="Digite seu email"
                            value={email}
                            onChange={setEmail}
                            name="email"
                            id="email"
                            style={errors.email ? { border: "2px solid rgb(209, 52, 52)" } : {}}
                        />
                    </label>
                    {errors.email && <span>{errors.email.message}</span>}

                    <button type="submit">Enviar</button>
                </form>
            </div>
        </div>
    );
}
