import React from 'react';
import { Header, Footer } from './components';
import WinnersContent from './components/winners/WinnersContent';

const Winners = () => {
  return (
    <div className="winners">
      <Header />
      <WinnersContent />
      <Footer />      
    </div>
  )
}

export default Winners;
