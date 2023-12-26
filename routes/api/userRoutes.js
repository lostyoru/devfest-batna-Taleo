const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const ROLES_LIST = require('../../config/roles_list');
const verifyJWT = require('../../middlewares/verifyJWT');
const verifyRoles = require('../../middlewares/verifyRoles');

router.get('/',verifyJWT, verifyRoles(ROLES_LIST.Admin), userController.getUsers);
router.get('/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin), userController.getUserById);
router.delete('/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin), userController.deleteUser);
router.put('/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin), userController.updateUser);

module.exports = router;