import React from 'react'
import useRegisterStore from '../stores/useRegisterStore';
import { Header, Footer } from './components';
import UpdateRegistrationContent from './components/updateRegistration/UpdateRegistrationContent';
import UpdateRegistrationMessageBox from './components/updateRegistration/UpdateRegistrationMessageBox';

const UpdateRegistration = () => {
  const { isRegisterCompleted, errorSubmitting } = useRegisterStore(
    (state) => ({
      isRegisterCompleted: state.isRegisterCompleted,
      errorSubmitting: state.errorSubmitting,
    })
  )

  return (
    <div className="register">
      <Header />
      <UpdateRegistrationContent />
      <Footer />
      {isRegisterCompleted && <UpdateRegistrationMessageBox />}
      {errorSubmitting && <UpdateRegistrationMessageBox />}
    </div>
  )
}

export default UpdateRegistration