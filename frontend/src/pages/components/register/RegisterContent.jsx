import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


import noUserPhoto from "../../../assets/no-user-photo.png";
import useRegisterStore from "../../../stores/useRegisterStore";
import useUserStore from "../../../stores/useUserStore";
import useIsUserLogged from "../../../hooks/useIsUserLogged";

const RegisterContent = () => {
  const {
    profileImage,
    setProfileImage,
    name,
    setName,
    cpf,
    setCpfFromFetch,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    tel,
    setTelFromFetch,
    confirmTel,
    setConfirmTelFromFetch,
    cep,
    setCepFromFetch,
    address,
    setAddress,
    setAddressFromFetch,
    number,
    setNumber,
    neighborhood,
    setNeighborhood,
    setNeighborhoodFromFetch,
    complement,
    setComplement,
    uf,
    setUf,
    setUfFromFetch,
    city,
    setCity,
    setCityFromFetch,
    reference,
    setReference,
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
  } = useRegisterStore(
    (state) => ({
      profileImage: state.profileImage,
      setProfileImage: state.setProfileImage,
      name: state.name,
      setName: state.setName,
      cpf: state.cpf,
      setCpfFromFetch: state.setCpfFromFetch,
      email: state.email,
      setEmail: state.setEmail,
      password: state.password,
      setPassword: state.setPassword,
      confirmPassword: state.confirmPassword,
      setConfirmPassword: state.setConfirmPassword,
      tel: state.tel,
      setTelFromFetch: state.setTelFromFetch,
      confirmTel: state.confirmTel,
      setConfirmTelFromFetch: state.setConfirmTelFromFetch,
      cep: state.cep,
      setCepFromFetch: state.setCepFromFetch,
      address: state.address,
      setAddress: state.setAddress,
      setAddressFromFetch: state.setAddressFromFetch,
      number: state.number,
      setNumber: state.setNumber,
      neighborhood: state.neighborhood,
      setNeighborhood: state.setNeighborhood,
      setNeighborhoodFromFetch: state.setNeighborhoodFromFetch,
      complement: state.complement,
      setComplement: state.setComplement,
      uf: state.uf,
      setUf: state.setUf,
      setUfFromFetch: state.setUfFromFetch,
      city: state.city,
      setCity: state.setCity,
      setCityFromFetch: state.setCityFromFetch,
      reference: state.reference,
      setReference: state.setReference,
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
    }),
    shallow
  );

  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const navigate = useNavigate();  

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/')
    .then((res) => {
      setUfOptions(res.data);
    })
    .catch((error) => console.error(error));

  }, []);
  
  useEffect(() => {
    const ufSelected = ufOptions.filter((option) => option.sigla === uf);

    if (ufSelected.length > 0) {
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelected[0].id}/municipios`)
      .then((res) => setCityOptions(res.data))
      .catch((error) => console.error(error));
    } else {
      setCityOptions([]);
    }

  }, [uf]);

  useEffect(() => {
    if (cep.replace('-', '').length === 8) {
      axios.get(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`)
      .then(res => {
        setAddressFromFetch(res.data.logradouro);
        setValue('address', res.data.logradouro);

        setNeighborhoodFromFetch(res.data.bairro);
        setValue('neighborhood', res.data.bairro);

        setUfFromFetch(res.data.uf);
        setValue('uf', res.data.uf);

        setCityFromFetch(res.data.localidade);
        setValue('city', res.data.localidade);
      });
    }
  }, [cep]);

  useEffect(() => {
    function submitData() {      
      console.log('enviando')
      if (isSubmitting) {
        const sendToDB = () => {
          const formData = new FormData();
          formData.append('profileImage', profileImage.file ? profileImage.file : noUserPhoto);
          formData.append('name', name);
          formData.append('cpf', cpf);
          formData.append('email', email);
          formData.append('password', password);
          formData.append('tel', tel);
          formData.append('cep', cep);
          formData.append('address', address);
          formData.append('number', number);
          formData.append('neighborhood', neighborhood);
          formData.append('complement', complement);
          formData.append('uf', uf);
          formData.append('city', city);
          formData.append('reference', reference);

          api
            .post("/register/registerAccount", formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              }
            })
            .then((res) => {
              registerComplete();
              setRegisterMessage('Cadastro realizado com sucesso');
              localStorage.setItem('userToken', res.data);
            })
            .catch((error) => {              
              window.scrollTo(0, 0);              
              if (error.response.data === 'Telefone Já cadastrado') {
                console.log('ja registrado')
                setRegisterMessage('Cadastro já registrado no sistema')
              } else {
                setRegisterMessage('Ocorreu um erro no cadastro');
              }
              errorExist();
              console.log(error);
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
        navigate('/');
      }, 3000);
    }

    if (errorSubmitting) {
      setTimeout(() => {        
        errorDontExist();
        notSubmitting();
      }, 4000);
    }
  }, [isRegisterCompleted, errorSubmitting]);

  useIsUserLogged('/register');

  const handleFileChange = async (e) => {
    const file = await e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        setProfileImage({
          file,
          url: reader.result,
        });
      };
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
    password: Yup.string().required("Senha é obrigatória"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "As senhas devem ser iguais")
      .required("Confirme sua senha"),
    tel: Yup.string().min(14, "Insira o telefone corretamente").required("Telefone é obrigatório"),
    confirmTel: Yup.string()
      .oneOf([Yup.ref("tel"), null], "Os telefones devem ser iguais")
      .required("Confirme seu telefone"),
    cep: Yup.string().required("Cep é obrigatório"),
    address: Yup.string().required("Endereço é obrigatório"),
    number: Yup.string().required("Número é obrigatório"),
    neighborhood: Yup.string().required("Bairro é obrigatório"),
    complement: Yup.string(),
    uf: Yup.string().required("UF é obrigatório"),
    city: Yup.string().required("Cidade é obrigatória"),
    reference: Yup.string(),
  });

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  const onSubmit = (data) => {
    console.log(data);
    if (!profileImage.file) {
      setProfileImage({
        file: null,
        url: noUserPhoto,
      });
    }

    submitting();
  };

  return (
    <div className="register__register-content">
      <form onSubmit={handleSubmit(onSubmit)} className="register__register-content__form">
        <label htmlFor="profileImage" className="register__register-content__form__image-label">
          <div className="register__register-content__form__image-label__image-box">
            <img
              src={profileImage.url ? profileImage.url : noUserPhoto}
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

        <div style={user.length > 0 ? { display: 'none' } : {}} className="register__register-content__form__profile-data-box">
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
              style={errors.name ? { border: "2px solid rgb(209, 52, 52)" } : {}}
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
              value={cpf}
              onChange={(e) => setCpfFromFetch(handleCpfChange(e))}
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
              value={email}
              onChange={setEmail}
              style={errors.email ? { border: "2px solid rgb(209, 52, 52)" } : {}}
              className="register__register-content__form__profile-data-box__label__input"
            />
          </label>
          {errors.email && <span>{errors.email.message}</span>}

          <label
            htmlFor="password"
            className="register__register-content__form__profile-data-box__label"
          >
            Senha
            <input
              {...register("password")}
              type="password"
              autoCorrect="off"
              autoComplete="off"
              name="password"
              id="password"
              value={password}
              onChange={setPassword}
              style={errors.password ? { border: "2px solid rgb(209, 52, 52)" } : {}}
              className="register__register-content__form__profile-data-box__label__input"
            />
          </label>
          {errors.password && <span>{errors.password.message}</span>}

          <label
            htmlFor="passwordConfirm"
            className="register__register-content__form__profile-data-box__label"
          >
            Repita a senha
            <input
              {...register("confirmPassword")}
              type="password"
              autoCorrect="off"
              autoComplete="off"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={setConfirmPassword}
              style={errors.confirmPassword ? { border: "2px solid rgb(209, 52, 52)" } : {}}
              className="register__register-content__form__profile-data-box__label__input"
            />
          </label>
          {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

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
              onChange={(e) => setTelFromFetch(handleTelChange(e))}
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
              value={confirmTel}
              onChange={(e) => setConfirmTelFromFetch(handleTelChange(e))}
              placeholder="(__) _____-____"
              style={errors.confirmTel ? { border: "2px solid rgb(209, 52, 52)" } : {}}
              className="register__register-content__form__profile-data-box__label__input"
            />
          </label>
          {errors.confirmTel && <span>{errors.confirmTel.message}</span>}
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
              style={errors.address ? { border: "2px solid rgb(209, 52, 52)" } : {}}
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
              style={errors.number ? { border: "2px solid rgb(209, 52, 52)" } : {}}
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
              style={errors.neighborhood ? { border: "2px solid rgb(209, 52, 52)" } : {}}
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
              style={errors.complement ? { border: "2px solid rgb(209, 52, 52)" } : {}}
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
              {
                ufOptions.map((data) => (
                  <option key={data.id} value={data.sigla}>{data.nome}</option>
                ))
              }
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
              style={errors.city ? { border: "2px solid rgb(209, 52, 52)" } : {}}
              className="register__register-content__form__location-data-box__label__select"
            >
              <option value="example">-- Cidade --</option>
              {
                cityOptions.map((data) => (
                  <option key={data.id} value={data.nome}>{data.nome}</option>
                ))
              }              
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
              style={errors.reference ? { border: "2px solid rgb(209, 52, 52)" } : {}}
              className="register__register-content__form__location-data-box__label__input"
            />
          </label>
          {errors.reference && <span>{errors.reference.message}</span>}
        </div>

        <button type="submit" className="register__register-content__form__save-btn">
          Salvar
        </button>
      </form>
    </div>
  );
};

export default RegisterContent;
