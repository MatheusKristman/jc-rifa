import React from 'react';
import { Header, Footer } from './components';
import RafflePageContent from './components/raffle/RafflePageContent';

const Raffle = () => {
  return (
    <div className="raffle">
      <Header />
      <RafflePageContent />
      <Footer />
    </div>
  )
}

export default Raffle;
