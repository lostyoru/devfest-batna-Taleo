const User = require('../models/User');
const bcrypt = require('bcrypt');;

async function getUsers(req, res) {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function getUserById(req, res) {
    try {
        const user = await User.findById(req.params.id);
        const isTheSameUser = req.user == user.username;
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        if(!isTheSameUser && !Object.values(req.roles).includes(2002)){
            return res.status(401).json({ message: 'Not Authorized' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function deleteUser(req, res) {
    try {
        const user = await User.findById(req.params.id);
        const isTheSameUser = req.user == user.username;
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        if(!isTheSameUser && !Object.values(req.roles).includes(2002)){
            return res.status(401).json({ message: 'Not Authorized' });
        }
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function updateUser(req, res) {
    try {
        const { fullname, username, email, password } = req.body;
        const path = req.file?.path;
        let image;
        if(path){
            let result = await cloudinary.uploader.upload(path, {
                resource_type: "image",
            });
            await fs.unlink(path, (err) => {
                if (err) {
                    console.error(err)
                    return
                    }
                })
            image = result.secure_url;
        }
        const userRegex = /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        const currentInformation = {
            fullname,
            username,
            email,
            password
        };
        const filtredInformation = currentInformation.filter((info) => info !== undefined);
        const updatedUser = await User.findById(req.params.id);
        const isTheSameUser = req.body.user === req.params.id;
        if(!updatedUser){
            return res.status(404).json({ message: 'User not found' });
        }
        if(!isTheSameUser && !Object.values(req.roles).includes(2002)){
            return res.status(401).json({ message: 'Not Authorized' });
        }   
        if(filtredInformation.username && !userRegex.test(filtredInformation.username)){
            return res.status(400).json({ message: 'Invalid username' });
        }
        if(filtredInformation.password && !passwordRegex.test(filtredInformation.password)){
            return res.status(400).json({ message: 'Invalid password' });
        }
        if(filtredInformation.password){
            filtredInformation.password = await bcrypt.hash(filtredInformation.password, 10);
        }
        if(image){
            filtredInformation.image = image;
        }
        await User.findByIdAndUpdate(req.params.id, filtredInformation);
        const user = await User.findById(req.params.id);
        return res.status(200).json({ message: 'User updated successfully' }, user);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}


module.exports = {
    getUsers,
    getUserById,
    deleteUser,
    updateUser
}