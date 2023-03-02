import React from "react";
import { BsArrowRight } from 'react-icons/bs';

const FaqsQuestion = ({ faqRef, isFaqOpen, openFaq, closeFaq }) => {
  const handleFaq = () => {
    if (isFaqOpen) {
      closeFaq();
      return;
    }

    openFaq();    
  }

  return (
    <div onClick={handleFaq} className="question-box">
      <span className="question-box__title">
        <BsArrowRight /> Acessando suas compras
      </span>

      <div ref={faqRef} style={isFaqOpen ? { maxHeight: `${faqRef.current.scrollHeight}px`, marginTop: "10px" } : { maxHeight: "0px", marginTop: "0px" }} className="question-box__answer">
          Existem duas formas de você conseguir acessar suas compras, a primeira é logando no site,
          abrindo o menu do site e clicando em "Entrar" e a segunda forma é visitando o sorteio e
          clicando em "Compras" logo a baixo do nome "Cotas"
      </div>
    </div>
  );
};

export default FaqsQuestion;
