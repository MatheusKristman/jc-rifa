const mercadopago = require("mercadopago");
const dotenv = require('dotenv');

mercadopago.configurations.setAccessToken(process.env.MERCADO_PAGO_ACCESS_TOKEN);

module.exports = {
  pay: async (req, res) => {
    var payment_data = {
      notification_url: req.body.notification_url,
      external_reference: req.body.external_reference,
      items: [
        {
          title: req.body.title,
          quantity: req.body.quantity,
          id: req.body.raffleId,
          currency_id: req.body.currency_id,
          unit_price: req.body.unit_price,
        },
      ],
      payer: {
        phone: {
          area_code: req.body.ddd,
          number: req.body.number,
        },
      },
    };

    mercadopago.payment
      .save(payment_data)
      .then(function (response) {
        res.status(response.status).json({
          status: response.body.status,
          status_detail: response.body.status_detail,
          id: response.body.id,
        });
      })
      .catch(function (error) {
        res.status(response.status).send(error);
      });
  },
};
