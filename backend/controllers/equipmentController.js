const sql = require('mssql');
const db = require('../config/db');


const fetchEquipment = async (req, res) => {
    const { type } = req.query;
    console.log('Type received:', type);
  
    let sqlQuery = 'SELECT * FROM scompany_equipment';
    if (type) {
      sqlQuery += ' WHERE type = @type';
    }
  
    try {
      const request = new sql.Request();
      if (type) {
        request.input('type', sql.NVarChar, type);
      }
      const result = await request.query(sqlQuery);
  
      res.json(result.recordset);
    } catch (err) {
      console.error('Database Query Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const fetchEquipmentDetail = async (req, res) => {
    const { id } = req.params;
    console.log('Equipment ID received:', id);
  
    if (!id) {
      return res.status(400).json({ error: 'Equipment ID is required' });
    }
  
    const sqlQuery = 'SELECT * FROM scompany_equipment WHERE id = @id';
  
    try {
      const request = new sql.Request();
      const result = await request
        .input('id', sql.Int, id)
        .query(sqlQuery);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: 'Equipment not found' });
      }
  
      res.status(200).json(result.recordset[0]);
    } catch (err) {
      console.error('Database Query Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const createEquipment = async (req, res) => {
    const { name, type, serial_number, location, purchase_date, manager_id } = req.body;
  
    if (!name || !type || !serial_number || !location || !purchase_date || !manager_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const currentDate = new Date();
    const purchaseDate = new Date(purchase_date);
    if (purchaseDate > currentDate) {
      return res.status(400).json({ error: 'Purchase date cannot be in the future' });
    }
  
    const technicianQuery = `
      SELECT su.id AS technician_id, su.name AS technician_name, COUNT(em.equipment_id) AS task_count
      FROM scompany_users su
      LEFT JOIN scompany_equipment se ON su.id = se.technician_id
      LEFT JOIN equipment_maintenance em ON se.id = em.equipment_id
      WHERE su.assigned_role = 'Technician'
      GROUP BY su.id, su.name
      ORDER BY task_count ASC
    `;
  
    try {
      const request = new sql.Request();
      const techResult = await request.query(technicianQuery);
  
      if (techResult.recordset.length === 0) {
        return res.status(500).json({ error: 'Failed to assign technician' });
      }
  
      const { technician_id, technician_name } = techResult.recordset[0];
  
      const equipmentQuery = `
        INSERT INTO scompany_equipment 
        (name, type, serial_number, location, purchase_date, manager_id, technician_id, technician_name)
        OUTPUT INSERTED.id
        VALUES (@name, @type, @serial_number, @location, @purchase_date, @manager_id, @technician_id, @technician_name)
      `;
  
      const equipmentResult = await request
        .input('name', sql.VarChar, name)
        .input('type', sql.VarChar, type)
        .input('serial_number', sql.VarChar, serial_number)
        .input('location', sql.VarChar, location)
        .input('purchase_date', sql.Date, purchase_date)
        .input('manager_id', sql.Int, manager_id)
        .input('technician_id', sql.Int, technician_id)
        .input('technician_name', sql.VarChar, technician_name)
        .query(equipmentQuery);
  
      const equipmentId = equipmentResult.recordset[0].id;
  
      const maintenanceTasks = {
        Laptop: [
          { task: 'Software Updates', year: 0, month: 1, day: 0, description: 'Check for and install OS and software updates.' },
          { task: 'Virus/Malware Scan', year: 0, month: 1, day: 0, description: 'Perform a full system antivirus and malware scan.' },
          { task: 'Backup Check', year: 0, month: 1, day: 0, description: 'Verify backups are running and restorable.' },
          { task: 'Hardware Diagnostics', year: 0, month: 6, day: 0, description: 'Check CPU, RAM, and disk health. Identify failing components.' },
          { task: 'Dust & Physical Cleaning', year: 1, month: 0, day: 0, description: 'Clean keyboard, ports, and cooling fans.' },
          { task: 'Battery Health Check', year: 1, month: 0, day: 0, description: 'Evaluate battery cycles and replace if below 80% health.' },
        ],
        Mouse: [
            { task: 'Clean Optical Sensor', year: 0, month: 3, day: 0, description: 'Clean the optical sensor to ensure accurate tracking.' },
            { task: 'Check Buttons', year: 0, month: 6, day: 0, description: 'Ensure all buttons are functioning correctly.' },
            { task: 'Replace Batteries', year: 1, month: 0, day: 0, description: 'Replace batteries if the mouse is wireless.' },
            { task: 'Clean Exterior', year: 1, month: 0, day: 0, description: 'Clean the exterior to remove dirt and grime.' },
        ],
        Keyboard: [
            { task: 'Clean Keycaps', year: 0, month: 3, day: 0, description: 'Remove and clean keycaps to prevent sticking.' },
            { task: 'Check Key Functionality', year: 0, month: 6, day: 0, description: 'Ensure all keys are functioning correctly.' },
            { task: 'Clean Interior', year: 1, month: 0, day: 0, description: 'Open and clean the interior to remove dust and debris.' },
            { task: 'Check Connectivity', year: 1, month: 0, day: 0, description: 'Ensure the keyboard is properly connected and responsive.' },
        ],
        Monitor: [
            { task: 'Clean Screen', year: 0, month: 3, day: 0, description: 'Clean the screen to remove dust and smudges.' },
            { task: 'Check Display Settings', year: 0, month: 6, day: 0, description: 'Ensure display settings are optimized for use.' },
            { task: 'Inspect Cables', year: 1, month: 0, day: 0, description: 'Check and replace any damaged cables.' },
            { task: 'Check for Dead Pixels', year: 1, month: 0, day: 0, description: 'Inspect the screen for dead or stuck pixels.' },
        ],
      };
  
      const tasks = maintenanceTasks[type] || [];
  
      if (tasks.length > 0) {
        const maintenanceQuery = `
            INSERT INTO equipment_maintenance (equipment_id, task, year, month, day, description, status, scheduled_date)
            VALUES (@equipment_id, @task, @year, @month, @day, @description, @status, @scheduled_date)
        `;

        for (const task of tasks) {
            const maintenanceRequest = new sql.Request();
            const scheduledDate = new Date(currentDate);
            scheduledDate.setFullYear(scheduledDate.getFullYear() + task.year);
            scheduledDate.setMonth(scheduledDate.getMonth() + task.month);
            scheduledDate.setDate(scheduledDate.getDate() + task.day);

            await maintenanceRequest
                .input('equipment_id', sql.Int, equipmentId)
                .input('task', sql.VarChar, task.task)
                .input('year', sql.Int, task.year)
                .input('month', sql.Int, task.month)
                .input('day', sql.Int, task.day)
                .input('description', sql.VarChar, task.description)
                .input('status', sql.VarChar, 'Scheduled')
                .input('scheduled_date', sql.Date, scheduledDate)
                .query(maintenanceQuery);
        }
  
        res.status(201).json({
          message: 'Equipment and maintenance schedule added successfully',
          id: equipmentId,
          technician_id: technician_id
        });
      } else {
        res.status(201).json({
          message: 'Equipment added without maintenance schedule',
          id: equipmentId,
          technician_id: technician_id
        });
      }
    } catch (err) {
      console.error('Database Query Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  const autoAssignAssignee = async (req, res) => {
    const technicianQuery = `
      SELECT su.id AS technician_id, su.name AS technician_name, COUNT(em.equipment_id) AS task_count
      FROM scompany_users su
      LEFT JOIN scompany_equipment se ON su.id = se.technician_id
      LEFT JOIN equipment_maintenance em ON se.id = em.equipment_id
      WHERE su.assigned_role = 'Technician'
      GROUP BY su.id, su.name
      ORDER BY task_count ASC
    `;
  
    try {
      const request = new sql.Request();
      const techResult = await request.query(technicianQuery);
  
      if (techResult.recordset.length === 0) {
        return res.status(500).json({ error: 'Failed to assign technician' });
      }
  
      const { technician_id, technician_name } = techResult.recordset[0];
  
      res.status(201).json({
        message: 'Technician assigned successfully',
        technician_name: technician_name,
        technician_id: technician_id
      });
    } catch (err) {
      console.error('Database Query Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const addMaintenanceTask = async (req, res) => {
    const { id, task, year = 0, month = 0, day = 0, description } = req.body;
  
    if (!id || !task || year === undefined || month === undefined || day === undefined || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const query = `
      INSERT INTO equipment_maintenance (equipment_id, task, year, month, day, description)
      OUTPUT INSERTED.id
      VALUES (@id, @task, @year, @month, @day, @description)
    `;
  
    try {
      const request = new sql.Request();
      const result = await request
        .input('id', sql.Int, id)
        .input('task', sql.VarChar, task)
        .input('year', sql.Int, year)
        .input('month', sql.Int, month)
        .input('day', sql.Int, day)
        .input('description', sql.VarChar, description)
        .query(query);
  
      res.status(201).json({
        id: result.recordset[0].id,
        task,
        year,
        month,
        day,
        description,
      });
    } catch (err) {
      console.error('Add Maintenance Task Error:', err);
      res.status(500).json({ error: 'Failed to add maintenance task' });
    }
  };
  const updateMaintenanceTask = async (req, res) => {
    const { id } = req.params;
    const { task, year = 0, month = 0, day = 0, description } = req.body;
  
    if (!task || (year === undefined && month === undefined && day === undefined) || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const currentDate = new Date();
    const scheduledDate = new Date(currentDate);
    scheduledDate.setFullYear(scheduledDate.getFullYear() + year);
    scheduledDate.setMonth(scheduledDate.getMonth() + month);
    scheduledDate.setDate(scheduledDate.getDate() + day);

    const query = `
        UPDATE equipment_maintenance
        SET task = @task, year = @year, month = @month, day = @day, description = @description, status = @status, scheduled_date = @scheduled_date
        WHERE id = @id
    `;

    try {
        const request = new sql.Request();
        await request
            .input('task', sql.VarChar, task)
            .input('year', sql.Int, year)
            .input('month', sql.Int, month)
            .input('day', sql.Int, day)
            .input('description', sql.VarChar, description)
            .input('status', sql.VarChar, 'Scheduled')
            .input('scheduled_date', sql.Date, scheduledDate)
            .input('id', sql.Int, id)
            .query(query);
  
      res.status(200).json({ message: 'Maintenance task updated successfully' });
    } catch (err) {
      console.error('Update Maintenance Task Error:', err);
      res.status(500).json({ error: 'Failed to update maintenance task' });
    }
  };
  const deleteMaintenanceTask = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: 'Missing maintenance task id' });
    }
  
    const query = `
      DELETE FROM equipment_maintenance WHERE id = @id
    `;
  
    try {
      const request = new sql.Request();
      await request
        .input('id', sql.Int, id)
        .query(query);
  
      res.status(200).json({ message: 'Maintenance task deleted successfully' });
    } catch (err) {
      console.error('Delete Maintenance Task Error:', err);
      res.status(500).json({ error: 'Failed to delete maintenance task' });
    }
  };
  const fetchMaintenanceTasks = async (req, res) => {
    const { equipmentId } = req.params;
  
    if (!equipmentId) {
      return res.status(400).json({ error: 'Missing equipmentId' });
    }
  
    const query = `
      SELECT * FROM equipment_maintenance WHERE equipment_id = @equipmentId
    `;
  
    try {
      const request = new sql.Request();
      const result = await request
        .input('equipmentId', sql.Int, equipmentId)
        .query(query);
  
      res.status(200).json(result.recordset);
    } catch (err) {
      console.error('Fetch Maintenance Tasks Error:', err);
      res.status(500).json({ error: 'Failed to fetch maintenance tasks' });
    }
  };

  const editAssignee = async (req, res) => {
    const { equipment_id, technician_id, technician_name } = req.body;
  
    if (!equipment_id || !technician_id || !technician_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const updateEquipmentQuery = `
      UPDATE scompany_equipment
      SET technician_id = @technician_id, technician_name = @technician_name
      WHERE id = @equipment_id
    `;
  
    try {
      const request = new sql.Request();
      await request
        .input('technician_id', sql.Int, technician_id)
        .input('technician_name', sql.VarChar, technician_name)
        .input('equipment_id', sql.Int, equipment_id)
        .query(updateEquipmentQuery);
  
      res.status(200).json({ message: 'Technician updated successfully' });
    } catch (err) {
      console.error('Error updating equipment:', err);
      res.status(500).json({ error: 'Failed to update equipment' });
    }
  };


  module.exports = {
    fetchEquipment,
    createEquipment,
    addMaintenanceTask,
    updateMaintenanceTask,
    deleteMaintenanceTask,
    fetchMaintenanceTasks,
    fetchEquipmentDetail,
    autoAssignAssignee,
    editAssignee
  };