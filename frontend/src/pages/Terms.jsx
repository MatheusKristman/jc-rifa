import React from 'react';
import { Header, Footer } from './components';
import TermsContent from './components/terms/TermsContent';

const Terms = () => {
  return (
    <div className="terms">
      <Header />
      <TermsContent />
      <Footer />
    </div>
  )
}

export default Terms;
