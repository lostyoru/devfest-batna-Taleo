const User = require('../models/User');

async function handleLogout(req, res) {
    try {
        const cookies = req.cookies;
        if(!cookies?.jwt){
            return res.sendStatus(204);
        }
        const refreshToken = cookies.jwt;
        const result = await User.findOne({ refreshToken });
        if(!result){
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
            return res.sendStatus(204);
        }
        result.refreshToken = null;
        await result.save();
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
        return res.status(200).json({ message: 'Logout successful' });
    } catch(error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = { handleLogout };