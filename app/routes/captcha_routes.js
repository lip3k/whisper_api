const http = require('http');
const axios = require('axios');


const CAPTCHA_URL = 'https://www.google.com/recaptcha/api/siteverify';
module.exports = (app, db) => {

    app.post('/verify', (req, res) => {
        const secret = process.env.CAPTCHA_SECRET;

        if (!secret) {
            res.send('Error while retrieving secret from environment variables');
        }
        const response = req.body.responseData;
        if (!response) {
            res.send('Error while getting response from request params');
            return;
        }

        axios({
            method: 'post',
            url: CAPTCHA_URL,
            data: {
                secret: secret,
                response: response
            },
            params: {
                secret: secret,
                response: response
            },
            headers: {
                'content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }).then(verify => {
            res.send(verify.data);
        }).catch(error => {
            res.send(error);
        });
    });
};
