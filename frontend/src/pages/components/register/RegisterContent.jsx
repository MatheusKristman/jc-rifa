import React, { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import noUserPhoto from '../../../assets/no-user-photo.png';
import useRegisterStore from '../../../stores/useRegisterStore';
import useUserStore from '../../../stores/useUserStore';
import useIsUserLogged from '../../../hooks/useIsUserLogged';
import useGeneralStore from '../../../stores/useGeneralStore';
import Loading from '../Loading';
import useHeaderStore from '../../../stores/useHeaderStore';

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
        tel,
        setTelFromFetch,
        confirmTel,
        setConfirmTelFromFetch,
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
            tel: state.tel,
            setTelFromFetch: state.setTelFromFetch,
            confirmTel: state.confirmTel,
            setConfirmTelFromFetch: state.setConfirmTelFromFetch,
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
        }),
        shallow
    );

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
        shallow
    );

    const { user } = useUserStore((state) => ({
        user: state.user,
    }));

    const navigate = useNavigate();

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
                    formData.append(
                        'profileImage',
                        profileImage.file ? profileImage.file : noUserPhoto
                    );
                    formData.append('name', name);
                    formData.append('cpf', cpf);
                    formData.append('email', email);
                    formData.append('tel', tel);

                    api.post('/register/registerAccount', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                        .then((res) => {
                            registerComplete();
                            setRegisterMessage(
                                'Cadastro realizado com sucesso'
                            );
                            localStorage.setItem('userToken', res.data);

                            setToAnimateFadeOut();

                            setTimeout(() => {
                                setNotToLoad();
                            }, 400);
                        })
                        .catch((error) => {
                            window.scrollTo(0, 0);
                            if (
                                error.response.data === 'Telefone Já cadastrado'
                            ) {
                                setRegisterMessage(
                                    'Cadastro já registrado no sistema'
                                );
                            } else {
                                setRegisterMessage(
                                    'Ocorreu um erro no cadastro'
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
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');

        return phoneNumber;
    };

    const handleCpfChange = (e) => {
        const { value } = e.target;

        const cpf = value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');

        return cpf;
    };

    const schema = Yup.object().shape({
        profileImage: Yup.mixed(),
        name: Yup.string()
            .min(6, 'Insira acima de 6 caracteres')
            .max(50, 'Insira abaixo de 50 caracteres')
            .required('Nome é obrigatório'),
        cpf: Yup.string()
            .min(6, 'Insira acima de 6 caracteres')
            .max(50, 'Insira abaixo de 50 caracteres')
            .required('CPF é obrigatório'),
        email: Yup.string()
            .email('Email inválido')
            .required('Email é obrigatório'),
        tel: Yup.string()
            .min(14, 'Insira o telefone corretamente')
            .required('Telefone é obrigatório'),
        confirmTel: Yup.string()
            .oneOf([Yup.ref('tel'), null], 'Os telefones devem ser iguais')
            .required('Confirme seu telefone'),
    });

    const { register, handleSubmit, formState } = useForm({
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
        <div className='register__register-content'>
            {isLoading && <Loading>Enviando dados</Loading>}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='register__register-content__form'
            >
                <label
                    htmlFor='profileImage'
                    className='register__register-content__form__image-label'
                >
                    <div className='register__register-content__form__image-label__image-box'>
                        <img
                            src={
                                profileImage.url
                                    ? profileImage.url
                                    : noUserPhoto
                            }
                            alt='Perfil'
                            className='register__register-content__form__image-label__image-box__image'
                        />
                    </div>

                    <input
                        {...register('profileImage')}
                        type='file'
                        name='profileImage'
                        id='profileImage'
                        onChange={handleFileChange}
                        className='register__register-content__form__image-label__input'
                    />
                </label>

                <div
                    style={user.length > 0 ? { display: 'none' } : {}}
                    className='register__register-content__form__profile-data-box'
                >
                    <label
                        htmlFor='name'
                        className='register__register-content__form__profile-data-box__label'
                    >
                        Nome Completo
                        <input
                            {...register('name')}
                            type='text'
                            autoCorrect='off'
                            autoComplete='off'
                            name='name'
                            id='name'
                            value={name}
                            onChange={setName}
                            style={
                                errors.name
                                    ? { border: '2px solid rgb(209, 52, 52)' }
                                    : {}
                            }
                            className='register__register-content__form__profile-data-box__label__input'
                        />
                    </label>
                    {errors.name && <span>{errors.name.message}</span>}

                    <label
                        htmlFor='cpf'
                        className='register__register-content__form__profile-data-box__label'
                    >
                        CPF
                        <input
                            {...register('cpf')}
                            type='text'
                            autoCorrect='off'
                            autoComplete='off'
                            name='cpf'
                            id='cpf'
                            value={cpf}
                            onChange={(e) =>
                                setCpfFromFetch(handleCpfChange(e))
                            }
                            style={
                                errors.cpf
                                    ? { border: '2px solid rgb(209, 52, 52)' }
                                    : {}
                            }
                            className='register__register-content__form__profile-data-box__label__input'
                        />
                    </label>
                    {errors.cpf && <span>{errors.cpf.message}</span>}

                    <label
                        htmlFor='email'
                        className='register__register-content__form__profile-data-box__label'
                    >
                        E-mail
                        <input
                            {...register('email')}
                            type='text'
                            autoCorrect='off'
                            autoComplete='off'
                            name='email'
                            id='email'
                            value={email}
                            onChange={setEmail}
                            style={
                                errors.email
                                    ? { border: '2px solid rgb(209, 52, 52)' }
                                    : {}
                            }
                            className='register__register-content__form__profile-data-box__label__input'
                        />
                    </label>
                    {errors.email && <span>{errors.email.message}</span>}

                    <label
                        htmlFor='tel'
                        className='register__register-content__form__profile-data-box__label'
                    >
                        Telefone
                        <input
                            {...register('tel')}
                            type='text'
                            autoCorrect='off'
                            autoComplete='off'
                            name='tel'
                            id='tel'
                            value={tel}
                            onChange={(e) =>
                                setTelFromFetch(handleTelChange(e))
                            }
                            placeholder='(__) _____-____'
                            style={
                                errors.tel
                                    ? { border: '2px solid rgb(209, 52, 52)' }
                                    : {}
                            }
                            className='register__register-content__form__profile-data-box__label__input'
                        />
                    </label>
                    {errors.tel && <span>{errors.tel.message}</span>}

                    <label
                        htmlFor='telConfirm'
                        className='register__register-content__form__profile-data-box__label'
                    >
                        Confirmar telefone
                        <input
                            {...register('confirmTel')}
                            type='text'
                            autoCorrect='off'
                            autoComplete='off'
                            name='confirmTel'
                            id='confirmTel'
                            value={confirmTel}
                            onChange={(e) =>
                                setConfirmTelFromFetch(handleTelChange(e))
                            }
                            placeholder='(__) _____-____'
                            style={
                                errors.confirmTel
                                    ? { border: '2px solid rgb(209, 52, 52)' }
                                    : {}
                            }
                            className='register__register-content__form__profile-data-box__label__input'
                        />
                    </label>
                    {errors.confirmTel && (
                        <span>{errors.confirmTel.message}</span>
                    )}
                </div>

                <button
                    type='submit'
                    className='register__register-content__form__save-btn'
                >
                    Salvar
                </button>
            </form>
        </div>
    );
};

export default RegisterContent;
