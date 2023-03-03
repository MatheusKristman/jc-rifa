import React from 'react';
import { Header, Footer } from './components';
import RegisterContent from './components/register/RegisterContent';
import useRegisterStore from '../stores/useRegisterStore';
import RegisterMessageBox from './components/register/RegisterMessageBox';

const Register = () => {
  const {
    isRegisterCompleted,
    errorSubmitting,
  } = useRegisterStore(
    (state) => ({
      isRegisterCompleted: state.isRegisterCompleted,
      errorSubmitting: state.errorSubmitting,
    })
  )

  return (
    <div className="register">
      <Header />
      <RegisterContent />
      <Footer />
      {isRegisterCompleted && <RegisterMessageBox />}
      {errorSubmitting && <RegisterMessageBox />}
    </div>
  )
}

export default Register;
