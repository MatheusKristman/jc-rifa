import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";

import noUserPhoto from "../../../assets/no-user-photo.png";
import { BsCheck2Circle, BsArrowRight } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { AiOutlineInfoCircle } from "react-icons/ai";
import useUserStore from "../../../stores/useUserStore";
import useGeneralStore from "../../../stores/useGeneralStore";
import useBuyNumbersStore from "../../../stores/useBuyNumbersStore";
import api from "../../../services/api";

// TODO criar função para finalizar a compra e enviar para pagina de compra como nos prints do notion

const Checkout = () => {
  const [raffleSelected, setRaffleSelected] = useState({});
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [userLogged, setUserLogged] = useState(false);

  const { user, isUserLogged } = useUserStore();
  const { isRaffleLoading, setToRaffleLoad, setToRaffleNotLoad } = useGeneralStore();
  const { numberQuant, closePaymentModal } = useBuyNumbersStore();

  const { selected } = useParams();

  const checkboxOverlayRef = useRef();
  const checkboxBoxRef = useRef();

  function handleClose() {
    checkboxOverlayRef.current.style.animation =
      "paymentFadeOut 0.2s ease forwards";
    checkboxBoxRef.current.style.animation =
      "paymentModalOut 0.4s ease forwards";

    setTimeout(() => {
      closePaymentModal();
    }, 400);
  };

  function handleOtherAccountBtn() {
    setUserLogged(false);
  }

  useEffect(() => {
    if (!raffleSelected.hasOwnProperty("_id")) {
      setToRaffleLoad();

      api
        .get(`/raffle/get-raffle-selected/${selected}`)
        .then((res) => setRaffleSelected(res.data))
        .catch((error) => console.error(error))
        .finally(() => setToRaffleNotLoad())
    }
  }, [raffleSelected, setRaffleSelected]);

  useEffect(() => {
    if (isUserLogged) {
      setUserLogged(true);

      if (user.profileImage) {
        if (
          JSON.stringify(import.meta.env.MODE) ===
          JSON.stringify("development")
        ) {
          setProfilePhotoUrl(
            `${import.meta.env.VITE_API_KEY_DEV}${import.meta.env.VITE_API_PORT
            }/user-uploads/${user.profileImage}`,
          );
        } else {
          setProfilePhotoUrl(
            `${import.meta.env.VITE_API_KEY}/user-uploads/${user.profileImage
            }`,
          );
        }
      } else {
        setProfilePhotoUrl(null);
      }
    } else {
      setUserLogged(false);
    }
  }, [user]);

  return (
    <div ref={checkboxOverlayRef} className="checkout-overlay">
      <div ref={checkboxBoxRef} className="checkout-box">
        <div className="checkout-upper-wrapper">
          <h2 className="checkout-title">Checkout</h2>

          <button type="button" onClick={handleClose} className="close-btn">
            <CgClose />
          </button>
        </div>

        {userLogged ? (
          <div className="checkout-content-logged">
            <div className="checkout-info">
              <p>Você está adquirindo <strong>{numberQuant}</strong> numero(s) da rifa <strong>{raffleSelected?.title}</strong></p>
            </div>

            <div className="checkout-user-box">
              <div className="checkout-user-profile-photo">
                <img src={profilePhotoUrl ? profilePhotoUrl : noUserPhoto} alt="No User Photo" className="checkout-image" />
              </div>

              <div className="checkout-user-infos">
                <h2 className="checkout-user-name">{user.name}</h2>

                <span className="checkout-user-tel">{user.tel}</span>
              </div>
            </div>

            <p className="checkout-terms-description">Ao realizar este pagamento e confirmar minha compra desse título de capitalização, declaro ter lido e concordado com os <Link to="/terms">termos</Link> desta anexados na pagina do sorteio.</p>

            <div className="checkout-btn-wrapper">
              <button type="button" disabled={isRaffleLoading} className="checkout-next-btn">Concluir reserva <BsCheck2Circle /></button>

              <button type="button" disabled={isRaffleLoading} onClick={handleOtherAccountBtn} className="checkout-change-user-btn">Utilizar outra conta</button>
            </div>
          </div>
        ) : (
          <div className="checkout-content">
            <div className="checkout-info">
              <p>Você está adquirindo <strong>4</strong> unidade(s) do produto <strong>EDIÇÃO 246 - 1 TOYOTA COROLLA + 1 HONDA XRE 300</strong></p>
            </div>

            <label htmlFor="tel" className="checkout-label">
              Informe seu telefone

              <input type="text" id="tel" name="tel" className="checkout-input" />
            </label>

            <div className="checkout-message-box">
              <span className="checkout-message">
                <AiOutlineInfoCircle /> Informe seu telefone para continuar.
              </span>
            </div>

            <button type="button" disabled={isRaffleLoading} className="checkout-next-btn">Continuar <BsArrowRight /></button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
