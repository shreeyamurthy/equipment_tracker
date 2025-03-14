const express = require('express');
const { getScheduledMaintenance,getDetailTasks,getTasksByTechnician,getTaskCalendar ,getDateTasks } = require('../controllers/maintenanceController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();


router.get('/getScheduledMaintenance/:id',getScheduledMaintenance);
router.get('/getDetailTasks/:id/:date',getDetailTasks);
router.get('/getTasksByTechnician/:id',getTasksByTechnician);
router.get('/getTaskCalendar/:id',getTaskCalendar);
router.get('/getDateTasks/:id/:date',getDateTasks);
module.exports = router;