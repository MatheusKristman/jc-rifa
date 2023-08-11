import React, { useRef, useEffect, useState } from "react";
import {
  BsCartCheck,
  BsCardList,
  BsTrophy,
  BsFacebook,
  BsInstagram,
  BsWhatsapp,
} from "react-icons/bs";
import { BiHome, BiListCheck, BiBarChartAlt2 } from "react-icons/bi";
import { IoEnterOutline } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { HiOutlineMail, HiUserCircle } from "react-icons/hi";
import { RxExit } from "react-icons/rx";
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";

import useHeaderStore from "../../stores/useHeaderStore";
import useUserStore from "../../stores/useUserStore";
import noUserPhoto from "../../assets/no-user-photo.png";
import logo from "../../assets/logo.svg";
import api from "../../services/api";

const schema = Yup.object().shape({
  username: Yup.string()
    .min(15, "Insira acima de 15 caracteres")
    .required("Usuário é obrigatório"),
  password: Yup.string(),
});

const HeaderMenu = () => {
  const { closeMenu, openLogin } = useHeaderStore(
    (state) => ({
      closeMenu: state.closeMenu,
      openLogin: state.openLogin,
    }),
    shallow,
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
          <div className="header__menu__above__container__logo-box">
            <img
              src={logo}
              alt="jc-rifa"
              className="header__menu__above__container__logo-box__logo"
            />
          </div>

          <button
            type="button"
            onClick={handleCloseMenu}
            className="header__menu__above__container__close-btn"
          >
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

          <button
            type="button"
            onClick={handleLoginOpen}
            className="header__menu__middle__container__login-btn"
          >
            <IoEnterOutline /> Entrar
          </button>
        </nav>
      </div>
    </div>
  );
};

