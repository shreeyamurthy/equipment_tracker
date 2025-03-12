const express = require('express');
const { submitMaintenanceLog, generateReport } = require('../controllers/maintenanceController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/log', authenticateToken, authorizeRole(['Technician']), submitMaintenanceLog);
router.get('/report', authenticateToken, authorizeRole(['Admin', 'Manager']), generateReport);

module.exports = router;