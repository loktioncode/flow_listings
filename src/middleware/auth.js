const jwt = require("jsonwebtoken");

module.exports = (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        res.status(401).json({ message: "Authentication failed!" });
    }
};
