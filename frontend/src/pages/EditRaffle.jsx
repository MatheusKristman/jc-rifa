import React from 'react'

import { Header, Footer } from './components';
import EditRaffleContent from './components/edit-raffle/EditRaffleContent';

const EditRaffle = () => {
  return (
    <div className="edit-raffle">
      <Header />
      <EditRaffleContent />
      <Footer />
    </div>
  )
}

export default EditRaffle;
