import React from 'react';
import useNewRaffleStore from '../stores/useNewRaffleStore';

import { Header, Footer } from './components';
import EditRaffleContent from './components/edit-raffle/EditRaffleContent';
import NewRaffleMessageBox from './components/new-raffle/NewRaffleMessageBox';

const EditRaffle = () => {
  const {
    isRaffleCreated,
    submitError,
  } = useNewRaffleStore(
    (state) => ({
      isRaffleCreated: state.isRaffleCreated,
      submitError: state.submitError,
    })
  );

  return (
    <div className="edit-raffle">
      <Header />
      <EditRaffleContent />
      <Footer />
      {isRaffleCreated && <NewRaffleMessageBox />}
      {submitError && <NewRaffleMessageBox />}
    </div>
  )
}

export default EditRaffle;
