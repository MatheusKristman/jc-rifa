import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

import useBuyNumbersStore from "../../../stores/useBuyNumbersStore";

export default function PaymentModal() {
  const { closePaymentModal, qrCodePayment, paymentLink } = useBuyNumbersStore(
    (state) => ({
      closePaymentModal: state.closePaymentModal,
      qrCodePayment: state.qrCodePayment,
      paymentLink: state.paymentLink,
    }),
  );

  const paymentOverlayRef = useRef(null);
  const paymentBoxRef = useRef(null);

  const handleClosePaymentModal = () => {
    paymentOverlayRef.current.style.animation =
      "paymentFadeOut 0.2s ease forwards";
    paymentBoxRef.current.style.animation =
      "paymentModalOut 0.4s ease forwards";

    setTimeout(() => {
      closePaymentModal();
    }, 400);
  };

  const redirectToPaymentPage = () => {
    window.open(paymentLink, "_blank").focus();
  };

  return (
    <div
      ref={paymentOverlayRef}
      className="raffle-selected__raffle-selected-content__container__payment-overlay"
    >
      <div
        ref={paymentBoxRef}
        className="raffle-selected__raffle-selected-content__container__payment-overlay__payment-box"
      >
        <div className="raffle-selected__raffle-selected-content__container__payment-overlay__payment-box__qrcode-box">
          <QRCodeSVG value={qrCodePayment} />
        </div>
        <button
          onClick={redirectToPaymentPage}
          className="raffle-selected__raffle-selected-content__container__payment-overlay__payment-box__payment-link"
        >
          Link de pagamento
        </button>
        <button
          onClick={handleClosePaymentModal}
          className="raffle-selected__raffle-selected-content__container__payment-overlay__payment-box__close-btn"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
