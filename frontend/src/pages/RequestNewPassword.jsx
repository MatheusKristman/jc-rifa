import React from "react";
import useRequestNewPasswordStore from "../stores/useRequestNewPasswordStore";

import { Header, Footer } from "./components";
import RequestNewPasswordContent from "./components/request-new-password/RequestNewPasswordContent";
import AlertBox from "./components/AlertBox";

export default function RequestNewPassword() {
    const { isEmailSended, submitError, alertMessage } = useRequestNewPasswordStore((state) => ({
        isEmailSended: state.isEmailSended,
        submitError: state.submitError,
        alertMessage: state.alertMessage,
    }));

    return (
        <div className="request-new-password">
            <Header />
            <RequestNewPasswordContent />
            <Footer />
            {isEmailSended && <AlertBox success={isEmailSended} error={submitError} message={alertMessage} />}
            {submitError && <AlertBox success={isEmailSended} error={submitError} message={alertMessage} />}
        </div>
    );
}
