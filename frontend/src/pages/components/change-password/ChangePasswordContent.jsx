import React, { useEffect } from "react";
import { shallow } from 'zustand/shallow';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import api from '../../../services/api';
import { useNavigate } from "react-router-dom";

import useChangePasswordStore from '../../../stores/useChangePasswordStore';
import useUserStore from "../../../stores/useUserStore";

const ChangePasswordContent = () => {
  const {
    password,
    setPassword,
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
  } = useChangePasswordStore(
    (state) => ({
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
    })
  );

  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));

  const navigate = useNavigate();

  const schema = Yup.object().shape({
    password: Yup.string().required('Senha é obrigatória'),
    newPassword: Yup.string().notOneOf([Yup.ref('password'), null], 'A nova senha não pode ser igual a atual').required('Digite sua nova senha para alterar'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'As senhas devem ser iguais').required('Confirme sua nova senha'),
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
  });
  
  const { errors } = formState;

  useEffect(() => {
    function submitData() {
      if (isSubmitting) {
        const sendToDB = () => {
          const formData = new FormData();

          formData.append('id', user._id);
          formData.append('password', password);
          formData.append('newPassword', newPassword);

          api
            .put('/changePassword/updating', formData, {
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then((res) => {
              changeComplete();
              setRegisterMessage('Senha alterada com sucesso');
              setUser({ ...res.data });
            })
            .catch((error) => {
              window.scrollTo(0, 0);
              console.log(error);
              if (error.response.data === 'Senha incorreta') {
                setRegisterMessage('Senha incorreta');
              } else {
                setRegisterMessage('Ocorreu um erro no cadastro');
              }
              errorExist();
              console.log(error.response);
            })
        }

        sendToDB();
      }
    }

    submitData();
  }, [isSubmitting]);

  useEffect(() => {
    if (isChangeCompleted) {
      console.log(isChangeCompleted);
      setTimeout(() => {
        changeNotComplete();
        notSubmitting();
        navigate('/');
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
    console.log(data);

    submitting();
  }

  return (
    <div className="change-password__content">
      <div className="change-password__content__container">
        <h1 className="change-password__content__container__title">🔒 Mudar senha</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="change-password__content__container__form">
          <div className="change-password__content__container__form__wrapper">
            <label
              htmlFor="password"
              className="change-password__content__container__form__wrapper__label"
            >
              Senha
              <input
                {...register('password')}
                type="password"
                name="password"
                id="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={setPassword}
                style={errors.password ? { border: '2px solid rgb(209, 52, 52)' } : {}}
                className="change-password__content__container__form__wrapper__label__input"
              />
            </label>
            {errors.password && <span>{errors.password.message}</span>}

            <label
              htmlFor="newPassword"
              className="change-password__content__container__form__wrapper__label"
            >
              Nova senha
              <input
                {...register('newPassword')}
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="Digite sua nova senha"
                value={newPassword}
                onChange={setNewPassword}
                style={errors.newPassword ? { border: '2px solid rgb(209, 52, 52)' } : {}}
                className="change-password__content__container__form__wrapper__label__input"
              />
            </label>
            {errors.newPassword && <span>{errors.newPassword.message}</span>}

            <label
              htmlFor="confirmNewPassword"
              className="change-password__content__container__form__wrapper__label"
            >
              Confirmar nova senha
              <input
                {...register('confirmNewPassword')}
                type="password"
                name="confirmNewPassword"
                id="confirmNewPassword"
                placeholder="Confirme sua nova senha"
                value={confirmNewPassword}
                onChange={setConfirmNewPassword}
                style={errors.confirmNewPassword ? { border: '2px solid rgb(209, 52, 52)' } : {}}
                className="change-password__content__container__form__wrapper__label__input"
              />
            </label>
            {errors.confirmNewPassword && <span>{errors.confirmNewPassword.message}</span>}
          </div>

          <button type="submit" className="change-password__content__container__form__submit-btn">
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordContent;
