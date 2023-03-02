import React from 'react'
import { Header, Footer } from './components';
import UpdateRegistrationContent from './components/updateRegistration/UpdateRegistrationContent';

const UpdateRegistration = () => {
  return (
    <div className="register">
      <Header />
      <UpdateRegistrationContent />
      <Footer />
      {/* {isRegisterCompleted && <UpdateRegistrationMessageBox />} */}
    </div>
  )
}

export default UpdateRegistration