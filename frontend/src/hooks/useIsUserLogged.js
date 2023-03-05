import { useEffect } from 'react';
import api from '../services/api';

import useUserStore from '../stores/useUserStore';

const useIsUserLogged = (path) => {
  const {
    setUser,
    userLogged,
    userNotLogged,
  } = useUserStore(
    (state) => ({
      setUser: state.setUser,
      userLogged: state.userLogged,
      userNotLogged: state.userNotLogged,
    })
  );

  useEffect(() => {
    const token = localStorage.getItem('userToken') || null;
  
    if (token) {
      api.get(path, {
        headers: {
          'authorization-token': token
        }
      })
      .then((res) => {
        setUser({...res.data})
        userLogged();
      })
      .catch((error) => {
        console.log(error);
        userNotLogged();
        localStorage.removeItem('userToken');
      });
    }
  }, []);
}

export default useIsUserLogged;