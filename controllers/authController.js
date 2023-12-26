const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function handleLogin(req, res) {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const result = await User.findOne({ email });
        console.log(result);
        if(!result){
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, result.password);
        console.log(isMatch);
        if(!isMatch){
            return res.status(404).json({ message: 'invalid user or password' });
        }
        const roles = Object.values(result.roles);
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": result.username,
                    "roles": roles
                }
            }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            {
                "UserInfo": {
                    "username": result.username,
                    "roles": roles
                }
            }, 
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: '7d' }
        );
        res.cookie('jwt', refreshToken, { httpOnly: true , sameSite: 'None', maxAge: 7 * 24 * 60 * 60 * 1000});
        result.refreshToken = refreshToken;
        await result.save();
        console.log(result);
        return res.status(200).json({ accessToken });
    } catch(error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = { handleLogin }