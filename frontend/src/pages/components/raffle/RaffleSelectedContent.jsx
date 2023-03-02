import React from "react";
import PrizeDisplayed from "../PrizeDisplayed";
import { BsFacebook, BsTelegram, BsTwitter, BsWhatsapp, BsCart, BsCheck2Circle } from 'react-icons/bs';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { Link } from 'react-router-dom';

const RaffleSelectedContent = () => {
  return (
    <div className="raffle-selected__raffle-selected-content">
      <div className="raffle-selected__raffle-selected-content__container">
        <div className="raffle-selected__raffle-selected-content__container__raffle-displayed">
          <PrizeDisplayed />
        </div>

        <span className="raffle-selected__raffle-selected-content__container__price-tag">
          POR APENAS <strong>R$ 1,49</strong>
        </span>

        <div className="raffle-selected__raffle-selected-content__container__desc-card">
          <p className="raffle-selected__raffle-selected-content__container__desc-card__desc">
            MELHORANDO CLÁSSICOS <br />
            <br />
            VW - JETTA TSI PACOTE PREMIUM OU 80K NO PIX!! <br />
            <br />
            - RODAS ARO 20  <br />
            - SUSPENSÃO A AR <br />
            - INTERNA CARAMELO <br />
            - STAGE 2 <br />
            - DOWNPIPE <br />
            - CATBACK <br />
            - KIT<br />
            <br />
            GLI - 2013 - 86 mil km<br />
            <br />
            VEICULO OU 80 MIL NA CONTA!!<br />
            <br />
            COMO PARTICIPAR DA NOSSA RIFA? 1- Escolha a quantidade de números; (OS NÚMEROS SERÃO
            ALEATÓRIOS ESCOLHIDO PELO SISTEMA) 2- Clicar em participar do sorteio; 3- Apertar em
            finalizar; 4- Preencher todos os dados solicitados CORRETAMENTE; 5- Realizar o pix
            automático no valor do(s) número(s) escolhido(s) para a conta do PAGSTAR;
            <br />
            <br />
            <br />
            CASO NÃO CONSIGA REALIZAR O PIX AUTOMÁTICO:<br />
            <br />
            1- Enviar o comprovante via Telegram (número abaixo);<br />
            <br />
            (Aguardar o retorno, o que pode demorar um pouco, devido a grande quantidade de
            mensagens)<br />
            <br />
            2- Após a verificação da sua transferência/Pix, iremos enviar o comprovante de
            participação;<br />
            <br />
            <br />
            LEIAM COM ATENÇÃO POR FAVOR!<br />
            <br />
            REGRAS:<br />
            <br />
            1- Não aceitamos Pix agendado, depósito via ENVELOPE, DOC, nem TED, somente PIX
            imediato.<br />
            <br />
            2- Não nos responsabilizamos por PIX ou informações passadas erradas pelo participante.<br />
            <br />
            3- Toda reserva Terá um Aviso que será estipulado o tempo para pagamento, LEIA
            atenciosamente nossos Avisos, a cota não paga Até o Horário estipulado nos Avisos PODERÁ
            ficar disponível para outro participante. Prazo 10 minutos (podendo diminuir para
            pagamento imediato).<br />
            <br />
            4- Não nos responsabilizamos por cotas pagas muito próximo ao prazo de vencimento, caso
            perca o número por demora em realizar o pagamento ou envie próximo do prazo máximo, o
            participante deverá escolher o número novamente, na ausência do número desejado deverá
            escolher outro número, caso não tenhamos nenhum número disponível nos comprometemos em
            devolver a quantia paga.<br />
            <br />
            <br />
            SOBRE A PREMIAÇÃO:<br />
            <br />
            VW - JETTA TSI PACOTE PREMIUM OU 80K NO PIX!!<br />
            <br />
            - Transporte: Se o ganhador optar pelo prêmio (VW - JETTA TSI PACOTE PREMIUM OU 80K NO
            PIX!!) , o custo de envio pelos correios fica por conta do ganhador.<br />
            <br />
            SOBRE O SORTEIO:<br />
            <br />
            Data de sorteio será marcada e divulgada após a venda de todas as cotas<br />
            <br />
            Utilizamos o site Oficial da Caixa Econômica (Loteria Federal) para estar realizando o
            sorteio, a extração será pelas 5 números do (1º primeiro colocado )<br />
            <br />
            Caso tenha mais sorteios do mesmo setor no mesmo dia, iremos utilizar o 1º Primeiro
            prêmio (1º Colocado) para todas as ações.<br />
            <br />
            <br />
            <br />
            SEMPRE AVISAREMOS NOS GRUPOS A ORDEM ANTES DE INICIAR AS VENDAS. CASO VIER A COMPRAR JÁ
            ESTÁ CIENTE!<br />
            <br />
            SEGUE O SITE do sorteio
            http://loterias.caixa.gov.br/wps/portal/loterias/landing/federal/<br />
            <br />
            Caso haja alguma dúvida, nos chame através do Telegram<br />
            <br />
            (11) 96986-0353
          </p>
        </div>

        <div className="raffle-selected__raffle-selected-content__container__social-wrapper">
          <a href="#" className="raffle-selected__raffle-selected-content__container__social-wrapper__social">
            <BsFacebook />
          </a>
          <a href="#" className="raffle-selected__raffle-selected-content__container__social-wrapper__social">
            <BsTelegram />
          </a>
          <a href="#" className="raffle-selected__raffle-selected-content__container__social-wrapper__social">
            <BsTwitter />
          </a>
          <a href="#" className="raffle-selected__raffle-selected-content__container__social-wrapper__social">
            <BsWhatsapp />
          </a>
        </div>

        <div className="raffle-selected__raffle-selected-content__container__title-wrapper">
          <h1 className="raffle-selected__raffle-selected-content__container__title-wrapper__title">
            ⚡ Cotas
          </h1>

          <span className="raffle-selected__raffle-selected-content__container__title-wrapper__desc">
            Escolha sua sorte
          </span>
        </div>

        <Link to="" className="raffle-selected__raffle-selected-content__container__link-query-numbers">
          <BsCart /> Ver meus números
        </Link>

        <div className="raffle-selected__raffle-selected-content__container__buy-numbers-box">
          <span className="raffle-selected__raffle-selected-content__container__buy-numbers-box__desc">
            Selecione a quantidade de números
          </span>

          <div className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper">
            <button type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn">
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>10
              </h1>
              
              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>

            <button type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn emphasis">
              <span className="emphasis-tag">
                Mais popular
              </span>
              
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>15
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>

            <button type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn">
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>200
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>

            <button type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn">
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>250
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>

            <button type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn">
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>300
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>

            <button type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn">
              <h1 className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__title">
                <small>+</small>350
              </h1>

              <p className="raffle-selected__raffle-selected-content__container__buy-numbers-box__buy-numbers-wrapper__numbers-btn__desc">
                Selecionar
              </p>
            </button>
          </div>

          <div className="raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper">
            <button type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper__btn">
              <CiCircleMinus />
            </button>

            <div className="raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper__selected-numbers-display">
              2
            </div>

            <button type="button" className="raffle-selected__raffle-selected-content__container__buy-numbers-box__selected-numbers-wrapper__btn">
              <CiCirclePlus />
            </button>
          </div>
        </div>

        <button type="button" className="raffle-selected__raffle-selected-content__container__buy-btn">
          <span className="raffle-selected__raffle-selected-content__container__buy-btn__desc">
            <BsCheck2Circle /> Participar do sorteio
          </span>

          <span className="raffle-selected__raffle-selected-content__container__buy-btn__price">
            R$ 0,00
          </span>
        </button>
      </div>
    </div>
  );
};

export default RaffleSelectedContent;
