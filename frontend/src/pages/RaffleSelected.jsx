import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";

import { Header, Footer } from "./components";
import useBuyNumbersStore from "../stores/useBuyNumbersStore";
import RaffleSelectedContent from "./components/raffle/RaffleSelectedContent";
import useIsUserLogged from "../hooks/useIsUserLogged";
import AlertBox from "./components/AlertBox";
import PaymentModal from "./components/raffle/PaymentModal";
import useGeneralStore from "../stores/useGeneralStore";

const RaffleSelected = () => {
    useIsUserLogged();

    const { isMessageBoxDisplaying, isErrorBoxDisplaying, messageText, isPaymentModalOpen } = useBuyNumbersStore(
        (state) => ({
            isMessageBoxDisplaying: state.isMessageBoxDisplaying,
            isErrorBoxDisplaying: state.isErrorBoxDisplaying,
            messageText: state.messageText,
            isPaymentModalOpen: state.isPaymentModalOpen,
        }),
        shallow
    );

    const { isLoading } = useGeneralStore((state) => ({ isLoading: state.isLoading }));

    useEffect(() => {
        if (isPaymentModalOpen) {
            document.documentElement.style.overflowY = "hidden";
        } else {
            document.documentElement.style.overflowY = "unset";
        }
    }, [isPaymentModalOpen]);

    return (
        <div className="raffle-selected">
            <Header />
            <RaffleSelectedContent />
            {isMessageBoxDisplaying && (
                <AlertBox success={isMessageBoxDisplaying} error={isErrorBoxDisplaying} message={messageText} />
            )}
            {isErrorBoxDisplaying && (
                <AlertBox success={isMessageBoxDisplaying} error={isErrorBoxDisplaying} message={messageText} />
            )}
            {isPaymentModalOpen && <PaymentModal />}
            <Footer />
        </div>
    );
};

export default RaffleSelected;
