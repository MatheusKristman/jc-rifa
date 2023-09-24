import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "./stores/useUserStore";

const ProtectedRoute = ({ children }) => {
  const { isUserLogged } = useUserStore((state) => ({ isUserLogged: state.isUserLogged }));
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!isUserLogged) {
      navigate("/");
      location.reload();
      return;
    }
  }, [isUserLogged]);

  return children;
};

export default ProtectedRoute;