const LogoutConfirmationBox = () => {
  const {
    logoutBoxAppears,
    setToLogoutBoxDontAppear,
    setToNotConfirmLogout,
    closeMenu,
  } = useHeaderStore(
    (state) => ({
      logoutBoxAppears: state.logoutBoxAppears,
      setToLogoutBoxDontAppear: state.setToLogoutBoxDontAppear,
      setToNotConfirmLogout: state.setToNotConfirmLogout,
      closeMenu: state.closeMenu,
    }),
    shallow,
  );

  const { userNotLogged, setUser } = useUserStore(
    (state) => ({
      userNotLogged: state.userNotLogged,
      setUser: state.setUser,
    }),
    shallow,
  );

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
    <div
      className={
        logoutBoxAppears
          ? "logout-confirmation active"
          : "logout-confirmation desactive"
      }
    >
      <div className="logout-confirmation__container">
        <h6 className="logout-confirmation__container__title">
          Deseja sair da sua conta?
        </h6>

        <div className="logout-confirmation__container__btn-wrapper">
          <button
            onClick={handleLogout}
            className="logout-confirmation__container__btn-wrapper__confirm-btn"
          >
            Sair
          </button>
          <button
            onClick={handleCancel}
            className="logout-confirmation__container__btn-wrapper__cancel-btn"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const HeaderMenuLogged = () => {
  const {
    closeMenu,
    logoutConfirmation,
    setToConfirmLogout,
    setToLogoutBoxAppear,
  } = useHeaderStore(
    (state) => ({
      closeMenu: state.closeMenu,
      logoutConfirmation: state.logoutConfirmation,
      setToConfirmLogout: state.setToConfirmLogout,
      setToLogoutBoxAppear: state.setToLogoutBoxAppear,
    }),
    shallow,
  );

  const [profileImageUrl, setProfileImageUrl] = useState("");

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

  useEffect(() => {
    if (user.profileImage) {
      if (
        JSON.stringify(import.meta.env.MODE) === JSON.stringify("development")
      ) {
        setProfileImageUrl(
          `${import.meta.env.VITE_API_KEY_DEV}${
            import.meta.env.VITE_API_PORT
          }/user-uploads/${user.profileImage}`,
        );
      } else {
        setProfileImageUrl(
          `${import.meta.env.VITE_API_KEY}/user-uploads/${user.profileImage}`,
        );
      }
    } else {
      setProfileImageUrl(null);
    }
  }, []);

  return (
    <div ref={menuRef} className="header__menu">
      {logoutConfirmation && <LogoutConfirmationBox />}
      <div className="header__menu__above">
        <div className="header__menu__above__container">
          <div className="header__menu__above__container__logo-box">
            <img
              src={logo}
              alt="jc-rifa"
              className="header__menu__above__container__logo-box__logo"
            />
          </div>

          <button
            type="button"
            onClick={handleCloseMenu}
            className="header__menu__above__container__close-btn"
          >
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
                  src={profileImageUrl ? profileImageUrl : noUserPhoto}
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
    </div>
  );
};

const LogInModal = () => {
  const { closeLogin } = useHeaderStore(
    (state) => ({
      closeLogin: state.closeLogin,
    }),
    shallow,
  );

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [isUsernameSelected, setIsUsernameSelected] = useState(false);
  const [isPasswordSelected, setIsPasswordSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { username: loginData.username },
  });

  const { errors } = formState;

  useEffect(() => {
    setIsAdmin(false);
  }, []);

  const loginModalOverlayRef = useRef(null);
  const loginModalBoxRef = useRef(null);

  const navigate = useNavigate();

  const handleFormChange = (option, value) => {
    if (option === "username") {
      const phoneNumber = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");

      setLoginData((prev) => ({ ...prev, username: phoneNumber }));

      return;
    }

    setLoginData((prev) => ({ ...prev, [option]: value }));
  };

  const handleTelChange = (event) => {
    const { value } = event.target;

    const phoneNumber = value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");

    return phoneNumber;
  };

  const handleCloseLogin = () => {
    if (!isSubmitting) {
      loginModalOverlayRef.current.style.animation =
        "loginFadeOut 0.2s ease forwards";
      loginModalBoxRef.current.style.animation =
        "loginBoxOut 0.4s ease forwards";

      setTimeout(() => {
        closeLogin();
      }, 400);
    }
  };

  const handleCloseLoginOverlay = (e) => {
    if (
      e.target.classList.contains("header__login-modal-overlay") &&
      !isSubmitting
    ) {
      handleCloseLogin();
    }
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);
  };

  useEffect(() => {
    const submitData = () => {
      if (isSubmitting) {
        const sendAdminDataToDB = () => {
          api
            .post("/account/login-admin", {
              tel: loginData.username,
              password: loginData.password,
            })
            .then((res) => {
              toast.success("Conectado com sucesso", {
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

              closeLogin();
              navigate("/");

              if (window.location.pathname === "/") {
                window.location.reload(false);
              }
            })
            .catch((error) => {
              toast.error("Usuário incorreto", {
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
            })
            .finally(() => {
              setIsSubmitting(false);
            });
        };

        const sendDataToDB = () => {
          if (isAdmin) {
            sendAdminDataToDB();
            return;
          }

          api
            .post("/account/login", {
              tel: loginData.username,
            })
            .then((res) => {
              if (res.data.isAdmin) {
                setIsAdmin(true);
                setIsSubmitting(false);

                return;
              }

              toast.success("Conectado com sucesso", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });

              localStorage.setItem("userToken", res.data.token);

              closeLogin();
              navigate("/");

              if (window.location.pathname === "/") {
                window.location.reload(false);
              }
            })
            .catch((error) => {
              toast.error("Usuário incorreto", {
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

              setIsSubmitting(false);
            });
        };

        sendDataToDB();
      }
    };

    submitData();
  }, [isSubmitting]);

  return (
    <div
      ref={loginModalOverlayRef}
      onClick={handleCloseLoginOverlay}
      className="header__login-modal-overlay"
    >
      <div ref={loginModalBoxRef} className="header__login-modal-overlay__box">
        <div className="header__login-modal-overlay__box__content">
          <div className="header__login-modal-overlay__box__content__head">
            <h3 className="header__login-modal-overlay__box__content__head__title">
              Login
            </h3>

            <button
              type="button"
              className="header__login-modal-overlay__box__content__head__close-btn"
              onClick={handleCloseLogin}
            >
              <MdClose />
            </button>
          </div>

          <p className="header__login-modal-overlay__box__content__desc">
            Por favor, entre com seus dados ou faça um cadastro.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="header__login-modal-overlay__box__content__form"
          >
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
                value={loginData.username}
                onChange={(e) => {
                  handleFormChange("username", e.target.value);
                  setValue("username", handleTelChange(e));
                }}
                onFocus={() => setIsUsernameSelected(true)}
                onBlur={() =>
                  loginData.username === ""
                    ? setIsUsernameSelected(false)
                    : setIsUsernameSelected(true)
                }
                autoComplete="off"
                autoCorrect="off"
                style={
                  errors.username ? { borderColor: "rgb(209, 52, 52)" } : {}
                }
                className="header__login-modal-overlay__box__content__form__username-box__input"
              />
            </div>
            {errors.username && <span>{errors.username.message}</span>}

            {isAdmin && (
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
                  value={loginData.password}
                  onChange={(e) => {
                    handleFormChange("password", e.target.value);
                    setValue("password", e.target.value);
                  }}
                  onFocus={() => setIsPasswordSelected(true)}
                  onBlur={() =>
                    loginData.password === ""
                      ? setIsPasswordSelected(false)
                      : setIsPasswordSelected(true)
                  }
                  autoComplete="off"
                  autoCorrect="off"
                  style={
                    errors.password
                      ? {
                          borderColor: "rgb(209, 52, 52)",
                        }
                      : {}
                  }
                  className="header__login-modal-overlay__box__content__form__password-box__input"
                />
              </div>
            )}
            {errors.password && <span>{errors.password.message}</span>}

            <button
              type="submit"
              disabled={isSubmitting}
              className={
                isSubmitting
                  ? "header__login-modal-overlay__box__content__form__submit-btn-sending"
                  : "header__login-modal-overlay__box__content__form__submit-btn"
              }
            >
              {isSubmitting ? "Enviando..." : "Continuar"}
            </button>

            <Link
              to="/register"
              className="header__login-modal-overlay__box__content__form__register-btn"
            >
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
    shallow,
  );

  const { isUserLogged } = useUserStore(
    (state) => ({
      isUserLogged: state.isUserLogged,
    }),
    shallow,
  );

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
          <Link to="/">
            <img
              src={logo}
              alt="jc-rifa"
              className="header__container__logo-box__logo"
            />
          </Link>
        </div>

        <div className="header__container__menu-box">
          <button
            type="button"
            onClick={navigateToQueryNumbersPage}
            className="header__container__menu-box__cart-btn"
          >
            <BsCartCheck />
          </button>
          <button
            onClick={openMenu}
            type="button"
            className="header__container__menu-box__menu-btn"
          >
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
