const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function handleNewUser(req, res) {
    const { fullname, username, email, password} = req.body;
    console.log(req.body);
    try {
        const duplicateEmail = await User.findOne({ email });
        const duplicateUsername = await User.findOne({ username })
        if(duplicateEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        if(duplicateUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const userRegex = /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/;
        if(!userRegex.test(username)){
            return res.status(400).json({ message: 'Invalid username' });
        }
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if(!passwordRegex.test(password)){
            return res.status(400).json({ message: 'Invalid password' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        const user = await User.create({
            fullname, 
            username, 
            email, 
            password: hashedPassword 
        });
        console.log(user);
        return res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { handleNewUser };