const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt){
        return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;
    const existingUser = await User.findOne({ refreshToken });
    if(!existingUser){
        return res.sendStatus(403);
    }
    jwt.verify(
        refreshToken, 
        process.env.REFRESH_TOKEN_SECRET, 
        (err, decoded) => {
            if(err || decoded.UserInfo.username !== existingUser.username){
                return res.sendStatus(403);
            }
            const roles = Object.values(existingUser.roles);
            const UserInfo = {
                "username": existingUser.username,
                "roles": roles
            }
            const accessToken = jwt.sign(UserInfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ accessToken });
        }
    );
}

module.exports = { handleRefreshToken };