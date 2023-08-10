import React from "react";
import { ToastContainer } from "react-toastify";

import { Header, Footer } from "./components";
import RegisterContent from "./components/register/RegisterContent";

const Register = () => {
  return (
    <div className="register">
      <Header />
      <RegisterContent />
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Register;
