import * as yup from "yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import useUserStore from "../../../stores/useUserStore";
import api from "../../../services/api";

const passwordSchema = yup.object().shape({
  actualPassword: yup.string().required("Campo Senha Atual é obrigatório"),
  newPassword: yup
    .string()
    .min(6, "Campo Senha Nova precisa ter no mínimo 6 caracteres")
    .required("Campo Senha Nova é obrigatório"),
  newPasswordConfirm: yup
    .string()
    .oneOf(
      [yup.ref("newPassword"), null],
      "As senhas não iguais, verifique novamente",
    )
    .required("Campo Confirmar Senha Nova é obrigatório"),
});

const UpdatePasswordContent = () => {
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));

  const [actualPassword, setActualPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(passwordSchema),
  });
  const { errors } = formState;

  const isSubmitEnabled =
    actualPassword.length === 0 ||
    newPassword.length < 6 ||
    newPasswordConfirm.length < 6 ||
    isSubmittingPassword;

  const onSubmit = (data) => {
    setIsSubmittingPassword(true);
  };

  useEffect(() => {
    const updatePassword = () => {
      const data = {
        id: user._id,
        actualPassword,
        newPassword,
      };

      api
        .post("/account/update-password", data)
        .then((res) => {
          setUser({ ...res.data });

          toast.success("Senha alterada com sucesso", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          setActualPassword("");
          setNewPassword("");
          setNewPasswordConfirm("");

          setValue("actualPassword", "");
          setValue("newPassword", "");
          setValue("newPasswordConfirm", "");
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        })
        .finally(() => {
          setIsSubmittingPassword(false);
        });
    };

    if (isSubmittingPassword) {
      updatePassword();
    }
  }, [isSubmittingPassword]);

  return (
    <div className="register__update-password-content">
      <h2 className="register__update-password-content__title">
        🔒 Mudar senha
      </h2>

      <div className="register__update-password-content__form-box">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="register__update-password-content__form-box__form"
        >
          <label className="register__update-password-content__form-box__form__label">
            Senha Atual
            <input
              {...register("actualPassword")}
              type="password"
              autoCorrect="off"
              autoComplete="off"
              name="actualPassword"
              id="actualPassword"
              value={actualPassword}
              onChange={(event) => setActualPassword(event.target.value)}
              style={
                errors.actualPassword
                  ? { border: "2px solid rgb(209, 52, 52)" }
                  : {}
              }
              className="register__update-password-content__form-box__form__label__input"
            />
            {errors.actualPassword && (
              <span className="register__update-password-content__form-box__form__label__error">
                {errors.actualPassword?.message}
              </span>
            )}
          </label>

          <label className="register__update-password-content__form-box__form__label">
            Senha Nova
            <input
              {...register("newPassword")}
              type="password"
              autoCorrect="off"
              autoComplete="off"
              name="newPassword"
              id="newPassword"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              style={
                errors.newPassword
                  ? { border: "2px solid rgb(209, 52, 52)" }
                  : {}
              }
              className="register__update-password-content__form-box__form__label__input"
            />
            {errors.newPassword && (
              <span className="register__update-password-content__form-box__form__label__error">
                {errors.newPassword?.message}
              </span>
            )}
          </label>

          <label className="register__update-password-content__form-box__form__label">
            Confirmar Senha Nova
            <input
              {...register("newPasswordConfirm")}
              type="password"
              autoCorrect="off"
              autoComplete="off"
              name="newPasswordConfirm"
              id="newPasswordConfirm"
              value={newPasswordConfirm}
              onChange={(event) => setNewPasswordConfirm(event.target.value)}
              style={
                errors.newPasswordConfirm
                  ? { border: "2px solid rgb(209, 52, 52)" }
                  : {}
              }
              className="register__update-password-content__form-box__form__label__input"
            />
            {errors.newPasswordConfirm && (
              <span className="register__update-password-content__form-box__form__label__error">
                {errors.newPasswordConfirm?.message}
              </span>
            )}
          </label>

          <button
            type="submit"
            disabled={isSubmitEnabled}
            className="register__update-password-content__form-box__form__submit-button"
          >
            Atualizar Senha
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordContent;
