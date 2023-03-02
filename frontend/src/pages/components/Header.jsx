import React, { useRef, useEffect } from "react";
import {
  BsCartCheck,
  BsCardList,
  BsLightningCharge,
  BsTrophy,
  BsFacebook,
  BsInstagram,
  BsWhatsapp,
} from "react-icons/bs";
import { BiHome, BiListCheck } from "react-icons/bi";
import { IoEnterOutline } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import useHeaderStore from "../../stores/useHeaderStore";
import { shallow } from "zustand/shallow";
import { useNavigate } from 'react-router-dom';

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
    menuRef.current.style.animation = 'menuOut 0.4s ease forwards';

    setTimeout(() => {
      closeMenu();
    }, 400);
  }

  const handleLoginOpen = () => {
    menuRef.current.style.animation = 'menuOut 0.2s ease forwards';

    setTimeout(() => {
      closeMenu();
      openLogin();
    }, 200)
  }

  return (
    <div ref={menuRef} className="header__menu">
      <div className="header__menu__above">
        <div className="header__menu__above__container">
          <div className="header__menu__above__container__logo-box">
            LOGO
          </div>

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
              <Link onClick={closeMenu} to="/add-credits">
                <BsLightningCharge /> Adicionar créditos
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
              <a
                href="#"
                className="header__menu__bottom__container__socials-list__socials-items__facebook"
              >
                <BsFacebook />
              </a>
            </li>

            <li className="header__menu__bottom__container__socials-list__socials-items">
              <a
                href="#"
                className="header__menu__bottom__container__socials-list__socials-items__instagram"
              >
                <BsInstagram />
              </a>
            </li>

            <li className="header__menu__bottom__container__socials-list__socials-items">
              <a
                href="#"
                className="header__menu__bottom__container__socials-list__socials-items__whatsapp"
              >
                <BsWhatsapp />
              </a>
            </li>
          </ul>
        </div>
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
    }),
    shallow
  );

  const loginModalOverlayRef = useRef(null);
  const loginModalBoxRef = useRef(null);

  const handleCloseLogin = () => {
    loginModalOverlayRef.current.style.animation = 'loginFadeOut 0.2s ease forwards';
    loginModalBoxRef.current.style.animation = 'loginBoxOut 0.4s ease forwards';

    setTimeout(() => {
      closeLogin();
    }, 400);
  }

  const handleCloseLoginOverlay = (e) => {
    if (e.target.classList.contains('header__login-modal-overlay')) {
      handleCloseLogin();
    }
  }

  return (
    <div ref={loginModalOverlayRef} onClick={handleCloseLoginOverlay} className="header__login-modal-overlay">
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

          <p className="header__login-modal-overlay__box__content__desc">
            Por favor, entre com seus dados ou faça um cadastro.
          </p>

          <form className="header__login-modal-overlay__box__content__form">
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
                type="tel"
                name="username"
                id="username"
                value={usernameValue}
                onChange={handleUsernameValue}
                onFocus={selectUsername}
                onBlur={() => (usernameValue === "" ? unselectUsername() : selectUsername())}
                autoComplete="off"
                autoCorrect="off"
                className="header__login-modal-overlay__box__content__form__username-box__input"
              />
            </div>

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
                type="password"
                name="password"
                id="password"
                value={passwordValue}
                onChange={handlePasswordValue}
                onFocus={selectPassword}
                onBlur={() => (passwordValue === "" ? unselectPassword() : selectPassword())}
                autoComplete="off"
                autoCorrect="off"
                className="header__login-modal-overlay__box__content__form__password-box__input"
              />
            </div>

            <Link
              to="/new-password"
              className="header__login-modal-overlay__box__content__form__forget-password"
            >
              Esqueci minha senha
            </Link>

            <button
              type="submit"
              className="header__login-modal-overlay__box__content__form__submit-btn"
            >
              Continuar
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
    shallow
  );

  const navigate = useNavigate();

  const navigateToQueryNumbersPage = () => {
    navigate('/query-numbers');
  }

  useEffect(() => {
    if (isMenuOpen || isLoginModalOpen) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'unset';
    }
  }, [isMenuOpen, isLoginModalOpen]);

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__container__logo-box">
          <Link to='/'>
            LOGO
          </Link>
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
      {isMenuOpen && <HeaderMenu /> }
      {isLoginModalOpen && <LogInModal />}
    </header>
  );
};

export default Header;
