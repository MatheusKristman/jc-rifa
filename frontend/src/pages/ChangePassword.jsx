import React from 'react';
import useIsUserLogged from "../hooks/useIsUserLogged";
import useChangePasswordStore from '../stores/useChangePasswordStore';

import { Header, Footer } from './components';
import ChangePasswordContent from './components/change-password/ChangePasswordContent';
import ChangePasswordMessageBox from './components/change-password/ChangePasswordMessageBox';


const ChangePassword = () => {  
  const { isChangeCompleted, submitError }  = useChangePasswordStore(
    (state) => ({
      isChangeCompleted: state.isChangeCompleted,
      submitError: state.submitError,
    })
  );

  useIsUserLogged('/changePassword');

  return (
    <div className="change-password">
      <Header />
      <ChangePasswordContent />
      <Footer />
      {isChangeCompleted && <ChangePasswordMessageBox />}
      {submitError && <ChangePasswordMessageBox />}
    </div>
  )
}

export default ChangePassword;
