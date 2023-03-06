import { useLayoutEffect } from 'react';
import { useNavigate } from "react-router-dom";
import useUserStore from "./stores/useUserStore";

const ProtectedRouteAdmin = ({ children }) => {
  const { isUserLogged, user } = useUserStore((state) => ({ isUserLogged: state.isUserLogged, user: state.user }));
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!isUserLogged && !user.admin) {
      navigate('/');
      return;
    }
  }, [isUserLogged]);

  return children;
}

export default ProtectedRouteAdmin;