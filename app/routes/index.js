const whisperRoutes = require('./whisper_routes');
const captchaRoutes = require('./captcha_routes');

module.exports = (app, db) => {
    whisperRoutes(app, db);
    captchaRoutes(app, db);
};
