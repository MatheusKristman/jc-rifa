import React from "react";
import { ToastContainer } from "react-toastify";

import { Header, Footer } from "./components";
import RaffleManagementContent from "./components/raffle-management/RaffleManagementContent";

const RaffleManagement = () => {
  return (
    <div className="raffle-management">
      <Header />
      <RaffleManagementContent />
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default RaffleManagement;
