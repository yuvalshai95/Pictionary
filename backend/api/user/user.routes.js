const express = require('express');
const {getUser, getUsers, deleteUser, updateUser} = require('./user.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getUsers);
router.get('/:id', getUser);

module.exports = router;
