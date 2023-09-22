import { Clock2, CheckCheck, CheckCircle, XCircle } from "lucide-react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

import defaultPrize from "../../../assets/default-prize.jpg";

const BuyedRaffleContent = () => {
  return (
    <div className="buyed-raffle-container">
      <div className="buyed-raffle-status-wrapper">
        <Clock2 color="#eccb27" size={50} strokeWidth={1} />

        {/*<CheckCircle color="#7DDD5A" size={50} strokeWidth={1} />*/}

        {/*<XCircle color="#D13434" size={50} strokeWidth={1} />*/}

        <div className="status-info-wrapper">
          <h2 className="status-title">Aguardando Pagamento!</h2>
          <span className="status-desc">Finalize a compra</span>
        </div>
      </div>

      <div className="buyed-raffle-box">
        <div className="payment-expiration-wrapper">
          <span className="payment-expiration-timer">Você tem <strong>09:50</strong> para pagar</span>

          <div className="payment-expiration-progress-bar-container">
            <div style={{ width: "10%" }} className="payment-expiration-progress-bar" />
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
              <input type="text" readOnly name="pix-code" autoComplete="off" autoCorrect="off" className="payment-steps-input" />

              <button type="button" className="payment-steps-copy-btn">Copiar</button>
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
            <QRCodeSVG />
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
            <img src={defaultPrize} alt="Rifa" className="details-raffle-image" />
          </div>

          <div className="details-raffle-info">
            <h2 className="details-raffle-title">Rifa Teste</h2>

            <span className="details-raffle-desc">descrição teste</span>

            <span className="details-raffle-quant">
              Quantidade de números comprados: <strong>5</strong>
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
              <strong>Comprador:</strong> Matheus Kristman
            </li>

            <li className="payment-details-info">
              <strong>CPF:</strong> 462.***.***-**
            </li>

            <li className="payment-details-info">
              <strong>Telefone:</strong> (11) *****-****
            </li>

            <li className="payment-details-info">
              <strong>Data/Hora:</strong> 21/09/2023 ás 10h45
            </li>

            <li className="payment-details-info">
              <strong>Situação:</strong> Aguardando pagamento
            </li>

            <li className="payment-details-info">
              <strong>Total:</strong> R$ 2,20
            </li>

            <li className="payment-details-info">
              <strong>Números:</strong> Os números serão liberados após o pagamento
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
