import React from "react";
import useIsUserLogged from "../hooks/useIsUserLogged";
import useChangePasswordStore from "../stores/useChangePasswordStore";

import { Header, Footer } from "./components";
import ChangePasswordContent from "./components/change-password/ChangePasswordContent";
import AlertBox from "./components/AlertBox";

const ChangePassword = () => {
    const { isChangeCompleted, submitError, registerMessage } = useChangePasswordStore((state) => ({
        isChangeCompleted: state.isChangeCompleted,
        submitError: state.submitError,
        registerMessage: state.registerMessage,
    }));

    useIsUserLogged("/changePassword");

    return (
        <div className="change-password">
            <Header />
            <ChangePasswordContent />
            <Footer />
            {isChangeCompleted && <AlertBox success={isChangeCompleted} error={submitError} message={registerMessage} />}
            {submitError && <AlertBox success={isChangeCompleted} error={submitError} message={registerMessage} />}
        </div>
    );
};

export default ChangePassword;
