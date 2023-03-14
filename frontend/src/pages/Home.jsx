import React, { useEffect } from 'react'

import { Header, Footer, HomeContent  } from './components';
import useIsUserLogged from '../hooks/useIsUserLogged';
import useUserStore from '../stores/useUserStore';
import useRaffleStore from '../stores/useRaffleStore';
import useWinnerStore from '../stores/useWinnerStore';
import api from '../services/api';
import useGeneralStore from '../stores/useGeneralStore';

const Home = () => {
  const {
    user,
  } = useUserStore(
    (state) => ({
      user: state.user,
    })
  )

  const {
    raffles,
    setRaffles,
  } = useRaffleStore(
    (state) => ({
      raffles: state.raffles,
      setRaffles: state.setRaffles,
    })
  );

  const {
    winners,
    setWinners,
  } = useWinnerStore(
    (state) => ({
      winners: state.winners,
      setWinners: state.setWinners,
    })
  );

  const {
    setToRaffleLoad,
    setToRaffleNotLoad,
  } = useGeneralStore(
    (state) => ({
      setToRaffleLoad: state.setToRaffleLoad,
      setToRaffleNotLoad: state.setToRaffleNotLoad,
    })
  );

  useIsUserLogged('/');

  useEffect(() => {
    const fetchRaffles = () => {
      if (raffles.length === 0) {
        setToRaffleLoad();
        api
          .get('/get-raffles')
          .then((res) => {
            setRaffles(res.data.filter((raffle) => raffle.isFinished === false));
            setToRaffleNotLoad();
          })
          .catch((error) => console.log(error))
      } else {
        console.log(raffles);
      }
    }

    fetchRaffles();
  }, [raffles, setRaffles]);
  
  useEffect(() => {
    const fetchWinners = () => {
      api
        .get('/all-winners')
        .then((res) => setWinners(res.data))
        .catch((error) => console.log(error));
    }

    fetchWinners();
  }, [setWinners]);

  return (
    <div className="home">
      <Header />
      <HomeContent />
      <Footer />
    </div>
  )
}

export default Home;
