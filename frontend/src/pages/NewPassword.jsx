import React from "react";

import { Header, Footer } from "./components";
import NewPasswordContent from "./components/new-password/NewPasswordContent";
import AlertBox from "./components/AlertBox";
import useNewPasswordStore from "../stores/useNewPasswordStore";

const NewPassword = () => {
  const { isChangeCompleted, submitError, registerMessage } = useNewPasswordStore((state) => ({
    isChangeCompleted: state.isChangeCompleted,
    submitError: state.submitError,
    registerMessage: state.registerMessage,
  }));

  return (
    <div className="new-password">
      <Header />
      <NewPasswordContent />
      <Footer />
      {isChangeCompleted && <AlertBox success={isChangeCompleted} error={submitError} message={registerMessage} />}
      {submitError && <AlertBox success={isChangeCompleted} error={submitError} message={registerMessage} />}
    </div>
  );
};

export default NewPassword;
