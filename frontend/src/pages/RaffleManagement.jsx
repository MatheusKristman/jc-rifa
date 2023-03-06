import React from 'react';

import { Header, Footer } from './components';
import RaffleManagementContent from './components/raffle-management/RaffleManagementContent';

const RaffleManagement = () => {
  return (
    <div className="raffle-management">
      <Header />
      <RaffleManagementContent />
      <Footer />
    </div>
  )
}

export default RaffleManagement;
