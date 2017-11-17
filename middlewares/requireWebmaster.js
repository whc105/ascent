const config = require('../config/config');

module.exports = (req, res, next) => {
	if (req.user === undefined || req.user.permissionLevel < config.permissionLevels.webMaster) {
		return res.status(403).send({ error: 'You do not have permission to access this resource' });
	}
	next();
};