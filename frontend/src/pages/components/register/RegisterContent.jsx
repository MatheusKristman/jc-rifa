import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Loading from "../Loading";
import noUserPhoto from "../../../assets/no-user-photo.png";
import useUserStore from "../../../stores/useUserStore";
import useIsUserLogged from "../../../hooks/useIsUserLogged";
import useGeneralStore from "../../../stores/useGeneralStore";
import useHeaderStore from "../../../stores/useHeaderStore";
import api from "../../../services/api";

const schema = Yup.object().shape({
  profileImage: Yup.mixed(),
  name: Yup.string()
    .min(6, "Insira acima de 6 caracteres")
    .max(50, "Insira abaixo de 50 caracteres")
    .required("Nome é obrigatório"),
  cpf: Yup.string()
    .min(6, "Insira acima de 6 caracteres")
    .max(50, "Insira abaixo de 50 caracteres")
    .required("CPF é obrigatório"),
  email: Yup.string().email("Email inválido").required("Email é obrigatório"),
  tel: Yup.string()
    .min(14, "Insira o telefone corretamente")
    .required("Telefone é obrigatório"),
  confirmTel: Yup.string()
    .oneOf([Yup.ref("tel"), null], "Os telefones devem ser iguais")
    .required("Confirme seu telefone"),
});

