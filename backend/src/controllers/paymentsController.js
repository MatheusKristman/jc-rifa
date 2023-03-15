const mercadopago = require("mercadopago");
require("dotenv").config();

mercadopago.configure({ access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN });

module.exports = {
  pay: async (req, res) => {
    const preference = {
      notification_url: "https://webhook.site/56747dd4-9027-4df6-bea2-32de92933dcd",
      external_reference: req.body.id,
      items: [
        {
          title: req.body.title,
          quantity: req.body.quantity,
          id: req.body.raffleId,
          currency_id: "BRL",
          unit_price: req.body.unit_price,
        },
      ],
      payer: {
        phone: {
          area_code: req.body.ddd,
          number: req.body.tel,
        },
      },
      back_urls: {
        success: "http://localhost:5173",
        failure: "",
        pending: "",
      },
      auto_return: "approved",
      // binary_mode: true,
    };

    mercadopago.preferences
      .create(preference)
      .then((response) => res.status(200).send({ response }))
      .catch((error) => res.status(400).send({ error: error.message }));
  },
};
