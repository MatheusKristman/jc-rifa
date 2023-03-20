import React, { useRef, useEffect } from "react";
import {
  BsCartCheck,
  BsCardList,
  BsLightningCharge,
  BsTrophy,
  BsFacebook,
  BsInstagram,
  BsWhatsapp,
  BsFillKeyFill,
} from "react-icons/bs";
import { BiHome, BiListCheck, BiBarChartAlt2 } from "react-icons/bi";
import { IoEnterOutline } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { HiOutlineMail, HiUserCircle } from "react-icons/hi";
import { RxExit } from "react-icons/rx";
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import useHeaderStore from "../../stores/useHeaderStore";
import { shallow } from "zustand/shallow";
import useUserStore from "../../stores/useUserStore";
import noUserPhoto from "../../assets/no-user-photo.png";
import _arrayBufferToBase64 from "../../hooks/useArrayBufferToBase64";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import api from "../../services/api";
import useIsUserLogged from "../../hooks/useIsUserLogged";
import AlertBox from "./AlertBox";

const HeaderMenu = () => {
  const { closeMenu, openLogin } = useHeaderStore(
    (state) => ({
      closeMenu: state.closeMenu,
      openLogin: state.openLogin,
    }),
    shallow
  );

  const menuRef = useRef(null);

  const handleCloseMenu = () => {
    menuRef.current.style.animation = "menuOut 0.4s ease forwards";

    setTimeout(() => {
      closeMenu();
    }, 400);
  };

  const handleLoginOpen = () => {
    menuRef.current.style.animation = "menuOut 0.2s ease forwards";

    setTimeout(() => {
      closeMenu();
      openLogin();
    }, 200);
  };

  return (
    <div ref={menuRef} className="header__menu">
      <div className="header__menu__above">
        <div className="header__menu__above__container">
          <div className="header__menu__above__container__logo-box">LOGO</div>

          <button type="button" onClick={handleCloseMenu} className="header__menu__above__container__close-btn">
            <IoIosCloseCircleOutline />
          </button>
        </div>
      </div>

      <div className="header__menu__middle">
        <nav className="header__menu__middle__container">
          <ul className="header__menu__middle__container__menu-list">
            <li className="header__menu__middle__container__menu-list__menu-item">
              <Link onClick={closeMenu} to="/">
                <BiHome /> Início
              </Link>
            </li>

            <li className="header__menu__middle__container__menu-list__menu-item">
              <Link onClick={closeMenu} to="/raffles">
                <BsCardList /> Sorteios
              </Link>
            </li>

            <li className="header__menu__middle__container__menu-list__menu-item">
              <Link onClick={closeMenu} to="/query-numbers">
                <BsCardList /> Meus Números
              </Link>
            </li>

            <li className="header__menu__middle__container__menu-list__menu-item">
              <Link onClick={closeMenu} to="/register">
                <IoEnterOutline /> Cadastro
              </Link>
            </li>

            <li className="header__menu__middle__container__menu-list__menu-item">
              <Link onClick={closeMenu} to="/winners">
                <BsTrophy /> Ganhadores
              </Link>
            </li>

            <li className="header__menu__middle__container__menu-list__menu-item">
              <Link onClick={closeMenu} to="/terms">
                <BiListCheck /> Termos de uso
              </Link>
            </li>

            <li className="header__menu__middle__container__menu-list__menu-item">
              <Link onClick={closeMenu} to="/contact">
                <HiOutlineMail /> Entrar em contato
              </Link>
            </li>
          </ul>

          <button type="button" onClick={handleLoginOpen} className="header__menu__middle__container__login-btn">
            <IoEnterOutline /> Entrar
          </button>
        </nav>
      </div>

      <div className="header__menu__bottom">
        <div className="header__menu__bottom__container">
          <span className="header__menu__bottom__container__desc">COMPARTILHE</span>

          <ul className="header__menu__bottom__container__socials-list">
            <li className="header__menu__bottom__container__socials-list__socials-items">
              <a href="#" className="header__menu__bottom__container__socials-list__socials-items__facebook">
                <BsFacebook />
              </a>
            </li>

            <li className="header__menu__bottom__container__socials-list__socials-items">
              <a href="#" className="header__menu__bottom__container__socials-list__socials-items__instagram">
                <BsInstagram />
              </a>
            </li>

            <li className="header__menu__bottom__container__socials-list__socials-items">
              <a href="#" className="header__menu__bottom__container__socials-list__socials-items__whatsapp">
                <BsWhatsapp />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const LogoutConfirmationBox = () => {
  const { logoutBoxAppears, setToLogoutBoxDontAppear, setToNotConfirmLogout, closeMenu } = useHeaderStore((state) => ({
    logoutBoxAppears: state.logoutBoxAppears,
    setToLogoutBoxDontAppear: state.setToLogoutBoxDontAppear,
    setToNotConfirmLogout: state.setToNotConfirmLogout,
    closeMenu: state.closeMenu,
  }));

  const { userNotLogged, setUser } = useUserStore((state) => ({
    userNotLogged: state.userNotLogged,
    setUser: state.setUser,
  }));

  const navigate = useNavigate();

  const handleCancel = () => {
    setToLogoutBoxDontAppear();

    setTimeout(() => {
      setToNotConfirmLogout();
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    userNotLogged();
    setUser({});
    setToLogoutBoxDontAppear();
    closeMenu();
    window.location.reload(false);

    setTimeout(() => {
      setToNotConfirmLogout();
      navigate("/");
    }, 1000);
  };

  return (
    <div className={logoutBoxAppears ? "logout-confirmation active" : "logout-confirmation desactive"}>
      <div className="logout-confirmation__container">
        <h6 className="logout-confirmation__container__title">Deseja sair da sua conta?</h6>

        <div className="logout-confirmation__container__btn-wrapper">
          <button onClick={handleLogout} className="logout-confirmation__container__btn-wrapper__confirm-btn">
            Sair
          </button>
          <button onClick={handleCancel} className="logout-confirmation__container__btn-wrapper__cancel-btn">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const HeaderMenuLogged = () => {
  const { closeMenu, logoutConfirmation, setToConfirmLogout, setToLogoutBoxAppear } = useHeaderStore(
    (state) => ({
      closeMenu: state.closeMenu,
      logoutConfirmation: state.logoutConfirmation,
      setToConfirmLogout: state.setToConfirmLogout,
      setToLogoutBoxAppear: state.setToLogoutBoxAppear,
    }),
    shallow
  );

  const { user } = useUserStore((state) => ({ user: state.user }));

  const menuRef = useRef(null);

  const handleCloseMenu = () => {
    menuRef.current.style.animation = "menuOut 0.4s ease forwards";

    setTimeout(() => {
      closeMenu();
    }, 400);
  };

  const openLogoutConfirmationBox = () => {
    setToConfirmLogout();
    setToLogoutBoxAppear();
  };

  return (
    <div ref={menuRef} className="header__menu">
      {logoutConfirmation && <LogoutConfirmationBox />}
      <div className="header__menu__above">
        <div className="header__menu__above__container">
          <div className="header__menu__above__container__logo-box">LOGO</div>

          <button type="button" onClick={handleCloseMenu} className="header__menu__above__container__close-btn">
            <IoIosCloseCircleOutline />
          </button>
        </div>
      </div>

      <div className="header__menu__middle">
        <nav className="header__menu__middle__container">
          <div className="header__menu__middle__container__user-box">
            <div className="header__menu__middle__container__user-box__infos">
              <div className="header__menu__middle__container__user-box__infos__image-box">
                <img
                  src={
                    user.profileImage.data
                      ? `data:${user.profileImage.contentType};base64,${_arrayBufferToBase64(user.profileImage.data.data)}`
                      : noUserPhoto
                  }
                  alt="Imagem do Perfil"
                  className="header__menu__middle__container__user-box__infos__image-box__image"
                />
              </div>
              <h4 className="header__menu__middle__container__user-box__infos__greetings">{`Olá, ${user.name}`}</h4>
            </div>

            <button
              onClick={openLogoutConfirmationBox}
              type="button"
              className="header__menu__middle__container__user-box__logout-btn"
            >
              <RxExit />
            </button>
          </div>
          <ul className="header__menu__middle__container__menu-list">
            <li className="header__menu__middle__container__menu-list__menu-item">
              <Link onClick={closeMenu} to="/">
                <BiHome /> Início
              </Link>
            </li>

            {user.admin && (
              <li className="header__menu__middle__container__menu-list__menu-item">
                <Link onClick={closeMenu} to="/raffle-management">
                  <BiBarChartAlt2 /> Rifas
                </Link>
              </li>
            )}

            <li className="header__menu__middle__container__menu-list__menu-item">
              <Link onClick={closeMenu} to="/raffles">
                <BsCardList /> Sorteios
              </Link>
            </li>

            <li className="header__menu__middle__container__menu-list__menu-item">
              <Link onClick={closeMenu} to="/query-numbers">
                <BsCardList /> Meus Números
              </Link>
            </li>

            <li className="header__menu__middle__container__menu-list__menu-item">
              <Link onClick={closeMenu} to="/updateRegistration">
                <HiUserCircle /> Atualizar cadastro
              </Link>
            </li>

            <li className="header__menu__middle__container__menu-list__menu-item">
              <Link onClick={closeMenu} to="/changePassword">
                <BsFillKeyFill /> Alterar senha
              </Link>
            </li>

            <li className="header__menu__middle__container__menu-list__menu-item">
              <Link onClick={closeMenu} to="/winners">
                <BsTrophy /> Ganhadores
              </Link>
            </li>

            <li className="header__menu__middle__container__menu-list__menu-item">
              <Link onClick={closeMenu} to="/terms">
                <BiListCheck /> Termos de uso
              </Link>
            </li>

            <li className="header__menu__middle__container__menu-list__menu-item">
              <Link onClick={closeMenu} to="/contact">
                <HiOutlineMail /> Entrar em contato
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="header__menu__bottom">
        <div className="header__menu__bottom__container">
          <span className="header__menu__bottom__container__desc">COMPARTILHE</span>

          <ul className="header__menu__bottom__container__socials-list">
            <li className="header__menu__bottom__container__socials-list__socials-items">
              <a href="#" className="header__menu__bottom__container__socials-list__socials-items__facebook">
                <BsFacebook />
              </a>
            </li>

            <li className="header__menu__bottom__container__socials-list__socials-items">
              <a href="#" className="header__menu__bottom__container__socials-list__socials-items__instagram">
                <BsInstagram />
              </a>
            </li>

            <li className="header__menu__bottom__container__socials-list__socials-items">
              <a href="#" className="header__menu__bottom__container__socials-list__socials-items__whatsapp">
                <BsWhatsapp />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const LoginMessageBox = () => {
  const { submitError, doesLoginHappened, loginMessage } = useHeaderStore((state) => ({
    submitError: state.submitError,
    doesLoginHappened: state.doesLoginHappened,
    loginMessage: state.loginMessage,
  }));

  return (
    <div
      style={submitError ? { backgroundColor: "rgb(209, 52, 52)" } : {}}
      className={doesLoginHappened || submitError ? "register-message-box" : "register-message-box desactive"}
    >
      <div className="register-message-box__container">
        <span className={"register-message-box__container__message"}>{loginMessage}</span>
      </div>
    </div>
  );
};

const LogInModal = () => {
  const {
    usernameValue,
    passwordValue,
    handleUsernameValue,
    handlePasswordValue,
    isUsernameSelected,
    selectUsername,
    unselectUsername,
    isPasswordSelected,
    selectPassword,
    unselectPassword,
    closeLogin,
    submitting,
    isSubmitting,
    errorExist,
    doesLoginHappened,
    submitError,
    loginFailed,
    notSubmitting,
    errorDontExist,
    setLoginMessage,
    loginSuccess,
    loginMessage,
  } = useHeaderStore(
    (state) => ({
      usernameValue: state.usernameValue,
      passwordValue: state.passwordValue,
      handleUsernameValue: state.handleUsernameValue,
      handlePasswordValue: state.handlePasswordValue,
      isUsernameSelected: state.isUsernameSelected,
      selectUsername: state.selectUsername,
      unselectUsername: state.unselectUsername,
      isPasswordSelected: state.isPasswordSelected,
      selectPassword: state.selectPassword,
      unselectPassword: state.unselectPassword,
      closeLogin: state.closeLogin,
      submitting: state.submitting,
      isSubmitting: state.isSubmitting,
      errorExist: state.errorExist,
      doesLoginHappened: state.doesLoginHappened,
      submitError: state.submitError,
      loginFailed: state.loginFailed,
      notSubmitting: state.notSubmitting,
      errorDontExist: state.errorDontExist,
      setLoginMessage: state.setLoginMessage,
      loginSuccess: state.loginSuccess,
      loginMessage: state.loginMessage,
    }),
    shallow
  );

  const loginModalOverlayRef = useRef(null);
  const loginModalBoxRef = useRef(null);

  const handleCloseLogin = () => {
    if (!isSubmitting) {
      loginModalOverlayRef.current.style.animation = "loginFadeOut 0.2s ease forwards";
      loginModalBoxRef.current.style.animation = "loginBoxOut 0.4s ease forwards";

      setTimeout(() => {
        closeLogin();
      }, 400);
    }
  };

  const handleCloseLoginOverlay = (e) => {
    if (e.target.classList.contains("header__login-modal-overlay") && !isSubmitting) {
      handleCloseLogin();
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

  const navigate = useNavigate();

  const schema = Yup.object().shape({
    username: Yup.string().min(15, "Insira acima de 15 caracteres").required("Usuário é obrigatório"),
    password: Yup.string().required("Senha é obrigatória"),
  });

  const { register, handleSubmit, formState, getValues, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { username: usernameValue, password: passwordValue },
  });

  const { errors } = formState;

  useEffect(() => {
    const submitData = () => {
      if (isSubmitting) {
        const sendDataToDB = () => {
          api
            .post("/login", {
              tel: usernameValue,
              password: passwordValue,
            })
            .then((res) => {
              loginSuccess();
              setLoginMessage("Conectado com sucesso");
              localStorage.setItem("userToken", res.data);
            })
            .catch((error) => {
              errorExist();
              if (error.response.data === "Telefone ou senha incorretos") {
                setLoginMessage("Telefone ou senha incorretos");
              } else {
                setLoginMessage("Ocorreu um erro, tente novamente");
              }
              console.log(error);
            });
        };

        sendDataToDB();
      }
    };

    submitData();
  }, [isSubmitting]);

  useEffect(() => {
    if (doesLoginHappened) {
      setTimeout(() => {
        loginFailed();
        notSubmitting();
        closeLogin();
        navigate("/");

        if (window.location.pathname === "/") {
          window.location.reload(false);
        }
      }, 3000);
    }

    if (submitError) {
      setTimeout(() => {
        errorDontExist();
        notSubmitting();
      }, 4000);
    }
  }, [doesLoginHappened, submitError]);

  const onSubmit = (data) => {
    submitting();
  };

  return (
    <div ref={loginModalOverlayRef} onClick={handleCloseLoginOverlay} className="header__login-modal-overlay">
      {doesLoginHappened && <AlertBox success={doesLoginHappened} error={submitError} message={loginMessage} />}
      {submitError && <AlertBox success={doesLoginHappened} error={submitError} message={loginMessage} />}
      <div ref={loginModalBoxRef} className="header__login-modal-overlay__box">
        <div className="header__login-modal-overlay__box__content">
          <div className="header__login-modal-overlay__box__content__head">
            <h3 className="header__login-modal-overlay__box__content__head__title">Login</h3>

            <button
              type="button"
              className="header__login-modal-overlay__box__content__head__close-btn"
              onClick={handleCloseLogin}
            >
              <MdClose />
            </button>
          </div>

          <p className="header__login-modal-overlay__box__content__desc">Por favor, entre com seus dados ou faça um cadastro.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="header__login-modal-overlay__box__content__form">
            <div className="header__login-modal-overlay__box__content__form__username-box">
              <label
                htmlFor="username"
                className={
                  isUsernameSelected
                    ? "header__login-modal-overlay__box__content__form__username-box__label input-selected"
                    : "header__login-modal-overlay__box__content__form__username-box__label"
                }
              >
                Telefone
              </label>
              <input
                {...register("username")}
                type="text"
                name="username"
                id="username"
                value={usernameValue}
                onChange={(e) => {
                  handleUsernameValue(handleTelChange(e));
                  setValue("username", handleTelChange(e));
                }}
                onFocus={selectUsername}
                onBlur={() => (usernameValue === "" ? unselectUsername() : selectUsername())}
                autoComplete="off"
                autoCorrect="off"
                style={errors.username ? { borderColor: "rgb(209, 52, 52)" } : {}}
                className="header__login-modal-overlay__box__content__form__username-box__input"
              />
            </div>
            {errors.username && <span>{errors.username.message}</span>}

            <div className="header__login-modal-overlay__box__content__form__password-box">
              <label
                htmlFor="password"
                className={
                  isPasswordSelected
                    ? "header__login-modal-overlay__box__content__form__password-box__label input-selected"
                    : "header__login-modal-overlay__box__content__form__password-box__label"
                }
              >
                Senha
              </label>

              <input
                {...register("password")}
                type="password"
                name="password"
                id="password"
                value={passwordValue}
                onChange={(e) => {
                  handlePasswordValue(e);
                  setValue("password", e.target.value);
                }}
                onFocus={selectPassword}
                onBlur={() => (passwordValue === "" ? unselectPassword() : selectPassword())}
                autoComplete="off"
                autoCorrect="off"
                style={errors.password ? { borderColor: "rgb(209, 52, 52)" } : {}}
                className="header__login-modal-overlay__box__content__form__password-box__input"
              />
            </div>
            {errors.password && <span>{errors.password.message}</span>}

            <Link
              to="/request-new-password"
              onClick={closeLogin}
              className="header__login-modal-overlay__box__content__form__forget-password"
            >
              Esqueci minha senha
            </Link>

            <button
              type="submit"
              className={
                isSubmitting
                  ? "header__login-modal-overlay__box__content__form__submit-btn-sending"
                  : "header__login-modal-overlay__box__content__form__submit-btn"
              }
            >
              {isSubmitting ? "Enviando..." : "Continuar"}
            </button>

            <Link to="/register" className="header__login-modal-overlay__box__content__form__register-btn">
              Criar conta
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const { isLoginModalOpen, isMenuOpen, openMenu } = useHeaderStore(
    (state) => ({
      isLoginModalOpen: state.isLoginModalOpen,
      isMenuOpen: state.isMenuOpen,
      openMenu: state.openMenu,
    }),
    shallow
  );

  const { isUserLogged } = useUserStore((state) => ({
    isUserLogged: state.isUserLogged,
  }));

  const navigate = useNavigate();

  const navigateToQueryNumbersPage = () => {
    navigate("/query-numbers");
  };

  useEffect(() => {
    if (isMenuOpen || isLoginModalOpen) {
      document.documentElement.style.overflowY = "hidden";
    } else {
      document.documentElement.style.overflowY = "unset";
    }
  }, [isMenuOpen, isLoginModalOpen]);

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__container__logo-box">
          <Link to="/">LOGO</Link>
        </div>

        <div className="header__container__menu-box">
          <button type="button" onClick={navigateToQueryNumbersPage} className="header__container__menu-box__cart-btn">
            <BsCartCheck />
          </button>
          <button onClick={openMenu} type="button" className="header__container__menu-box__menu-btn">
            <HiOutlineBars3BottomRight />
          </button>
        </div>
      </div>
      {isMenuOpen && !isUserLogged && <HeaderMenu />}
      {isLoginModalOpen && <LogInModal />}
      {isMenuOpen && isUserLogged && <HeaderMenuLogged />}
    </header>
  );
};

export default Header;
