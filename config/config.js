module.exports = {
    PORT: process.env.PORT || 8080,
    keys: process.env.NODE_ENV === 'production' ? require('./.prodKeys') : require('./.prodKeys'),
    permissionLevels: {
        webMaster: 100,
        admin: 3,
        teacher: 2,
        guest:0
    }
};