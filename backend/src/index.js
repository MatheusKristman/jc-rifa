import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import mercadopago from "mercadopago";
import { createUser, updateUser } from "./controllers/AccountController.js";
import { createNewRaffle, updateRaffle } from "./controllers/RaffleController.js";
import AccountRoutes from "./routes/AccountRoutes.js";
import PaymentRoutes from "./routes/PaymentRoutes.js";
import RaffleRoutes from "./routes/RaffleRoutes.js";
import WinnerRoutes from "./routes/WinnerRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

mercadopago.configurations.setAccessToken(process.env.MERCADO_PAGO_ACCESS_TOKEN);

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json({ limit: "30mb" }));
app.use("/raffle-uploads", express.static(path.join(__dirname, "public/data/raffle-uploads")));
app.use("/user-uploads", express.static(path.join(__dirname, "public/data/user-uploads")));

const raffleStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/data/raffle-uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/data/user-uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const raffleUpload = multer({ storage: raffleStorage });
const userUpload = multer({ storage: userStorage });

// route with image
app.post("/account/register-account", userUpload.single("profileImage"), createUser);
app.put("/account/update-account", userUpload.single("profileImage"), updateUser);
app.post("/raffle/create-raffle", raffleUpload.single("raffleImage"), createNewRaffle);
app.put("/raffle/update-raffle", raffleUpload.single("raffleImage"), updateRaffle);

// route without image
app.use("/account", multer().none(), AccountRoutes);
app.use("/payment", multer().none(), PaymentRoutes);
app.use("/raffle", multer().none(), RaffleRoutes);
app.use("/winner", multer().none(), WinnerRoutes);

mongoose
    .connect(process.env.URL_DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() =>
        app.listen(process.env.PORT, () => {
            console.log(`Running on port ${process.env.PORT} and mongodb connected`);
        }),
    )
    .catch((error) => console.error(error));
