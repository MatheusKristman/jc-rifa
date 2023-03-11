import React from 'react';
import { Header, Footer } from './components';
import RegisterContent from './components/register/RegisterContent';
import useRegisterStore from '../stores/useRegisterStore';
import AlertBox from './components/AlertBox';

const Register = () => {
  const {
    isRegisterCompleted,
    errorSubmitting,
    registerMessage,
  } = useRegisterStore(
    (state) => ({
      isRegisterCompleted: state.isRegisterCompleted,
      errorSubmitting: state.errorSubmitting,
      registerMessage: state.registerMessage,
    })
  )

  return (
    <div className="register">
      <Header />
      <RegisterContent />
      <Footer />
      {isRegisterCompleted && <AlertBox success={isRegisterCompleted} error={errorSubmitting} message={registerMessage} />}
      {errorSubmitting && <AlertBox success={isRegisterCompleted} error={errorSubmitting} message={registerMessage} />}
    </div>
  )
}

export default Register;
