import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock2, CheckCheck, CheckCircle, XCircle } from "lucide-react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useTimer } from "react-timer-hook";

import defaultPrize from "../../../assets/default-prize.jpg";
import api from "../../../services/api";
import useUserStore from "../../../stores/useUserStore";

const BuyedRaffleContent = () => {
  const [now, setNow] = useState(new Date(Date.UTC()).getTime());
  const [time, setTime] = useState(new Date(new Date().getTime() + 10 * 60 * 1000).getTime());
  const [percentage, setPercentage] = useState("0%");
  const [paymentStatus, setPaymentStatus] = useState("pending"); // default value is defined on get function from mercado pago api
  const [raffleSelected, setRaffleSelected] = useState("")
  const [raffleSelectedImageUrl, setRaffleSelectedImageUrl] = useState("");
  const [pixCode, setPixCode] = useState("");
  const [numbersQuant, setNumbersQuant] = useState("");
  const [isPixCopied, setPixCopied] = useState(false);
  const [buyDate, setBuyDate] = useState("");
  const [buyTime, setBuyTime] = useState("");
  const [rafflePrice, setRafflePrice] = useState("");
  const [numbersBuyed, setNumbersBuyed] = useState([]);

  const { user } = useUserStore();

  const { id } = useParams();

  const {
    seconds,
    minutes
  } = useTimer({ expiryTimestamp: time, autoStart: true });

  useEffect(() => {
    api
      .post("/account/get-payment", { id: user._id, raffleId: id })
      .then((res) => {
        console.log(res.data);
        setPixCode(res.data.qrCode);
        setNumbersQuant(res.data.numberQuant);
        setNumbersBuyed(res.data.numbersBuyed);

        console.log("expires in: ", res.data.createdAt);

        const createdAt = new Date(res.data.createdAt);
        // const expiresIn = createdAt.getTime() + 10 * 60 * 1000;
        const expiresIn = createdAt.getTime() + 10 * 60 * 1000;
        const day = createdAt.getUTCDate();
        const month = createdAt.getUTCMonth() + 1;
        const year = createdAt.getUTCFullYear();

        const hour = createdAt.getUTCHours();
        const minute = createdAt.getUTCMinutes();

        console.log(expiresIn - new Date().getTime());
        // TODO testar com momentjs

        setBuyDate(`${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`);
        setBuyTime(`${hour}h${minute}`);
        setTime(expiresIn);
      })
      .catch((error) => console.error(error));

    api
      .get(`raffle/get-raffle-selected/${id}`)
      .then((res) => {
        setRaffleSelected(res.data)
        setRafflePrice(res.data.price)

        if (res.data.raffleImage) {
          if (
            JSON.stringify(import.meta.env.MODE) ===
            JSON.stringify("development")
          ) {
            setRaffleSelectedImageUrl(
              `${import.meta.env.VITE_API_KEY_DEV}${import.meta.env.VITE_API_PORT
              }/raffle-uploads/${res.data.raffleImage}`,
            );
          } else {
            setRaffleSelectedImageUrl(
              `${import.meta.env.VITE_API_KEY}/raffle-uploads/${res.data.raffleImage
              }`,
            );
          }
        } else {
          setRaffleSelectedImageUrl(null);
        }
      })
      .catch((error) => console.error(error));
  }, [id]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    function calculatePercentage() {
      const diff = time - now;
      const miliseconds = 10 * 60 * 1000;

      console.log(time);
      console.log(now);

      if (diff <= 0) {
        setPercentage("100%");
        clearInterval(timerId);
      } else {
        const ratio = 100 - (Math.max(0, Math.min(diff / miliseconds * 100, 100)));

        setPercentage(ratio.toFixed(2) + "%");
        setNow(new Date().getTime());
      }

      console.log(percentage);
    }

    const timerId = setInterval(calculatePercentage, 1000);


    return () => {
      clearInterval(timerId);
    }
  }, [time, now, setNow, setPercentage]);

  function formatTimer(number) {
    return number.toString().padStart(2, "0");
  }

  function handleCopyPix() {
    navigator.clipboard.writeText(pixCode);

    setPixCopied(true);

    setTimeout(() => {
      setPixCopied(false);
    }, 3000);
  }

  return (
    <div className="buyed-raffle-container">
      <div className="buyed-raffle-status-wrapper">
        {paymentStatus == "pending" || paymentStatus == "in_process" || paymentStatus == "in_mediation" ? (
          <>
            <Clock2 color="#eccb27" size={50} strokeWidth={1} />

            <div className="status-info-wrapper">
              <h2 className="status-title">Aguardando Pagamento!</h2>
              <span className="status-desc">Finalize a compra</span>
            </div>
          </>) : null}

        {paymentStatus == "approved" ? (
          <>
            <CheckCircle color="#7DDD5A" size={50} strokeWidth={1} />

            <div className="status-info-wrapper">
              <h2 className="status-title">Pagamento confirmado!</h2>
              <span className="status-desc">Aguarde o sorteio</span>
            </div>
          </>
        ) : null}

        {paymentStatus == "rejected" || paymentStatus == "cancelled" || paymentStatus == "refunded" || paymentStatus == "charged_back" ? (
          <>
            <XCircle color="#D13434" size={50} strokeWidth={1} />

            <div className="status-info-wrapper">
              <h2 className="status-title">Pagamento Cancelado!</h2>
              <span className="status-desc">Realize uma nova solicitação</span>
            </div>
          </>
        ) : null}
      </div>

      <div className="buyed-raffle-box">
        <div className="payment-expiration-wrapper">
          <span className="payment-expiration-timer">Você tem <strong>{formatTimer(minutes)}:{formatTimer(seconds)}</strong> para pagar</span>

          <div className="payment-expiration-progress-bar-container">
            <div style={{ width: percentage }} className="payment-expiration-progress-bar" />
          </div>
        </div>

        <div className="payment-steps-wrapper">
          <div className="payment-steps-box">
            <div className="payment-steps-info-wrapper">

              <p className="step-desc">
                <span className="step">1</span> Copie o código PIX abaixo.
              </p>
            </div>

            <div className="payment-steps-input-wrapper">
              <input type="text" readOnly name="pix-code" autoComplete="off" autoCorrect="off" value={pixCode} className="payment-steps-input" />

              <button type="button" onClick={handleCopyPix} className="payment-steps-copy-btn">{isPixCopied ? "Copiado" : "Copiar"}</button>
            </div>
          </div>

          <div className="payment-steps-box">
            <div className="payment-steps-info-wrapper">
              <p className="step-desc">
                <span className="step">2</span> Abra o app do seu banco e escolha a opção PIX, como se fosse fazer uma transferencia.
              </p>
            </div>
          </div>

          <div className="payment-steps-box">
            <div className="payment-steps-info-wrapper">
              <p className="step-desc">
                <span className="step">3</span> Selecione a opção PIX copia e cola, cole a chave copiada e confirme o pagamento.
              </p>
            </div>
          </div>

          <div className="payment-tip-box">
            <p className="payment-tip-info">
              Este pagamento só pode ser realizado dentro do tempo, após este periodo, caso o pagamento não for confirmado os números voltam a ficar disponíveis.
            </p>
          </div>

          <button type="button" className="payment-confirm-btn">
            <CheckCheck />

            Já fiz o pagamento
          </button>
        </div>

        <div className="payment-qr-code-wrapper">
          <div className="payment-qr-code-box">
            <QRCodeSVG value={pixCode} />
          </div>

          <h2 className="payment-qr-code-title">QR Code</h2>

          <p className="payment-qr-code-desc">Acesse o APP do seu banco e escolha a opção com QR Code, escaneie o código ao lado e confirme o pagamento.</p>
        </div>
      </div>

      <div className="payment-information-wrapper">
        <div className="payment-information-box">
          <span className="payment-information-text">
            <AiOutlineInfoCircle />
            Após o pagamento aguarde até 5 minutos para a confirmação, caso já tenha efetuado o pagamento, clique no botão <strong>Já fiz o pagamento</strong>.
          </span>
        </div>
      </div>

      <div className="details-wrapper">
        <div className="details-raffle-box">
          <div className="details-raffle-image-box">
            <img src={raffleSelectedImageUrl ? raffleSelectedImageUrl : defaultPrize} alt="Rifa" className="details-raffle-image" />
          </div>

          <div className="details-raffle-info">
            <h2 className="details-raffle-title">{raffleSelected?.title}</h2>

            <span className="details-raffle-desc">{raffleSelected?.description?.substring(0, 50) + "..."}</span>

            <span className="details-raffle-quant">
              Quantidade de números comprados: <strong>{numbersQuant}</strong>
            </span>
          </div>
        </div>

        <div className="payment-details-box">
          <h3 className="payment-details-title">
            <AiOutlineInfoCircle />

            Detalhes da sua compra
          </h3>

          <ul className="payment-details-infos">
            <li className="payment-details-info">
              <strong>Comprador:</strong> {user?.name}
            </li>

            <li className="payment-details-info">
              <strong>CPF:</strong> {user?.cpf?.split(".")[0]}.***.***-**
            </li>

            <li className="payment-details-info">
              <strong>Telefone:</strong> {user?.tel?.substring(0, 5)}*****-****
            </li>

            <li className="payment-details-info">
              <strong>Data/Hora:</strong> {buyDate} ás {buyTime}
            </li>

            <li className="payment-details-info">
              <strong>Situação:</strong> {paymentStatus == "pending" || paymentStatus == "in_process" || paymentStatus == "in_mediation" ? "Aguardando pagamento" : paymentStatus == "rejected" || paymentStatus == "cancelled" || paymentStatus == "refunded" || paymentStatus == "charged_back" ? "Pedido cancelado" : paymentStatus == "approved" ? "Pagamento confirmado" : null}
            </li>

            <li className="payment-details-info">
              <strong>Total:</strong> {rafflePrice}
            </li>

            <li className="payment-details-info">
              <strong>Números:</strong> {paymentStatus == "pending" || paymentStatus == "in_process" || paymentStatus == "in_mediation" ? "Os números serão liberados após o pagamento." : paymentStatus == "rejected" || paymentStatus == "cancelled" || paymentStatus == "refunded" || paymentStatus == "charged_back" ? "Pedido cancelado" : paymentStatus == "approved" ? numbersBuyed.join(", ") : null}
            </li>
          </ul>
        </div>
      </div>

      <span className="payment-support-desc">
        Problemas com sua compra? <Link to="/contact">Clique aqui</Link>.
      </span>
    </div>
  );
}

export default BuyedRaffleContent;
