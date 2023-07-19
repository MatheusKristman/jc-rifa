import React from "react";
import useRegisterStore from "../stores/useRegisterStore";
import { Header, Footer } from "./components";
import UpdateRegistrationContent from "./components/updateRegistration/UpdateRegistrationContent";
import AlertBox from "./components/AlertBox";
import { ToastContainer } from "react-toastify";

const UpdateRegistration = () => {
  const { isRegisterCompleted, errorSubmitting, registerMessage } =
    useRegisterStore((state) => ({
      isRegisterCompleted: state.isRegisterCompleted,
      errorSubmitting: state.errorSubmitting,
      registerMessage: state.registerMessage,
    }));

  return (
    <div className="register">
      <Header />
      <UpdateRegistrationContent />
      <Footer />
      {isRegisterCompleted && (
        <AlertBox
          success={isRegisterCompleted}
          error={errorSubmitting}
          message={registerMessage}
        />
      )}
      {errorSubmitting && (
        <AlertBox
          success={isRegisterCompleted}
          error={errorSubmitting}
          message={registerMessage}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default UpdateRegistration;
