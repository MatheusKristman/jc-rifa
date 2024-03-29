import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Home,
  Raffle,
  RaffleSelected,
  QueryNumbers,
  Register,
  UpdateRegistration,
  Winners,
  Terms,
  Contact,
  RaffleManagement,
  NewRaffle,
  EditRaffle,
} from "./pages";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";

import "./css/styles.css";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/raffles" element={<Raffle />} />
          <Route path="/raffles/:selected" element={<RaffleSelected />} />
          <Route path="/query-numbers" element={<QueryNumbers />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/updateRegistration"
            element={
              <ProtectedRoute>
                <UpdateRegistration />
              </ProtectedRoute>
            }
          />
          <Route path="/winners" element={<Winners />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/raffle-management"
            element={
              <ProtectedRouteAdmin>
                <RaffleManagement />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/create-new-raffle"
            element={
              <ProtectedRouteAdmin>
                <NewRaffle />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/edit-raffle/:id"
            element={
              <ProtectedRouteAdmin>
                <EditRaffle />
              </ProtectedRouteAdmin>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
