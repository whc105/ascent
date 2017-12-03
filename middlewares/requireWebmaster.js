const config = require('../config/config');

module.exports = (req, res, next) => {
	if (req.user === undefined || req.user.permissionLevel < config.permissionLevels.webMaster) {
		return res.render('noPermission', { url: req.url });
	}
	next();
};