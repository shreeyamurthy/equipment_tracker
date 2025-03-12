const express = require('express');
const { register, login,updateRole,fetchUsers } = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware')
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/assign-role', updateRole);
router.get('/fetch-users',fetchUsers);

module.exports = router;