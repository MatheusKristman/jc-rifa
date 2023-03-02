import React, { useEffect } from 'react'

import { Header, Footer, HomeContent  } from './components';
import useIsUserLogged from '../hooks/useIsUserLogged';
import useUserStore from '../stores/useUserStore';

const Home = () => {
  const {
    user,
  } = useUserStore(
    (state) => ({
      user: state.user,
    })
  )

  useIsUserLogged('/');  

  return (
    <div className="home">
      <Header />
      <HomeContent />
      <Footer />
    </div>
  )
}

export default Home;
