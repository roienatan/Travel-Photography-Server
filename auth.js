const jwt = require('jsonwebtoken');
const { ADMIN_SECRET } = require('./constants');

module.exports = {
    generateAdminToken: adminId => {
        return jwt.sign({ data: adminId }, ADMIN_SECRET, { expiresIn: '1h' });
    },

    requiresAdmin: (req, res, next) => {
        jwt.verify(req.headers.authorization, ADMIN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Not Authorized' });
            }
            next();
        })
    }
}