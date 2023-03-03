import React from 'react'
import useChangePasswordStore from '../../../stores/useChangePasswordStore'

const ChangePasswordMessageBox = () => {
  const {
    isChangeCompleted,
    registerMessage,
    submitError,
  } = useChangePasswordStore(
    (state) => ({
      isChangeCompleted: state.isChangeCompleted,
      registerMessage: state.registerMessage,
      submitError: state.submitError,
    })
  );

  return (
    <div style={submitError ? {backgroundColor: 'rgb(209, 52, 52)'} : {}} className={isChangeCompleted ? "register-message-box" : "register-message-box desactive"}>
      <div className="register-message-box__container">
        <span className={"register-message-box__container__message"}>
          {registerMessage}
        </span>
      </div>
    </div>
  )
}

export default ChangePasswordMessageBox