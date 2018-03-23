const express = require('express');
const bodyParser = require('body-parser');
const OAuthServer = require('express-oauth-server');
const proxy = require('express-http-proxy');
const url = require('url');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
    
app.oauth = new OAuthServer({
    requireClientAuthentication: {password: false},
    model: require('./model')
});

// Resolve some authorization mechanism into a token
app.post('/oauth/token', app.oauth.token());

// Post authorization - used with the authorization code grant type.
// Used for third party apps with a redirect flow to obtain an authorization code
app.post('/oauth/authorize', app.oauth.authorize());

// Proxy api requests to forum extension if allowed
app.use(
    '/api', 
    app.oauth.authenticate(), //verifies token or 401
    (req, res, next) => {
        proxy('web', {
            proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
                proxyReqOpts.headers['X-Mafiascum-Api-User'] = res.locals.oauth.token.user.id;
                proxyReqOpts.headers['X-Mafiascum-Api-Secret'] = process.env.API_CLIENT_SHARED_KEY;
                // phpbb is not entitled to any of the user agent's cookies
                delete proxyReqOpts.headers['cookie'];
                return proxyReqOpts;
            },
            proxyReqPathResolver: req => {
                // location of phpbb api extension
                return `/app.php/api${url.parse(req.url).path}`;
            },
            userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
                // client is not entitled to any of the phpbb session information
                headers['set-cookie'] = [];
                return headers;
            }
        })(req, res, next);
    }
);

// Start listening for requests.
app.listen(3000);