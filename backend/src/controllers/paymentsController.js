const mercadopago = require("mercadopago");
require("dotenv").config();

console.log(process.env.MERCADO_PAGO_ACCESS_TOKEN);

mercadopago.configurations.setAccessToken(process.env.MERCADO_PAGO_ACCESS_TOKEN);

module.exports = {
  pay: async (req, res) => {
    const paymentData = {
      notification_url: "https://eoqhcniy7v8myie.m.pipedream.net",
      external_reference: req.body.id,
      transaction_amount: req.body.fullPrice,
      description: req.body.title,
      payment_method_id: "pix",
      payer: {
        email: req.body.email,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        identification: {
          type: "CPF",
          number: req.body.cpf,
        },
      },
    };

    mercadopago.payment
      .create(paymentData)
      .then((response) => res.status(200).send({ response }))
      .catch((error) => res.status(400).send({ error: error.message }));
  },
};
