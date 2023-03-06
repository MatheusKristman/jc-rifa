import React from 'react';

import { Header, Footer } from './components';
import NewRaffleContent from './components/new-raffle/NewRaffleContent';

const NewRaffle = () => {
  return (
    <div className="new-raffle">
      <Header />
      <NewRaffleContent />
      <Footer />
    </div>
  )
}

export default NewRaffle;