const RegisterContent = () => {
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
  const { closeLogin } = useHeaderStore(
    (state) => ({ closeLogin: state.closeLogin }),
    shallow,
  );
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const [registerData, setRegisterData] = useState({
    profileImage: null,
    name: "",
    cpf: "",
    email: "",
    tel: "",
    confirmTel: "",
  });
  const [actualProfilePhoto, setActualProfilePhoto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  // TODO: se estiver logado, redirecionar para update register
  useIsUserLogged();

  const handleFormChange = (option, value) => {
    if (option === "tel" || option === "confirmTel") {
      const phoneNumber = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");

      setRegisterData((prev) => ({ ...prev, [option]: phoneNumber }));

      return;
    }

    if (option === "cpf") {
      const cpf = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");

      setRegisterData((prev) => ({ ...prev, [option]: cpf }));

      return;
    }

    setRegisterData((prev) => ({ ...prev, [option]: value }));
  };

  const handleFileChange = async (e) => {
    const file = await e.target.files[0];

    if (!file) {
      return;
    }

    if (file && file.type.startsWith("image/")) {
      setActualProfilePhoto(URL.createObjectURL(file));
      setRegisterData((prev) => ({ ...prev, profileImage: file }));
    } else {
      toast.error("O arquivo selecionado não é uma imagem válida", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);
  };

  useEffect(() => {
    closeLogin();
  }, []);

  useEffect(() => {
    function submitData() {
      if (isSubmitting) {
        const sendToDB = () => {
          setToLoad();
          setToAnimateFadeIn();

          const formData = new FormData();
          formData.append("profileImage", registerData.profileImage);
          formData.append("name", registerData.name);
          formData.append("cpf", registerData.cpf);
          formData.append("email", registerData.email);
          formData.append("tel", registerData.tel);

          api
            .post("/account/register-account", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              toast.success("Cadastro realizado com sucesso", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });

              localStorage.setItem("userToken", res.data);

              setToAnimateFadeOut();

              setTimeout(() => {
                setNotToLoad();
              }, 400);
            })
            .catch((error) => {
              window.scrollTo(0, 0);

              if (error.response.data === "Telefone Já cadastrado") {
                toast.error("Cadastro já registrado no sistema", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              } else {
                toast.error("Ocorreu um erro no cadastro", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              }

              console.error(error);

              setToAnimateFadeOut();

              setTimeout(() => {
                setNotToLoad();
              }, 400);
            })
            .finally(() => {
              setIsSubmitting(false);
              navigate("/");
            });
        };
        sendToDB();
      }
    }

    submitData();
  }, [isSubmitting]);

  return (
    <div className="register__register-content">
      {isLoading && <Loading>Enviando dados</Loading>}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="register__register-content__form"
      >
        <label
          htmlFor="profileImage"
          className="register__register-content__form__image-label"
        >
          <div className="register__register-content__form__image-label__image-box">
            <img
              src={actualProfilePhoto ? actualProfilePhoto : noUserPhoto}
              alt="Perfil"
              className="register__register-content__form__image-label__image-box__image"
            />
          </div>

          <input
            {...register("profileImage")}
            type="file"
            name="profileImage"
            id="profileImage"
            onChange={handleFileChange}
            className="register__register-content__form__image-label__input"
          />
        </label>

        <div
          style={user.length > 0 ? { display: "none" } : {}}
          className="register__register-content__form__profile-data-box"
        >
          <label
            htmlFor="name"
            className="register__register-content__form__profile-data-box__label"
          >
            Nome Completo
            <input
              {...register("name")}
              type="text"
              autoCorrect="off"
              autoComplete="off"
              name="name"
              id="name"
              value={registerData.name}
              onChange={(event) => handleFormChange("name", event.target.value)}
              style={
                errors.name ? { border: "2px solid rgb(209, 52, 52)" } : {}
              }
              className="register__register-content__form__profile-data-box__label__input"
            />
          </label>
          {errors.name && <span>{errors.name.message}</span>}

          <label
            htmlFor="cpf"
            className="register__register-content__form__profile-data-box__label"
          >
            CPF
            <input
              {...register("cpf")}
              type="text"
              autoCorrect="off"
              autoComplete="off"
              name="cpf"
              id="cpf"
              value={registerData.cpf}
              onChange={(event) => handleFormChange("cpf", event.target.value)}
              style={errors.cpf ? { border: "2px solid rgb(209, 52, 52)" } : {}}
              className="register__register-content__form__profile-data-box__label__input"
            />
          </label>
          {errors.cpf && <span>{errors.cpf.message}</span>}

          <label
            htmlFor="email"
            className="register__register-content__form__profile-data-box__label"
          >
            E-mail
            <input
              {...register("email")}
              type="text"
              autoCorrect="off"
              autoComplete="off"
              name="email"
              id="email"
              value={registerData.email}
              onChange={(event) =>
                handleFormChange("email", event.target.value)
              }
              style={
                errors.email ? { border: "2px solid rgb(209, 52, 52)" } : {}
              }
              className="register__register-content__form__profile-data-box__label__input"
            />
          </label>
          {errors.email && <span>{errors.email.message}</span>}

          <label
            htmlFor="tel"
            className="register__register-content__form__profile-data-box__label"
          >
            Telefone
            <input
              {...register("tel")}
              type="text"
              autoCorrect="off"
              autoComplete="off"
              name="tel"
              id="tel"
              value={registerData.tel}
              onChange={(event) => handleFormChange("tel", event.target.value)}
              placeholder="(__) _____-____"
              style={errors.tel ? { border: "2px solid rgb(209, 52, 52)" } : {}}
              className="register__register-content__form__profile-data-box__label__input"
            />
          </label>
          {errors.tel && <span>{errors.tel.message}</span>}

          <label
            htmlFor="telConfirm"
            className="register__register-content__form__profile-data-box__label"
          >
            Confirmar telefone
            <input
              {...register("confirmTel")}
              type="text"
              autoCorrect="off"
              autoComplete="off"
              name="confirmTel"
              id="confirmTel"
              value={registerData.confirmTel}
              onChange={(event) =>
                handleFormChange("confirmTel", event.target.value)
              }
              placeholder="(__) _____-____"
              style={
                errors.confirmTel
                  ? { border: "2px solid rgb(209, 52, 52)" }
                  : {}
              }
              className="register__register-content__form__profile-data-box__label__input"
            />
          </label>
          {errors.confirmTel && <span>{errors.confirmTel.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="register__register-content__form__save-btn"
        >
          Salvar
        </button>
      </form>
    </div>
  );
};

export default RegisterContent;
