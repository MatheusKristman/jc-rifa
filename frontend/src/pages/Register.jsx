import React from 'react';
import { Header, Footer } from './components';
import RegisterContent from './components/register/RegisterContent';
import useRegisterStore from '../stores/useRegisterStore';
import RegisterMessageBox from './components/register/RegisterMessageBox';

const Register = () => {
  const {
    isSubmitting,
    submitting,
    notSubmitting,
    isRegisterCompleted,
    registerComplete,
    registerNotComplete,
  } = useRegisterStore(
    (state) => ({
      isSubmitting: state.isSubmitting,
      submitting: state.submitting,
      notSubmitting: state.notSubmitting,
      isRegisterCompleted: state.isRegisterCompleted,
      registerComplete: state.registerComplete,
      registerNotComplete: state.registerNotComplete,
    })
  )

  return (
    <div className="register">
      <Header />
      <RegisterContent />
      <Footer />
      {isRegisterCompleted && <RegisterMessageBox />}
    </div>
  )
}

export default Register;
