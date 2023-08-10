import React from "react";

import { Header, Footer } from "./components";
import UpdateRegistrationContent from "./components/updateRegistration/UpdateRegistrationContent";
import UpdatePasswordContent from "./components/updateRegistration/UpdatePasswordContent";
import useUserStore from "../stores/useUserStore";

const UpdateRegistration = () => {
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  return (
    <div className="register">
      <Header />
      <UpdateRegistrationContent />
      {user.admin && <UpdatePasswordContent />}
      <Footer />
    </div>
  );
};

export default UpdateRegistration;
