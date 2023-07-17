import React, { useRef, useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { BsArrowRight } from 'react-icons/bs';

import FaqsQuestion from '../FaqsQuestion';
import useHomeFaqStore from '../../../stores/useHomeFaqStore';
import useRaffleStore from '../../../stores/useRaffleStore';
import useGeneralStore from '../../../stores/useGeneralStore';
import api from '../../../services/api';

const ContactContent = () => {
    const [contactData, setContactData] = useState({
        name: '',
        raffle: '',
        subject: '',
        message: '',
    });
    const [error, setError] = useState({
        name: '',
        raffle: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setSubmit] = useState(false);
    const {
        isFaqOpen1,
        isFaqOpen2,
        isFaqOpen3,
        openFaq1,
        openFaq2,
        openFaq3,
        closeFaq1,
        closeFaq2,
        closeFaq3,
    } = useHomeFaqStore(
        (state) => ({
            isFaqOpen1: state.isFaqOpen1,
            isFaqOpen2: state.isFaqOpen2,
            isFaqOpen3: state.isFaqOpen3,
            openFaq1: state.openFaq1,
            openFaq2: state.openFaq2,
            openFaq3: state.openFaq3,
            closeFaq1: state.closeFaq1,
            closeFaq2: state.closeFaq2,
            closeFaq3: state.closeFaq3,
        }),
        shallow
    );
    const { raffles, setRaffles } = useRaffleStore((state) => ({
        raffles: state.raffles,
        setRaffles: state.setRaffles,
    }));
    const { setToLoad, setNotToLoad } = useGeneralStore((state) => ({
        setToLoad: state.setToLoad,
        setNotToLoad: state.setNotToLoad,
    }));

    const faq1Ref = useRef();
    const faq2Ref = useRef();
    const faq3Ref = useRef();

    const handleContactChange = (option, value) => {
        setContactData((prev) => ({ ...prev, [option]: value }));
    };

    const handleError = (option, message) => {
        setError((prev) => ({ ...prev, [option]: message }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (contactData.name.length <= 3) {
            handleError('name', 'Nome precisa ter mais de 3 caracteres');
        } else {
            handleError('name', '');
        }

        if (contactData.name === '') {
            handleError('name', 'Nome é obrigatório');
        } else {
            handleError('name', '');
        }

        if (contactData.raffle === '') {
            handleError('raffle', 'Rifa é obriagória');
        } else {
            handleError('raffle', '');
        }

        if (contactData.subject === '') {
            handleError('subject', 'Assunto é obrigatório');
        } else {
            handleError('subject', '');
        }

        if (contactData.message.length <= 20) {
            handleError('message', 'Mensagem precisa ter mais de 20 caracteres');
        } else {
            handleError('message', '');
        }

        if (contactData.message === '') {
            handleError('message', 'Mensagem é obrigatória');
        } else {
            handleError('message', '');
        }

        if (
            contactData.name.length > 3 &&
            contactData.raffle !== '' &&
            contactData.subject !== '' &&
            contactData.message.length > 20
        ) {
            setError({
                name: '',
                raffle: '',
                subject: '',
                message: '',
            });
            setSubmit(true);
        }
    };

    useEffect(() => {
        const handleRaffleFetch = () => {
            setToLoad();
            api.get('/get-raffles')
                .then((res) => {
                    setRaffles(res.data);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setNotToLoad();
                });
        };

        handleRaffleFetch();
    }, []);

    useEffect(() => {
        const sendMessage = () => {
            const message = `${encodeURIComponent(
                `Nome: ${contactData.name};`
            )}%0a${encodeURIComponent(`Sorteio: ${contactData.raffle};`)}%0a${encodeURIComponent(
                `Assunto: ${contactData.subject};`
            )}%0a${encodeURIComponent(`Mensagem: ${contactData.message}`)},`;

            setSubmit(false);
            window.location.assign(`${import.meta.env.VITE_WHATSAPP_BASE_API}${message}`);
        };

        if (isSubmitting) {
            sendMessage();
        }
    }, [isSubmitting]);

    useEffect(() => {
        console.log(contactData);
    }, [contactData]);

    return (
        <div className="contact__contact-content">
            <div className="contact__contact-content__container">
                <div className="contact__contact-content__container__contact-title-wrapper">
                    <h1 className="contact__contact-content__container__contact-title-wrapper__title">
                        ✉️ Contato
                    </h1>

                    <span className="contact__contact-content__container__contact-title-wrapper__desc">
                        Tire suas dúvidas.
                    </span>
                </div>

                <form className="contact__contact-content__container__form">
                    <div className="contact__contact-content__container__form__inputs-wrapper">
                        <label
                            htmlFor="name"
                            className="contact__contact-content__container__form__inputs-wrapper__label"
                        >
                            Nome
                            <input
                                type="text"
                                name="name"
                                id="name"
                                autoComplete="off"
                                autoCorrect="off"
                                value={contactData.name}
                                onChange={(event) =>
                                    handleContactChange('name', event.target.value)
                                }
                                style={error.name ? { border: '2px solid rgb(209, 52, 52)' } : {}}
                                className="contact__contact-content__container__form__inputs-wrapper__label__input"
                            />
                            {error.name && (
                                <span className="contact-error-message">{error.name}</span>
                            )}
                        </label>

                        <label
                            htmlFor="raffle"
                            className="contact__contact-content__container__form__inputs-wrapper__label"
                        >
                            Sorteio
                            <select
                                name="raffle"
                                id="raffle"
                                value={contactData.raffle}
                                onChange={(event) =>
                                    handleContactChange('raffle', event.target.value)
                                }
                                style={error.raffle ? { border: '2px solid rgb(209, 52, 52)' } : {}}
                                className="contact__contact-content__container__form__inputs-wrapper__label__select"
                            >
                                <option disabled value="">
                                    Deseja falar sobre um sorteio?
                                </option>{' '}
                                {raffles.map((raffle) => (
                                    <option key={raffle._id} value={raffle.title}>
                                        {raffle.title}
                                    </option>
                                ))}
                                {/* value com o id do sorteio em um array */}
                            </select>
                            {error.raffle && (
                                <span className="contact-error-message">{error.raffle}</span>
                            )}
                        </label>

                        <label
                            htmlFor="subject"
                            className="contact__contact-content__container__form__inputs-wrapper__label"
                        >
                            Assunto
                            <select
                                name="subject"
                                id="subject"
                                value={contactData.subject}
                                onChange={(event) =>
                                    handleContactChange('subject', event.target.value)
                                }
                                style={
                                    error.subject ? { border: '2px solid rgb(209, 52, 52)' } : {}
                                }
                                className="contact__contact-content__container__form__inputs-wrapper__label__select"
                            >
                                <option value="Outro(s)">{'Outro(s)'}</option>
                                <option value="Dúvidas">{'Dúvidas'}</option>
                                <option value="Pagamentos">{'Pagamentos'}</option>
                            </select>
                            {error.subject && (
                                <span className="contact-error-message">{error.subject}</span>
                            )}
                        </label>

                        <label
                            htmlFor="message"
                            className="contact__contact-content__container__form__inputs-wrapper__label"
                        >
                            Mensagem
                            <textarea
                                name="message"
                                id="message"
                                minLength={20}
                                value={contactData.message}
                                onChange={(event) =>
                                    handleContactChange('message', event.target.value)
                                }
                                style={
                                    error.message ? { border: '2px solid rgb(209, 52, 52)' } : {}
                                }
                                className="contact__contact-content__container__form__inputs-wrapper__label__textarea"
                            />
                            <span className="contact__contact-content__container__form__inputs-wrapper__label__tip">
                                Mínimo de 20 caractéres
                            </span>
                            {error.message && (
                                <span className="contact-error-message">{error.message}</span>
                            )}
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="contact__contact-content__container__form__submit-btn"
                        onClick={handleSubmit}
                    >
                        Enviar <BsArrowRight />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactContent;
