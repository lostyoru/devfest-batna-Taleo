const jwt = require('jsonwebtoken');

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization']
    if(!authHeader?.startsWith('Bearer ')){
        return res.sendStatus(401) // unauthorized
    }
    const token = authHeader.split(' ')[1]; // Bearer <token>
    console.log(token);
    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET, 
        (err, decoded) => {
            if(err){
                return res.sendStatus(403); // invalid token
            }
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            console.log('req : ', req.user, req.roles)
            next();
        }
    );
}

module.exports = verifyJWT;