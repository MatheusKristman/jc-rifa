import { useNavigate } from "react-router-dom";
import useUserStore from "./stores/useUserStore";

const ProtectedRoute = ({ children }) => {
  const { isUserLogged } = useUserStore((state) => ({ isUserLogged: state.isUserLogged }));
  const navigate = useNavigate();

  if (!isUserLogged) {
    navigate('/');
    return;
  }

  return children;
}

export default ProtectedRoute;