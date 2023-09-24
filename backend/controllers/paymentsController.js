import mercadopago from "mercadopago";

mercadopago.configurations.setAccessToken(
  process.env.MERCADO_PAGO_ACCESS_TOKEN,
);

export const pay = async (req, res) => {
  const paymentData = {
    notification_url: "https://eoqhcniy7v8myie.m.pipedream.net",
    external_reference: req.body.id,
    transaction_amount: Math.round(req.body.fullPrice * 100) / 100,
    description: req.body.title,
    payment_method_id: "pix",
    date_of_expiration: new Date(new Date().getTime() + 10 * 60 * 1000),
    payer: {
      email: req.body.email,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      identification: {
        type: "CPF",
        number: req.body.cpf,
      },
    },
    metadata: {
      payerId: req.body.id,
      raffleId: req.body.raffleId
    }
  };

  mercadopago.payment
    .create(paymentData)
    .then((response) => res.status(200).send({ response }))
    .catch((error) => res.status(400).send({ error: error.message }));
};
