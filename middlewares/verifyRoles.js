const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.roles){
            return res.sendStatus(401); // unauthorized
        }
        const reqRoles = Object.values(req.roles);
        console.log(reqRoles);
        const allowedRolesArr = [...allowedRoles];
        const isAllowed = allowedRolesArr.some(role => reqRoles.includes(role));
        if(!isAllowed){
            return res.sendStatus(401); // unauthorized
        }
        next();
    }
}

module.exports = verifyRoles;