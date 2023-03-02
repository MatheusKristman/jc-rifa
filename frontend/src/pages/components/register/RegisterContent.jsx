import React, { useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import api from '../../../services/api';


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
    setCpf,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    tel,
    setTel,
    confirmTel,
    setConfirmTel,
    cep,
    setCep,
    address,
    setAddress,
    number,
    setNumber,
    neighborhood,
    setNeighborhood,
    complement,
    setComplement,
    uf,
    setUf,
    city,
    setCity,
    reference,
    setReference,
    isSubmitting,
    submitting,
    notSubmitting,
    isRegisterCompleted,
    registerComplete,
    registerNotComplete,
  } = useRegisterStore(
    (state) => ({
      profileImage: state.profileImage,
      setProfileImage: state.setProfileImage,
      name: state.name,
      setName: state.setName,
      cpf: state.cpf,
      setCpf: state.setCpf,
      email: state.email,
      setEmail: state.setEmail,
      password: state.password,
      setPassword: state.setPassword,
      confirmPassword: state.confirmPassword,
      setConfirmPassword: state.setConfirmPassword,
      tel: state.tel,
      setTel: state.setTel,
      confirmTel: state.confirmTel,
      setConfirmTel: state.setConfirmTel,
      cep: state.cep,
      setCep: state.setCep,
      address: state.address,
      setAddress: state.setAddress,
      number: state.number,
      setNumber: state.setNumber,
      neighborhood: state.neighborhood,
      setNeighborhood: state.setNeighborhood,
      complement: state.complement,
      setComplement: state.setComplement,
      uf: state.uf,
      setUf: state.setUf,
      city: state.city,
      setCity: state.setCity,
      reference: state.reference,
      setReference: state.setReference,
      isSubmitting: state.isSubmitting,
      submitting: state.submitting,
      notSubmitting: state.notSubmitting,
      isRegisterCompleted: state.isRegisterCompleted,
      registerComplete: state.registerComplete,
      registerNotComplete: state.registerNotComplete,
    }),
    shallow
  );

  const { user, isUserLogged } = useUserStore((state) => ({
    user: state.user,
    isUserLogged: state.isUserLogged,
  }));

  const nameRef = useRef(null);
  const cpfRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const telRef = useRef(null);
  const confirmTelRef = useRef(null);
  const cepRef = useRef(null);
  const addressRef = useRef(null);
  const numberRef = useRef(null);
  const neighborhoodRef = useRef(null);
  const complementRef = useRef(null);
  const ufRef = useRef(null);
  const cityRef = useRef(null);
  const referenceRef = useRef(null);

  useEffect(() => {
    console.log(isUserLogged);
    if (isUserLogged) {
      console.log(user)
      if (user.profileImage.data) {

          setProfileImage({
            file: URL.createObjectURL(new Blob([user.profileImage.data.data])),
            url: URL.createObjectURL(new Blob([user.profileImage.data.data])),
          });

        console.log(profileImage);
      }
      
    }
  }, [user])

  useEffect(() => {
    function sendDataToDB() {      
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
              localStorage.setItem('userToken', res.data);
            })
            .catch((error) => console.log(error));
        };
        sendToDB();

        setTimeout(() => {
          registerNotComplete();
          notSubmitting();
        }, 4000);
      }
    }

    sendDataToDB();
  }, [isSubmitting]);

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

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    // defaultValues: useRegisterStore.getState(),
  });
  const { errors } = formState;

  const onSubmit = (data) => {
    console.log(name)
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
              onChange={(e) => setCpf(handleCpfChange(e))}
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
              onChange={(e) => setTel(handleTelChange(e))}
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
              onChange={(e) => setConfirmTel(handleTelChange(e))}
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
              onChange={(e) => setCep(handleCepChange(e))}
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
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraiba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
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
              <option value="example">Example</option>
              <option value="example 2">Example 2</option>
              <option value="example 3">Example 3</option>
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
