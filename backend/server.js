const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sql = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/maintenance', maintenanceRoutes);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
