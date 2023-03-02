import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Home, Raffle, RaffleSelected, QueryNumbers, Register, NewPassword, Winners, Terms, Contact, AddCredits } from './pages';

import './css/styles.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/raffles" element={<Raffle />} />
          <Route path="/raffles/:selected" element={<RaffleSelected />} />
          <Route path="/query-numbers" element={<QueryNumbers />} />
          <Route path="/add-credits" element={<AddCredits />} />
          <Route path="/register" element={<Register />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route path="/winners" element={<Winners />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
