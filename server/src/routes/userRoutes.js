const express = require('express');
const router = express.Router();
const { updateProfile, getUsers, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.put('/profile', updateProfile);
router.get('/', getUsers);
router.get('/:id', getUserById);

module.exports = router;
