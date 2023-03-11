import React, { useEffect } from 'react';
import useWinnerStore from '../stores/useWinnerStore';
import { Header, Footer } from './components';
import WinnersContent from './components/winners/WinnersContent';
import api from '../services/api';

const Winners = () => {
  const { setWinners } = useWinnerStore((state) =>({ setWinners: state.setWinners }));

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
    <div className="winners">
      <Header />
      <WinnersContent />
      <Footer />      
    </div>
  )
}

export default Winners;
