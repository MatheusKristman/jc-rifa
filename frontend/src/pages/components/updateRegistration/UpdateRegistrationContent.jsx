import React, { useEffect, useLayoutEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Loading from "../Loading";
import noUserPhoto from "../../../assets/no-user-photo.png";
import useUserStore from "../../../stores/useUserStore";
import useIsUserLogged from "../../../hooks/useIsUserLogged";
import useGeneralStore from "../../../stores/useGeneralStore";
import api from "../../../services/api";

const schema = Yup.object().shape({
  profileImage: Yup.mixed(),
  name: Yup.string()
    .min(6, "Insira acima de 6 caracteres")
    .max(50, "Insira abaixo de 50 caracteres")
    .required("Nome é obrigatório"),
  email: Yup.string().email("Email inválido").required("Email é obrigatório"),
  tel: Yup.string()
    .min(14, "Insira o telefone corretamente")
    .required("Telefone é obrigatório"),
  cpf: Yup.string()
    .min(6, "Insira acima de 6 caracteres")
    .max(50, "Insira abaixo de 50 caracteres")
    .test("cpf", "CPF Inválido", (value) => {
      let Soma;
      let Resto;
      let cpf = value.replace(/[^\d]+/g, "");

      Soma = 0;

      if (
        cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999"
      ) {
        return false;
      }

      for (let i = 1; i <= 9; i++) {
        Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }

      Resto = (Soma * 10) % 11;

      if (Resto == 10 || Resto == 11) {
        Resto = 0;
      }

      if (Resto != parseInt(cpf.substring(9, 10))) {
        return false;
      }

      Soma = 0;

      for (let i = 1; i <= 10; i++) {
        Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }

      Resto = (Soma * 10) % 11;

      if (Resto == 10 || Resto == 11) {
        Resto = 0;
      }

      if (Resto != parseInt(cpf.substring(10, 11))) {
        return false;
      }

      return true;
    })
    .required("CPF é obrigatório"),
  cep: Yup.string(),
  address: Yup.string(),
  number: Yup.string(),
  neighborhood: Yup.string(),
  complement: Yup.string(),
  uf: Yup.string(),
  city: Yup.string(),
  reference: Yup.string(),
});

const UpdateRegistrationContent = () => {
  const { user, isUserLogged, setUser } = useUserStore(
    (state) => ({
      user: state.user,
      isUserLogged: state.isUserLogged,
      setUser: state.setUser,
    }),
    shallow,
  );

  const {
    isLoading,
    setToLoad,
    setNotToLoad,
    setToAnimateFadeIn,
    setToAnimateFadeOut,
  } = useGeneralStore(
    (state) => ({
      isLoading: state.isLoading,
      setToLoad: state.setToLoad,
      setNotToLoad: state.setNotToLoad,
      setToAnimateFadeIn: state.setToAnimateFadeIn,
      setToAnimateFadeOut: state.setToAnimateFadeOut,
    }),
    shallow,
  );

  const [registerData, setRegisterData] = useState({
    profileImage: null,
    name: "",
    cpf: "",
    email: "",
    tel: "",
    cep: "",
    address: "",
    number: "",
    neighborhood: "",
    complement: "",
    uf: "",
    city: "",
    reference: "",
  });
  const [actualProfilePhoto, setActualProfilePhoto] = useState("");
  const [ufOptions, setUfOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  useIsUserLogged("/updateRegistration");

  const handleFormChange = (option, value) => {
    if (option === "tel") {
      const phoneNumber = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");

      setRegisterData((prev) => ({ ...prev, tel: phoneNumber }));

      return;
    }

    if (option === "cpf") {
      const cpf = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");

      setRegisterData((prev) => ({ ...prev, cpf: cpf }));

      return;
    }

    if (option === "cep") {
      const cep = value
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{3})\d+?$/, "$1");

      setRegisterData((prev) => ({ ...prev, cep: cep }));

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

  useLayoutEffect(() => {
    const fetchingUserData = () => {
      if (isUserLogged) {
        setRegisterData((prev) => ({ ...prev, profileImage: null }));

        if (user.profileImage) {
          if (
            JSON.stringify(import.meta.env.MODE) ===
            JSON.stringify("development")
          ) {
            setActualProfilePhoto(
              `${import.meta.env.VITE_API_KEY_DEV}${
                import.meta.env.VITE_API_PORT
              }/user-uploads/${user.profileImage}`,
            );
          } else {
            setActualProfilePhoto(
              `${import.meta.env.VITE_API_KEY}/user-uploads/${
                user.profileImage
              }`,
            );
          }
        } else {
          setActualProfilePhoto(null);
        }

        setRegisterData((prev) => ({
          ...prev,
          name: user.name,
          email: user.email,
          tel: user.tel,
          cpf: user.cpf,
          cep: user?.cep,
          address: user?.address,
          number: user?.number,
          neighborhood: user?.neighborhood,
          complement: user?.complement,
          uf: user?.uf,
          city: user?.city,
          reference: user?.reference,
        }));

        setValue("name", user.name);
        setValue("email", user.email);
        setValue("tel", user.tel);
        setValue("cpf", user.cpf);

        if (user.hasOwnProperty("cep")) {
          setValue("cep", user.cep);
        }

        if (user.hasOwnProperty("address")) {
          setValue("address", user.address);
        }

        if (user.hasOwnProperty("number")) {
          setValue("number", user.number);
        }

        if (user.hasOwnProperty("neighborhood")) {
          setValue("neighborhood", user.neighborhood);
        }

        if (user.hasOwnProperty("complement")) {
          setValue("complement", user.complement);
        }

        if (user.hasOwnProperty("uf")) {
          setValue("uf", user.uf);
        }

        if (user.hasOwnProperty("city")) {
          setValue("city", user.city);
        }

        if (user.hasOwnProperty("reference")) {
          setValue("reference", user.reference);
        }
      }
    };

    fetchingUserData();
  }, [user]);

  useEffect(() => {
    setToLoad();
    setToAnimateFadeIn();

    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/")
      .then((res) => {
        setUfOptions(res.data);
        setToAnimateFadeOut();

        setTimeout(() => {
          setNotToLoad();
        }, 400);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (ufOptions.length > 0) {
      const ufSelected = ufOptions.filter(
        (option) => option.sigla === registerData.uf,
      );

      if (ufSelected.length > 0) {
        axios
          .get(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelected[0].id}/municipios`,
          )
          .then((res) => setCityOptions(res.data))
          .catch((error) => console.error(error));
      } else {
        setCityOptions([]);
      }
    }
  }, [registerData.uf, ufOptions]);

  useEffect(() => {
    if (registerData.cep.replace("-", "").length === 8) {
      axios
        .get(
          `https://viacep.com.br/ws/${registerData.cep.replace("-", "")}/json/`,
        )
        .then((res) => {
          setRegisterData((prev) => ({
            ...prev,
            address: res.data.logradouro,
            neighborhood: res.data.bairro,
            uf: res.data.uf,
            city: res.data.localidade,
          }));

          setValue("address", res.data.logradouro);
          setValue("neighborhood", res.data.bairro);
          setValue("uf", res.data.uf);
          setValue("city", res.data.localidade);
        });
    }
  }, [registerData.cep]);

  useEffect(() => {
    function submitData() {
      if (isSubmitting) {
        const sendToDB = () => {
          setToLoad();
          setToAnimateFadeIn();

          const formData = new FormData();
          formData.append("id", user._id);
          formData.append("profileImage", registerData.profileImage);
          formData.append("name", registerData.name);
          formData.append("email", registerData.email);
          formData.append("tel", registerData.tel);
          formData.append("cpf", registerData.cpf);
          formData.append("cep", registerData.cep);
          formData.append("address", registerData.address);
          formData.append("number", registerData.number);
          formData.append("neighborhood", registerData.neighborhood);
          formData.append("complement", registerData.complement);
          formData.append("uf", registerData.uf);
          formData.append("city", registerData.city);
          formData.append("reference", registerData.reference);

          api
            .put("/account/update-account", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              toast.success("Cadastro atualizado com sucesso", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });

              setUser({ ...res.data });
              setToAnimateFadeOut();

              setTimeout(() => {
                setNotToLoad();
              }, 400);
            })
            .catch((error) => {
              toast.error("Ocorreu um erro na atualização do cadastro", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });

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
      {isLoading && (
        <Loading>
          {ufOptions.length === 0 ? "Aguarde um momento" : "Enviando dados"}
        </Loading>
      )}
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
        </div>

        <div className="register__register-content__form__location-data-box">
          <label
            htmlFor="cep"
            className="register__register-content__form__location-data-box__label"
          >
            CEP
            <input
              {...register("cep")}
              type="text"
              name="cep"
              id="cep"
              value={registerData.cep}
              onChange={(event) => handleFormChange("cep", event.target.value)}
              style={errors.cep ? { border: "2px solid rgb(209, 52, 52)" } : {}}
              className="register__register-content__form__location-data-box__label__input"
            />
          </label>
          {errors.cep && <span>{errors.cep.message}</span>}

          <label
            htmlFor="address"
            className="register__register-content__form__location-data-box__label"
          >
            Endereço
            <input
              {...register("address")}
              type="text"
              name="address"
              id="address"
              value={registerData.address}
              onChange={(event) =>
                handleFormChange("address", event.target.value)
              }
              style={
                errors.address ? { border: "2px solid rgb(209, 52, 52)" } : {}
              }
              className="register__register-content__form__location-data-box__label__input"
            />
          </label>
          {errors.address && <span>{errors.address.message}</span>}

          <label
            htmlFor="addressNumber"
            className="register__register-content__form__location-data-box__label"
          >
            Número
            <input
              {...register("number")}
              type="text"
              name="number"
              id="number"
              value={registerData.number}
              onChange={(event) =>
                handleFormChange("number", event.target.value)
              }
              style={
                errors.number ? { border: "2px solid rgb(209, 52, 52)" } : {}
              }
              className="register__register-content__form__location-data-box__label__input"
            />
          </label>
          {errors.number && <span>{errors.number.message}</span>}

          <label
            htmlFor="neighborhood"
            className="register__register-content__form__location-data-box__label"
          >
            Bairro
            <input
              {...register("neighborhood")}
              type="text"
              name="neighborhood"
              id="neighborhood"
              value={registerData.neighborhood}
              onChange={(event) =>
                handleFormChange("neighborhood", event.target.value)
              }
              style={
                errors.neighborhood
                  ? { border: "2px solid rgb(209, 52, 52)" }
                  : {}
              }
              className="register__register-content__form__location-data-box__label__input"
            />
          </label>
          {errors.neighborhood && <span>{errors.neighborhood.message}</span>}

          <label
            htmlFor="complement"
            className="register__register-content__form__location-data-box__label"
          >
            Complemento
            <input
              {...register("complement")}
              type="text"
              name="complement"
              id="complement"
              value={registerData.complement}
              onChange={(event) =>
                handleFormChange("complement", event.target.value)
              }
              style={
                errors.complement
                  ? { border: "2px solid rgb(209, 52, 52)" }
                  : {}
              }
              className="register__register-content__form__location-data-box__label__input"
            />
          </label>
          {errors.complement && <span>{errors.complement.message}</span>}

          <label
            htmlFor="uf"
            className="register__register-content__form__location-data-box__label"
          >
            UF
            <select
              {...register("uf")}
              name="uf"
              id="uf"
              value={registerData.uf}
              onChange={(event) => handleFormChange("uf", event.target.value)}
              style={errors.uf ? { border: "2px solid rgb(209, 52, 52)" } : {}}
              className="register__register-content__form__location-data-box__label__select"
            >
              <option disabled>-- UF --</option>
              {ufOptions.map((data) => (
                <option key={data.id} value={data.sigla}>
                  {data.nome}
                </option>
              ))}
            </select>
          </label>
          {errors.uf && <span>{errors.uf.message}</span>}

          <label
            htmlFor="city"
            className="register__register-content__form__location-data-box__label"
          >
            Cidade
            <select
              {...register("city")}
              name="city"
              id="city"
              value={registerData.city}
              onChange={(event) => handleFormChange("city", event.target.value)}
              style={
                errors.city ? { border: "2px solid rgb(209, 52, 52)" } : {}
              }
              className="register__register-content__form__location-data-box__label__select"
            >
              <option disabled>-- Cidade --</option>
              {cityOptions.map((data) => (
                <option key={data.id} value={data.nome}>
                  {data.nome}
                </option>
              ))}
              {/* <option value="example 2">Example 2</option>
              <option value="example 3">Example 3</option> */}
            </select>
          </label>
          {errors.city && <span>{errors.city.message}</span>}

          <label
            htmlFor="reference"
            className="register__register-content__form__location-data-box__label"
          >
            Ponto de referência
            <input
              {...register("reference")}
              type="text"
              name="reference"
              id="reference"
              value={registerData.reference}
              onChange={(event) =>
                handleFormChange("reference", event.target.value)
              }
              style={
                errors.reference ? { border: "2px solid rgb(209, 52, 52)" } : {}
              }
              className="register__register-content__form__location-data-box__label__input"
            />
          </label>
          {errors.reference && <span>{errors.reference.message}</span>}
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

export default UpdateRegistrationContent;
