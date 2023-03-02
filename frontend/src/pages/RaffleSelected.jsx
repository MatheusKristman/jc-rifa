import React from 'react';
import { Header, Footer } from './components';
import RaffleSelectedContent from './components/raffle/RaffleSelectedContent';

const RaffleSelected = () => {
  return (
    <div classNasme="raffle-selected">
      <Header />
      <RaffleSelectedContent />
      <Footer />
    </div>
  )
}

export default RaffleSelected;
