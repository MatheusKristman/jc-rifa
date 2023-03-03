import React from 'react';
import useRegisterStore from '../../../stores/useRegisterStore';

const UpdateRegistrationMessageBox = () => {
  const { isRegisterCompleted, registerMessage } = useRegisterStore(
    (state) => ({
      isRegisterCompleted: state.isRegisterCompleted,
      registerMessage: state.registerMessage
    })
  )

  return (
    <div className={isRegisterCompleted ? "register-message-box" : "register-message-box desactive"}>
      <div className="register-message-box__container">
        <span className={"register-message-box__container__message"}>
          {registerMessage}
        </span>
      </div>
    </div>
  )
}

export default UpdateRegistrationMessageBox;
