import React from 'react';
import useIsUserLogged from '../hooks/useIsUserLogged';
import { Header, Footer } from './components';
import RaffleSelectedContent from './components/raffle/RaffleSelectedContent';

const RaffleSelected = () => {
  useIsUserLogged('/raffles');

  return (
    <div className="raffle-selected">
      <Header />
      <RaffleSelectedContent />
      <Footer />
    </div>
  )
}

export default RaffleSelected;
