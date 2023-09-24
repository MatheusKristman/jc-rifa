import { Header, Footer } from "./components";
import BuyedRaffleContent from "./components/buyed-raffle/BuyedRaffleContent";
import useIsUserLogged from "../hooks/useIsUserLogged";

const BuyedRaffle = () => {
  useIsUserLogged();

  return (
    <>
      <Header />
      <BuyedRaffleContent />
      <Footer />
    </>
  );
}

export default BuyedRaffle;
