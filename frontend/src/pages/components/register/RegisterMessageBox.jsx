import React from "react";
import useRegisterStore from "../../../stores/useRegisterStore";

const RegisterMessageBox = () => {
  const { isRegisterCompleted, registerMessage, errorSubmitting } = useRegisterStore((state) => ({
    isRegisterCompleted: state.isRegisterCompleted,
    registerMessage: state.registerMessage,
    errorSubmitting: state.errorSubmitting,
  }));

  return (
    <div style={errorSubmitting ? {backgroundColor: 'rgb(209, 52, 52)'} : {}} className={isRegisterCompleted || errorSubmitting ? "register-message-box" : "register-message-box desactive"}>
      <div className="register-message-box__container">
        <span className={"register-message-box__container__message"}>
          {registerMessage}
        </span>
      </div>
    </div>
  );
};

export default RegisterMessageBox;
