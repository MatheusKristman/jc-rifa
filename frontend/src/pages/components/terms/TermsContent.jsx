import React from "react";
import { BsCardList } from "react-icons/bs";

const TermsContent = () => {
    return (
        <div className="terms__terms-content">
            <div className="terms__terms-content__container">
                <h1 className="terms__terms-content__container__title">
                    <BsCardList /> Termos de uso
                </h1>

                <div className="terms__terms-content__container__content">
                    <h3 className="terms__terms-content__container__content__title">TERMOS E CONDIÇOES</h3>

                    <h3 className="terms__terms-content__container__content__sub-title">LEIA COM ATENÇÃO ANTES DE PARTICIPAR</h3>

                    <div className="terms__terms-content__container__content__wrapper">
                        <span className="terms__terms-content__container__content__wrapper__title">1 – QUEM PODE PARTICIPAR</span>

                        <span className="terms__terms-content__container__content__wrapper__desc">
                            Maiores de 18 anos podem participar das ações disponíveis.
                        </span>
                    </div>

                    <div className="terms__terms-content__container__content__wrapper">
                        <span className="terms__terms-content__container__content__wrapper__title">2 – ADIAMENTO DA AÇÃO</span>

                        <span className="terms__terms-content__container__content__wrapper__desc">
                            A ação poderá ser adiada caso não seja realizada a venda de 70% das cotas apresentadas, como também, a
                            necessidade de averiguação de alguma possível irregularidade no sistema dos sorteios.
                        </span>
                    </div>

                    <div className="terms__terms-content__container__content__wrapper">
                        <span className="terms__terms-content__container__content__wrapper__title">
                            3 – DEFINIÇÃO DO CONTEMPLADO DA AÇÃO
                        </span>

                        <span className="terms__terms-content__container__content__wrapper__desc">
                            O contemplado será sempre o participante que contiver o seu nome, CPF e número de contato do celular
                            gravados na cota premiada.
                        </span>
                    </div>

                    <div className="terms__terms-content__container__content__wrapper">
                        <span className="terms__terms-content__container__content__wrapper__title">4 – CANCELAMENTO DA AÇÃO</span>

                        <span className="terms__terms-content__container__content__wrapper__desc">
                            O serviço poderá ser cancelado sem aviso prévio, caso seja comprovada qualquer violação aos termos da
                            ação.
                        </span>
                    </div>

                    <div className="terms__terms-content__container__content__wrapper">
                        <span className="terms__terms-content__container__content__wrapper__title">
                            5 – REEMBOLSO DE PAGAMENTO
                        </span>

                        <span className="terms__terms-content__container__content__wrapper__desc">
                            O reembolso das cotas pagas serão unicamente realizado caso a ação seja cancelada.
                        </span>

                        <span className="terms__terms-content__container__content__wrapper__desc">
                            O participante que no caso de pagamento em duplicidade não tiver registrado os dados (nome e contato)
                            no bilhete, deverá solicitar o reembolso do valor pago, apresentando impreterivelmente o comprovante
                            de pagamento e, após checagem do recebimento do valor pago, realizaremos o reembolso.
                        </span>
                    </div>

                    <div className="terms__terms-content__container__content__wrapper">
                        <span className="terms__terms-content__container__content__wrapper__title">6 – ATUALIZAÇÕES</span>

                        <span className="terms__terms-content__container__content__wrapper__desc">
                            O site poderá alterar estes termos conforme as necessidades existentes, visando aperfeiçoar e/ou
                            corrigir possíveis erros e problemas para promover a segurança dos participantes.
                        </span>
                    </div>

                    <div className="terms__terms-content__container__content__wrapper">
                        <span className="terms__terms-content__container__content__wrapper__title">7 – SORTEIO</span>

                        <span className="terms__terms-content__container__content__wrapper__desc">
                            O sorteio principal é composto por 10.000 números (de 0000 à 9999) a serem escolhidos na página do
                            site. A data do sorteio será avisada nas redes sociais após a venda de 70% das cotas. Após a extração
                            dos números no site das LOTERIAS CAIXA, a Rifas Tx utilizará os 4 (quatro) últimos números da milhar
                            “completa” do primeiro prêmio da extração.
                        </span>
                    </div>

                    <div className="terms__terms-content__container__content__wrapper">
                        <span className="terms__terms-content__container__content__wrapper__title">
                            8 – ENTREGA AO CONTEMPLADO
                        </span>

                        <span className="terms__terms-content__container__content__wrapper__desc">
                            O prêmio será entregue nas condições que se encontra. As formas para transferência de propriedade,
                            entrega ou envio, serão por conta do contemplado da cota paga.
                        </span>
                    </div>

                    <div className="terms__terms-content__container__content__wrapper">
                        <span className="terms__terms-content__container__content__wrapper__title">9 – PAGAMENTOS DAS COTAS</span>

                        <span className="terms__terms-content__container__content__wrapper__desc">
                            Caso o pagamento tenha sido feito em nome de terceiros, será considerado ganhador aquele cujo o nome,
                            CPF e contato está no cadastro.
                        </span>
                    </div>

                    <span className="terms__terms-content__container__content__desc">
                        O Pagamento deverá ser efetuado através de PIX e cartão de crédito nas contas expostas no site. Não nos
                        responsabilizamos por depósitos realizados de forma incorreta ou em contas distintas das citadas no site
                        www.jcrifa.com.br.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TermsContent;
