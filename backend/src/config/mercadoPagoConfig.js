const mercadopago = require("mercadopago");
require("dotenv").config();

// Adicione as credenciais
mercadopago.configurations.setAccessToken(process.env.MERCADO_PAGO_ACCESS_TOKEN);
