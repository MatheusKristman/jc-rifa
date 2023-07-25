import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    const token = req.header("authorization-token");

    if (!token) {
        return res.status(401).send("Acesso negado no token");
    }

    try {
        const userVerified = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(userVerified);
        req.user = userVerified;
        next();
    } catch (error) {
        return res.status(401).send("Acesso negado no auth");
    }
};