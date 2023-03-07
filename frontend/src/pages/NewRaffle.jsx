import React from 'react';
import useIsUserLogged from '../hooks/useIsUserLogged';
import useNewRaffleStore from '../stores/useNewRaffleStore';

import { Header, Footer } from './components';
import NewRaffleContent from './components/new-raffle/NewRaffleContent';
import NewRaffleMessageBox from './components/new-raffle/NewRaffleMessageBox';

const NewRaffle = () => {
  const {
    isRaffleCreated,
    submitError,
  } = useNewRaffleStore(
    (state) => ({
      isRaffleCreated: state.isRaffleCreated,
      submitError: state.submitError,
    })
  );

  useIsUserLogged('create-new-raffle');

  return (
    <div className="new-raffle">
      <Header />
      <NewRaffleContent />
      <Footer />
      {isRaffleCreated && <NewRaffleMessageBox />}
      {submitError && <NewRaffleMessageBox />}
    </div>
  )
}

export default NewRaffle;
