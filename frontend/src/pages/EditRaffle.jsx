import React from 'react';
import useNewRaffleStore from '../stores/useNewRaffleStore';

import { Header, Footer } from './components';
import EditRaffleContent from './components/edit-raffle/EditRaffleContent';
import AlertBox from './components/AlertBox';

const EditRaffle = () => {
  const {
    isRaffleCreated,
    submitError,
    raffleCreatedMessage,
  } = useNewRaffleStore(
    (state) => ({
      isRaffleCreated: state.isRaffleCreated,
      submitError: state.submitError,
      raffleCreatedMessage: state.raffleCreatedMessage,
    })
  );

  return (
    <div className="edit-raffle">
      <Header />
      <EditRaffleContent />
      <Footer />
      {isRaffleCreated && <AlertBox success={isRaffleCreated} error={submitError} message={raffleCreatedMessage} />}
      {submitError && <AlertBox success={isRaffleCreated} error={submitError} message={raffleCreatedMessage} />}
    </div>
  )
}

export default EditRaffle;
