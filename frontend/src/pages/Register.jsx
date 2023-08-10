import React from "react";

import { Header, Footer } from "./components";
import RegisterContent from "./components/register/RegisterContent";

const Register = () => {
  return (
    <div className="register">
      <Header />
      <RegisterContent />
      <Footer />
    </div>
  );
};

export default Register;
