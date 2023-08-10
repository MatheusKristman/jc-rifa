import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

import useUserStore from "../stores/useUserStore";

const useIsUserLogged = () => {
  const { setUser, userLogged, userNotLogged } = useUserStore((state) => ({
    setUser: state.setUser,
    userLogged: state.userLogged,
    userNotLogged: state.userNotLogged,
  }));

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken") || null;

    if (token) {
      api
        .get("/account/is-user-logged", {
          headers: {
            "authorization-token": token,
          },
        })
        .then((res) => {
          setUser({ ...res.data });
          userLogged();

          if (location.pathname === "/register") {
            navigate("/updateRegistration");
          }
        })
        .catch((error) => {
          console.error(error);
          userNotLogged();
          localStorage.removeItem("userToken");
        });
    }
  }, []);
};

export default useIsUserLogged;
