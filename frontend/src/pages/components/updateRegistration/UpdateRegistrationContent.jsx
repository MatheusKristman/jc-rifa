import React, { useEffect, useLayoutEffect } from "react";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import _arrayBufferToBase64 from "../../../hooks/useArrayBufferToBase64";
import { toast } from "react-toastify";

import noUserPhoto from "../../../assets/no-user-photo.png";
import useRegisterStore from "../../../stores/useRegisterStore";
import useUserStore from "../../../stores/useUserStore";
import useIsUserLogged from "../../../hooks/useIsUserLogged";
import useGeneralStore from "../../../stores/useGeneralStore";
import Loading from "../Loading";

// TODO adicionar função de mudar a senha

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
  const {
    profileImage,
    setProfileImage,
    name,
    setName,
    setNameFromFetch,
    cpf,
    setCpfFromFetch,
    email,
    setEmail,
    setEmailFromFetch,
    tel,
    setTel,
    setTelFromFetch,
    cep,
    setCepFromFetch,
    address,
    setAddress,
    setAddressFromFetch,
    number,
    setNumber,
    setNumberFromFetch,
    neighborhood,
    setNeighborhood,
    setNeighborhoodFromFetch,
    complement,
    setComplement,
    setComplementFromFetch,
    uf,
    setUf,
    setUfFromFetch,
    city,
    setCity,
    setCityFromFetch,
    reference,
    setReference,
    setReferenceFromFetch,
    isSubmitting,
    submitting,
    notSubmitting,
    isRegisterCompleted,
    registerComplete,
    registerNotComplete,
    errorSubmitting,
    errorExist,
    errorDontExist,
    setRegisterMessage,
    ufOptions,
    setUfOptions,
    cityOptions,
    setCityOptions,
    actualProfilePhoto,
    setActualProfilePhoto,
  } = useRegisterStore(
    (state) => ({
      profileImage: state.profileImage,
      setProfileImage: state.setProfileImage,
      name: state.name,
      setName: state.setName,
      setNameFromFetch: state.setNameFromFetch,
      cpf: state.cpf,
      setCpfFromFetch: state.setCpfFromFetch,
      email: state.email,
      setEmail: state.setEmail,
      setEmailFromFetch: state.setEmailFromFetch,
      tel: state.tel,
      setTel: state.setTel,
      setTelFromFetch: state.setTelFromFetch,
      cep: state.cep,
      setCepFromFetch: state.setCepFromFetch,
      address: state.address,
      setAddress: state.setAddress,
      setAddressFromFetch: state.setAddressFromFetch,
      number: state.number,
      setNumber: state.setNumber,
      setNumberFromFetch: state.setNumberFromFetch,
      neighborhood: state.neighborhood,
      setNeighborhood: state.setNeighborhood,
      setNeighborhoodFromFetch: state.setNeighborhoodFromFetch,
      complement: state.complement,
      setComplement: state.setComplement,
      setComplementFromFetch: state.setComplementFromFetch,
      uf: state.uf,
      setUf: state.setUf,
      setUfFromFetch: state.setUfFromFetch,
      city: state.city,
      setCity: state.setCity,
      setCityFromFetch: state.setCityFromFetch,
      reference: state.reference,
      setReference: state.setReference,
      setReferenceFromFetch: state.setReferenceFromFetch,
      isSubmitting: state.isSubmitting,
      submitting: state.submitting,
      notSubmitting: state.notSubmitting,
      isRegisterCompleted: state.isRegisterCompleted,
      registerComplete: state.registerComplete,
      registerNotComplete: state.registerNotComplete,
      errorSubmitting: state.errorSubmitting,
      errorExist: state.errorExist,
      errorDontExist: state.errorDontExist,
      setRegisterMessage: state.setRegisterMessage,
      ufOptions: state.ufOptions,
      setUfOptions: state.setUfOptions,
      cityOptions: state.cityOptions,
      setCityOptions: state.setCityOptions,
      actualProfilePhoto: state.actualProfilePhoto,
      setActualProfilePhoto: state.setActualProfilePhoto,
    }),
    shallow,
  );

  const { user, isUserLogged, setUser } = useUserStore((state) => ({
    user: state.user,
    isUserLogged: state.isUserLogged,
    setUser: state.setUser,
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

  const navigate = useNavigate();

  useIsUserLogged("/updateRegistration");

  const handleFileChange = async (e) => {
    const file = await e.target.files[0];

    if (!file) {
      return;
    }

    if (file && file.type.startsWith("image/")) {
      setActualProfilePhoto(URL.createObjectURL(file));
      setProfileImage(file);
    } else {
      toast.error("O arquivo selecionado não é uma imagem válida", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const handleTelChange = (e) => {
    const { value } = e.target;

    const phoneNumber = value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");

    return phoneNumber;
  };

  const handleCpfChange = (e) => {
    const { value } = e.target;

    const cpf = value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");

    return cpf;
  };

  const handleCepChange = (e) => {
    const { value } = e.target;

    const cep = value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");

    return cep;
  };

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  const onSubmit = (data) => {
    submitting();
  };

  useLayoutEffect(() => {
    const fetchingUserData = () => {
      if (isUserLogged) {
        setProfileImage(null);

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

        setNameFromFetch(user.name);
        setValue("name", user.name);

        setEmailFromFetch(user.email);
        setValue("email", user.email);

        setTelFromFetch(user.tel);
        setValue("tel", user.tel);

        setCpfFromFetch(user.cpf);
        setValue("cpf", user.cpf);

        if (user.hasOwnProperty("cep")) {
          setCepFromFetch(user.cep);
          setValue("cep", user.cep);
        }

        if (user.hasOwnProperty("address")) {
          setAddressFromFetch(user.address);
          setValue("address", user.address);
        }

        if (user.hasOwnProperty("number")) {
          setNumberFromFetch(user.number);
          setValue("number", user.number);
        }

        if (user.hasOwnProperty("neighborhood")) {
          setNeighborhoodFromFetch(user.neighborhood);
          setValue("neighborhood", user.neighborhood);
        }

        if (user.hasOwnProperty("complement")) {
          setComplementFromFetch(user.complement);
          setValue("complement", user.complement);
        }

        if (user.hasOwnProperty("uf")) {
          setUfFromFetch(user.uf);
          setValue("uf", user.uf);
        }

        if (user.hasOwnProperty("city")) {
          setCityFromFetch(user.city);
          setValue("city", user.city);
        }

        if (user.hasOwnProperty("reference")) {
          setReferenceFromFetch(user.reference);
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
    const ufSelected = ufOptions.filter((option) => option.sigla === uf);

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
  }, [uf]);

  useEffect(() => {
    if (cep.replace("-", "").length === 8) {
      console.log(cep.length);
      axios
        .get(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`)
        .then((res) => {
          setAddressFromFetch(res.data.logradouro);
          setValue("address", res.data.logradouro);

          setNeighborhoodFromFetch(res.data.bairro);
          setValue("neighborhood", res.data.bairro);

          setUfFromFetch(res.data.uf);
          setValue("uf", res.data.uf);

          setCityFromFetch(res.data.localidade);
          setValue("city", res.data.localidade);
        });
    }
  }, [cep]);

  useEffect(() => {
    function submitData() {
      if (isSubmitting) {
        const sendToDB = () => {
          setToLoad();
          setToAnimateFadeIn();

          const formData = new FormData();
          formData.append("id", user._id);
          formData.append("profileImage", profileImage);
          formData.append("name", name);
          formData.append("email", email);
          formData.append("tel", tel);
          formData.append("cpf", cpf);
          formData.append("cep", cep);
          formData.append("address", address);
          formData.append("number", number);
          formData.append("neighborhood", neighborhood);
          formData.append("complement", complement);
          formData.append("uf", uf);
          formData.append("city", city);
          formData.append("reference", reference);

          api
            .put("/account/update-account", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              registerComplete();
              setRegisterMessage("Cadastro atualizado com sucesso");
              setUser({ ...res.data });

              setToAnimateFadeOut();

              setTimeout(() => {
                setNotToLoad();
              }, 400);
            })
            .catch((error) => {
              if (error) {
                setRegisterMessage(
                  "Ocorreu um erro na atualização do cadastro",
                );
              }
              errorExist();
              console.log(error);

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
    if (isRegisterCompleted) {
      setTimeout(() => {
        registerNotComplete();
        notSubmitting();
        navigate("/");
      }, 3000);
    }

    if (errorSubmitting) {
      setTimeout(() => {
        errorDontExist();
        notSubmitting();
      }, 4000);
    }
  }, [isRegisterCompleted, errorSubmitting]);

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
              value={name}
              onChange={setName}
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
              value={email}
              onChange={setEmail}
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
              value={tel}
              onChange={(e) => setTel(handleTelChange(e))}
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
              value={cpf}
              onChange={(e) => setCpfFromFetch(handleCpfChange(e))}
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
              value={cep}
              onChange={(e) => setCepFromFetch(handleCepChange(e))}
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
              value={address}
              onChange={setAddress}
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
              value={number}
              onChange={setNumber}
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
              value={neighborhood}
              onChange={setNeighborhood}
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
              value={complement}
              onChange={setComplement}
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
              value={uf}
              onChange={setUf}
              style={errors.uf ? { border: "2px solid rgb(209, 52, 52)" } : {}}
              className="register__register-content__form__location-data-box__label__select"
            >
              <option>-- UF --</option>
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
              value={city}
              onChange={setCity}
              style={
                errors.city ? { border: "2px solid rgb(209, 52, 52)" } : {}
              }
              className="register__register-content__form__location-data-box__label__select"
            >
              <option value="example">-- Cidade --</option>
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
              value={reference}
              onChange={setReference}
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
          className="register__register-content__form__save-btn"
        >
          Salvar
        </button>
      </form>
    </div>
  );
};

export default UpdateRegistrationContent;
