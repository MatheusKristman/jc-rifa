import React from 'react'
import { Header, Footer } from './components';
import AddCreditsContent from './components/add-credits/AddCreditsContent';

const AddCredits = () => {
  return (
    <div className="add-credits">
      <Header />
      <AddCreditsContent />
      <Footer />
    </div>
  )
}

export default AddCredits;
