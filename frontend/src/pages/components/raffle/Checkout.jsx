import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";

import noUserPhoto from "../../../assets/no-user-photo.png";
import { BsCheck2Circle, BsArrowRight } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { AiOutlineInfoCircle } from "react-icons/ai";
import useUserStore from "../../../stores/useUserStore";
import useGeneralStore from "../../../stores/useGeneralStore";
import useBuyNumbersStore from "../../../stores/useBuyNumbersStore";
import api from "../../../services/api";

// TODO criar função para finalizar a compra e enviar para pagina de compra como nos prints do notion

const schema = Yup.object().shape({
  username: Yup.string()
    .min(15, "Insira acima de 15 caracteres")
    .required("Usuário é obrigatório"),
  password: Yup.string(),
});

const Checkout = () => {
  const [raffleSelected, setRaffleSelected] = useState({});
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [isUserAlreadyLogged, setUserAlreadyLogged] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { user, setUser, isUserLogged, userLogged, userNotLogged } = useUserStore();
  const { isRaffleLoading, setToRaffleLoad, setToRaffleNotLoad } = useGeneralStore();
  const { numberQuant, closePaymentModal } = useBuyNumbersStore();

  const { selected } = useParams();
  const navigate = useNavigate();

  const checkboxOverlayRef = useRef();
  const checkboxBoxRef = useRef();

  const { register, handleSubmit, formState, setValue, getValues, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { username: "" },
  });

  const { errors } = formState;

  const telValue = watch("username");

  useEffect(() => {
    console.log("isBuying: ", isBuying);
  }, [isBuying]);

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
      setUserAlreadyLogged(true);

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
      setUserAlreadyLogged(false);
    }
  }, [user]);

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
    setUserAlreadyLogged(false);
  }

  const handleTelInput = (value) => {
    const phoneNumber = value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");

    setValue("username", phoneNumber);
    return;
  };

  function convertCurrencyToNumber(value) {
    if (value) {
      const onlyDigits = value.replace(/[^\d,-]/g, "");
      const digitsFloat = onlyDigits.replace(",", ".");
      const numberValue = parseFloat(digitsFloat);

      return numberValue;
    }
  }

  function sendAdminDataToDB() {
    api
      .post("/account/login-admin", {
        tel: getValues("username"),
        password: getValues("password"),
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

        console.log(res.data);

        api
          .get("/account/is-user-logged", {
            headers: {
              "authorization-token": res.data.token,
            },
          })
          .then((res) => {
            setUser({ ...res.data });
            userLogged();
            handleFinishPaymentPage();
          })
          .catch((error) => {
            toast.error("Ocorreu um erro, tente novamente", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            })
            console.error(error);
            userNotLogged();
            localStorage.removeItem("userToken");
          });
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
        setIsBuying(false);
      });
  }

  function sendDataToDB() {
    if (isAdmin) {
      sendAdminDataToDB();
      return;
    }

    api
      .post("/account/login", {
        tel: getValues("username"),
      })
      .then((res) => {
        if (res.data.isAdmin) {
          setIsAdmin(true);
          setIsBuying(false);

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

        console.log(res.data);

        api
          .get("/account/is-user-logged", {
            headers: {
              "authorization-token": res.data.token,
            },
          })
          .then((res) => {
            setUser({ ...res.data });
            userLogged();
            setIsBuying(false);

            handleFinishPaymentPage();
          })
          .catch((error) => {
            toast.error("Ocorreu um erro, tente novamente", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            })
            console.error(error);
            userNotLogged();
            localStorage.removeItem("userToken");

            setIsBuying(false);
          });
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

        setIsBuying(false);
      });
  }

  function onSubmit(data) {
    console.log(data);
    setIsBuying(true);

    sendDataToDB();
  }

  function handleFinishPaymentPage() {
    setIsBuying(true);

    const priceNumber = convertCurrencyToNumber(raffleSelected.price);
    const data = {
      id: user._id,
      raffleId: raffleSelected._id,
      fullPrice: priceNumber * numberQuant,
      title: raffleSelected.title,
      email: user.email,
      firstName: user.name.split(" ")[0],
      lastName: user.name.split(" ").slice(1).join(" "),
      cpf: user.cpf,
    };

    api
      .post(`/payment/payment-management`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const qrCode =
          res.data.response.response.point_of_interaction.transaction_data
            .qr_code;

        api
          .post("/account/raffle-buy", {
            id: user._id,
            raffleId: raffleSelected._id,
            paymentId: res.data.response.response.id,
            pricePaid: res.data.response.response.transaction_amount,
            status: res.data.response.response.status,
            numberQuant: numberQuant,
            qrCode
          })
          .then((res) => {
            setIsBuying(false);
            setUser(res.data);
            handleClose();
            navigate(`/buyed-raffle/${raffleSelected._id}`);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);

        setIsBuying(false);

        toast.error(
          "Ocorreu um erro durante a compra, tente novamente mais tarde",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          },
        );
      });
  }

  return (
    <div ref={checkboxOverlayRef} className="checkout-overlay">
      <div ref={checkboxBoxRef} className="checkout-box">
        <div className="checkout-upper-wrapper">
          <h2 className="checkout-title">Checkout</h2>

          <button type="button" onClick={handleClose} disabled={isBuying} className="close-btn">
            <CgClose />
          </button>
        </div>

        {isUserAlreadyLogged ? (
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
              <button type="button" disabled={isRaffleLoading || isBuying} onClick={handleFinishPaymentPage} className="checkout-next-btn">Concluir reserva <BsCheck2Circle /></button>

              <button type="button" disabled={isRaffleLoading || isBuying} onClick={handleOtherAccountBtn} className="checkout-change-user-btn">Utilizar outra conta</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="checkout-content">
            <div className="checkout-info">
              <p>Você está adquirindo <strong>4</strong> unidade(s) do produto <strong>EDIÇÃO 246 - 1 TOYOTA COROLLA + 1 HONDA XRE 300</strong></p>
            </div>

            <label htmlFor="username" className="checkout-label">
              Informe seu telefone

              <input {...register("username")} type="text" id="username" name="username" onChange={(e) => handleTelInput(e.target.value)} value={telValue} className="checkout-input" />
            </label>
            {errors.username && <span>{errors.username?.message}</span>}

            {isAdmin && (
              <label htmlFor="password" className="checkout-label">
                Informe sua senha

                <input {...register("password")} type="password" id="password" name="password" className="checkout-input" />
              </label>
            )}
            {errors.password && <span>{errors.password?.message}</span>}

            <div className="checkout-message-box">
              <span className="checkout-message">
                <AiOutlineInfoCircle /> Informe seu telefone para continuar.
              </span>
            </div>

            <button type="submit" disabled={isRaffleLoading || isBuying} className="checkout-next-btn">Continuar <BsArrowRight /></button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Checkout;
