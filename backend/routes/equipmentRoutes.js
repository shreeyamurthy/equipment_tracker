const express = require('express');
const { fetchEquipment, createEquipment,fetchEquipDetail } = require('../controllers/equipmentController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/fetchEquipment', fetchEquipment);
router.post('/createEquipment', createEquipment);
router.get('/:id',fetchEquipDetail);

module.exports = router;