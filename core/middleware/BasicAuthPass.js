const BasicAuthPass = (req, res, next) => {
    // -----------------------------------------------------------------------
    // authentication middleware
    const auth = {
        username: process.env.AUTH_BASIC_AUTH_USERNAME,
        password: process.env.AUTH_BASIC_AUTH_PASSWORD,
    };

    // parse  and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    // Verify login and password are set and correct
    if (username && password && username === auth.username && password === auth.password) {
        // Access granted...
        return next();
    }

    // Access denied...
    res.set('WWW-Authenticate', 'Basic realm="401"');
    return res.status(401).send('Authentication required.');
    // -----------------------------------------------------------------------
};

export default BasicAuthPass;
