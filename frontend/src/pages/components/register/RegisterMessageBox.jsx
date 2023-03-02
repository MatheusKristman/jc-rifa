import React from "react";
import useRegisterStore from "../../../stores/useRegisterStore";

const RegisterMessageBox = () => {
  const { isRegisterCompleted } = useRegisterStore((state) => ({
    isRegisterCompleted: state.isRegisterCompleted,
  }));

  return (
    <div className={isRegisterCompleted ? "register-message-box" : "register-message-box desactive"}>
      <div className="register-message-box__container">
        <span className={"register-message-box__container__message"}>
          Cadastro realizado com sucesso
        </span>
      </div>
    </div>
  );
};

export default RegisterMessageBox;
