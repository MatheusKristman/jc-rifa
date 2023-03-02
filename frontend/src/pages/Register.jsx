import React from 'react';
import { Header, Footer } from './components';
import RegisterContent from './components/register/RegisterContent';
import useRegisterStore from '../stores/useRegisterStore';
import RegisterMessageBox from './components/register/RegisterMessageBox';

const Register = () => {
  const {
    isRegisterCompleted,
  } = useRegisterStore(
    (state) => ({
      isRegisterCompleted: state.isRegisterCompleted,
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
