const express = require('express');
const { fetchEquipment, createEquipment } = require('../controllers/equipmentController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/fetchEquipment', fetchEquipment);
router.post('/createEquipment', createEquipment);

module.exports = router;