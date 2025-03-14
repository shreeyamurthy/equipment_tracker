const sql = require('mssql');
const ExcelJS = require('exceljs');
const db = require('../config/db');



const getScheduledMaintenance = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Missing equipment ID' });
    }

    const query = `
        SELECT scheduled_date, task, description
        FROM equipment_maintenance
        WHERE equipment_id = @id AND status = 'Scheduled'
    `;

    try {
        const request = new sql.Request();
        const result = await request
            .input('id', sql.Int, id)
            .query(query);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Fetch Scheduled Maintenance Error:', err);
        res.status(500).json({ error: 'Failed to fetch scheduled maintenance' });
    }
};

const getDetailTasks = async (req, res) => {
    const {  id,date } = req.params;

    if (!date || !id) {
        return res.status(400).json({ error: 'Missing required query parameters' });
    }

    // Parse and validate the date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
    }

    const query = `
       SELECT 
    em.task,
    em.description,
    em.status,
    se.technician_name,
    su.email
FROM 
    equipment_maintenance em
JOIN 
    scompany_equipment se ON em.equipment_id = se.id
JOIN 
    scompany_users su ON se.technician_id = su.id
WHERE 
    em.scheduled_date = @date 
    AND em.equipment_id = @id
    `;

    try {
        const request = new sql.Request();
        const result = await request
            .input('date', sql.Date, parsedDate)
            .input('id', sql.Int, id)
            .query(query);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching maintenance tasks:', err);
        res.status(500).json({ error: 'Failed to fetch maintenance tasks' });
    }
};

const getTasksByTechnician = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Missing required path parameter: technicianId' });
    }

    const query = `
        SELECT 
            em.id,
            em.task,
            em.description,
            em.status,
            em.scheduled_date,
            se.name,
            se.type,
            se.serial_number,
            sm.name AS manager_name,
            sm.email AS manager_email
        FROM 
            equipment_maintenance em
        JOIN 
            scompany_equipment se ON em.equipment_id = se.id
        JOIN 
            scompany_users su ON se.technician_id = su.id
        JOIN 
            scompany_users sm ON se.manager_id = sm.id
        WHERE 
            su.id = @id and em.status='Scheduled'
    `;

    try {
        const request = new sql.Request();
        const result = await request
            .input('id', sql.Int, id)
            .query(query);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};


const getTaskCalendar = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Missing required path parameter: id' });
    }

    const query = `
        SELECT 
            em.task,
            em.scheduled_date,
            se.name,
            se.type,
            se.serial_number
        FROM 
            equipment_maintenance em
        JOIN 
            scompany_equipment se ON em.equipment_id = se.id
        JOIN 
            scompany_users su ON se.technician_id = su.id
        WHERE 
            su.id = @id AND em.status = 'Scheduled'
    `;

    try {
        const request = new sql.Request();
        const result = await request
            .input('id', sql.Int, id)
            .query(query);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

const getDateTasks = async (req, res) => {
    const { id, date } = req.params;

    if (!id || !date) {
        return res.status(400).json({ error: 'Missing required path parameters: id and date' });
    }

    const query = `
        SELECT 
            em.task,
            em.description,
            em.status,
            em.scheduled_date,
            se.name,
            se.type,
            se.serial_number,
            sm.name AS manager_name,
            sm.email AS manager_email
        FROM 
            equipment_maintenance em
        JOIN 
            scompany_equipment se ON em.equipment_id = se.id
        JOIN 
            scompany_users su ON se.technician_id = su.id
        JOIN 
            scompany_users sm ON se.manager_id = sm.id
        WHERE 
            su.id = @id and em.scheduled_date = @date and em.status='Scheduled'

    `;

    try {
        const request = new sql.Request();
        const result = await request
            .input('id', sql.Int, id)
            .input('date', sql.Date, new Date(date))
            .query(query);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

module.exports = { getScheduledMaintenance ,getDetailTasks,getTasksByTechnician,getTaskCalendar,getDateTasks};