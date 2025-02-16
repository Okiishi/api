const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({ error: "Token mal formatado" });
    }

    const [scheme, token] = parts;

    if (scheme !== "Bearer") {
        return res.status(401).json({ error: "Token mal formatado" });
    }

    console.log("Token recebido:", token); // ✅ Agora o token está definido

    jwt.verify(token, 'seuSegredoAqui', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Token inválido" });
        }

        req.userId = decoded.id;
        next();
    });
};
