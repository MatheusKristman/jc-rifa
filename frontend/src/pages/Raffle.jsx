import React from "react";
import useIsUserLogged from "../hooks/useIsUserLogged";
import { Header, Footer } from "./components";
import RafflePageContent from "./components/raffle/RafflePageContent";

const Raffle = () => {
    useIsUserLogged("/raffles");

    return (
        <div className="raffle">
            <Header />
            <RafflePageContent />
            <Footer />
        </div>
    );
};

export default Raffle;
