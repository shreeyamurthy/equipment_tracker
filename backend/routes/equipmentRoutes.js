const express = require('express');
const { fetchEquipment, createEquipment, fetchMaintenanceTasks, addMaintenanceTask, fetchEquipmentDetail, updateMaintenanceTask, deleteMaintenanceTask, autoAssignAssignee, editAssignee } = require('../controllers/equipmentController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/fetchEquipment', fetchEquipment);
router.post('/createEquipment', createEquipment);
router.get('/fetchMaintenanceTasks/:equipmentId', fetchMaintenanceTasks)
router.post('/addMaintenanceTask', addMaintenanceTask)
router.get('/fetchEquipmentDetail/:id', fetchEquipmentDetail); 
router.put('/updateMaintenanceTask/:id', updateMaintenanceTask);
router.delete('/deleteMaintenanceTask/:id', deleteMaintenanceTask);
router.get('/autoAssignAssignee', autoAssignAssignee)
router.post('/editAssignee', editAssignee)
module.exports = router;