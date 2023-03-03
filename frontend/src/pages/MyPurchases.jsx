import React from 'react';

import { Header, Footer } from './components';
import MyPurchasesContent from './components/myPurchases/MyPurchasesContent';

const MyPurchases = () => {
  return (
    <div className="my-purchases">
      <Header />
      <MyPurchasesContent />
      <Footer />
    </div>
  )
}

export default MyPurchases;
