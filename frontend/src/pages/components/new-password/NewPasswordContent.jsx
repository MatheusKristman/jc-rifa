import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import api from "../../../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";

import useNewPasswordStore from "../../../stores/useNewPasswordStore";
import useUserStore from "../../../stores/useUserStore";
import useGeneralStore from "../../../stores/useGeneralStore";
import Loading from "../Loading";

export default function NewPasswordContent() {
  const {
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    isSubmitting,
    submitting,
    notSubmitting,
    isChangeCompleted,
    changeComplete,
    changeNotComplete,
    submitError,
    errorExist,
    errorDontExist,
    setRegisterMessage,
  } = useNewPasswordStore((state) => ({
    password: state.password,
    setPassword: state.setPassword,
    newPassword: state.newPassword,
    setNewPassword: state.setNewPassword,
    confirmNewPassword: state.confirmNewPassword,
    setConfirmNewPassword: state.setConfirmNewPassword,
    isSubmitting: state.isSubmitting,
    submitting: state.submitting,
    notSubmitting: state.notSubmitting,
    isChangeCompleted: state.isChangeCompleted,
    changeComplete: state.changeComplete,
    changeNotComplete: state.changeNotComplete,
    submitError: state.submitError,
    errorExist: state.errorExist,
    errorDontExist: state.errorDontExist,
    setRegisterMessage: state.setRegisterMessage,
  }));

  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));

  const { isLoading, setToLoad, setNotToLoad, setToAnimateFadeIn, setToAnimateFadeOut } = useGeneralStore((state) => ({
    isLoading: state.isLoading,
    setToLoad: state.setToLoad,
    setNotToLoad: state.setNotToLoad,
    setToAnimateFadeIn: state.setToAnimateFadeIn,
    setToAnimateFadeOut: state.setToAnimateFadeOut,
  }));

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const schema = Yup.object().shape({
    newPassword: Yup.string()
      .notOneOf([Yup.ref("password"), null], "A nova senha não pode ser igual a atual")
      .required("Digite sua nova senha para alterar"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "As senhas devem ser iguais")
      .required("Confirme sua nova senha"),
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  useEffect(() => {
    console.log(searchParams.get("token"));
    console.log(searchParams.get("email"));
  }, []);

  useEffect(() => {
    function submitData() {
      if (isSubmitting) {
        const sendToDB = () => {
          setToLoad();
          setToAnimateFadeIn();

          console.log(searchParams.get("email"));
          console.log(searchParams.get("token"));

          api
            .post("/reset-password", {
              email: searchParams.get("email"),
              token: searchParams.get("token"),
              password: newPassword,
            })
            .then((res) => {
              changeComplete();
              setRegisterMessage("Senha alterada com sucesso");

              setToAnimateFadeOut();

              setTimeout(() => {
                setNotToLoad();
              }, 400);
            })
            .catch((error) => {
              window.scrollTo(0, 0);
              console.log(error);
              if (error.response.data === "Senha incorreta") {
                setRegisterMessage("Senha incorreta");
              } else {
                setRegisterMessage("Ocorreu um erro no cadastro");
              }
              errorExist();
              console.log(error.response);

              setToAnimateFadeOut();

              setTimeout(() => {
                setNotToLoad();
              }, 400);
            });
        };

        sendToDB();
      }
    }

    submitData();
  }, [isSubmitting]);

  useEffect(() => {
    if (isChangeCompleted) {
      setTimeout(() => {
        changeNotComplete();
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
  }, [isChangeCompleted, submitError]);

  const onSubmit = (data) => {
    submitting();
  };

  return (
    <div className="new-password__content">
      {isLoading && <Loading>Enviando dados</Loading>}
      <div className="new-password__content__container">
        <h1 className="new-password__content__container__title">🔒 Nova senha</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="new-password__content__container__form">
          <div className="new-password__content__container__form__wrapper">
            <label htmlFor="newPassword" className="new-password__content__container__form__wrapper__label">
              Nova senha
              <input
                {...register("newPassword")}
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="Digite sua nova senha"
                value={newPassword}
                onChange={setNewPassword}
                style={errors.newPassword ? { border: "2px solid rgb(209, 52, 52)" } : {}}
                className="new-password__content__container__form__wrapper__label__input"
              />
            </label>
            {errors.newPassword && <span>{errors.newPassword.message}</span>}

            <label htmlFor="confirmNewPassword" className="new-password__content__container__form__wrapper__label">
              Confirmar nova senha
              <input
                {...register("confirmNewPassword")}
                type="password"
                name="confirmNewPassword"
                id="confirmNewPassword"
                placeholder="Confirme sua nova senha"
                value={confirmNewPassword}
                onChange={setConfirmNewPassword}
                style={errors.confirmNewPassword ? { border: "2px solid rgb(209, 52, 52)" } : {}}
                className="new-password__content__container__form__wrapper__label__input"
              />
            </label>
            {errors.confirmNewPassword && <span>{errors.confirmNewPassword.message}</span>}
          </div>

          <button type="submit" className="new-password__content__container__form__submit-btn">
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}
