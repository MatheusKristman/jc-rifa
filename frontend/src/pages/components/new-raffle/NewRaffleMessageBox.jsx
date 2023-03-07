import React from 'react'
import useNewRaffleStore from '../../../stores/useNewRaffleStore';

const NewRaffleMessageBox = () => {
  const {
    submitError,
    isRaffleCreated,
    raffleCreatedMessage,
  } = useNewRaffleStore(
    (state) => ({
      submitError: state.submitError,
      isRaffleCreated: state.isRaffleCreated,
      raffleCreatedMessage: state.raffleCreatedMessage,
    })
  )

  return (
    <div style={submitError ? {backgroundColor: 'rgb(209, 52, 52)'} : {}} className={isRaffleCreated || submitError ? "register-message-box" : "register-message-box desactive"}>
      <div className="register-message-box__container">
        <span className={"register-message-box__container__message"}>
          {raffleCreatedMessage}
        </span>
      </div>
    </div>
  )
}

export default NewRaffleMessageBox;
