const sql = require('mssql');
const ExcelJS = require('exceljs');
const db = require('../config/db');

const submitMaintenanceLog = async (req, res) => {
    const { equipment_id, technician_name, maintenance_date, maintenance_type, issues_found, notes, status, maintenance_interval } = req.body;
    const sqlQuery = `
      INSERT INTO maintenance_logs (equipment_id, technician_id, technician_name, maintenance_date, maintenance_type, issues_found, notes, status)
      VALUES (@equipment_id, @technician_id, @technician_name, @maintenance_date, @maintenance_type, @issues_found, @notes, @status)
    `;
  
    const updateEquipmentQuery = `
      UPDATE equipment
      SET previous_maintenance_date = @maintenance_date, next_maintenance_date = DATEADD(day, @maintenance_interval, @maintenance_date)
      WHERE id = @equipment_id
    `;
  
    try {
      const request = new sql.Request();
      request.input('equipment_id', sql.Int, equipment_id);
      request.input('technician_id', sql.Int, req.user.id);
      request.input('technician_name', sql.NVarChar, technician_name);
      request.input('maintenance_date', sql.Date, maintenance_date);
      request.input('maintenance_type', sql.NVarChar, maintenance_type);
      request.input('issues_found', sql.NVarChar, issues_found);
      request.input('notes', sql.NVarChar, notes);
      request.input('status', sql.NVarChar, status);
      request.input('maintenance_interval', sql.Int, maintenance_interval);
  
      // Start a transaction
      const transaction = new sql.Transaction();
      await transaction.begin();
  
      // Insert maintenance log
      const logRequest = new sql.Request(transaction);
      await logRequest.query(sqlQuery);
  
      // Update equipment maintenance dates
      const equipmentRequest = new sql.Request(transaction);
      await equipmentRequest.query(updateEquipmentQuery);
  
      // Commit the transaction
      await transaction.commit();
  
      res.status(201).json({ message: 'Maintenance log submitted and equipment maintenance dates updated' });
    } catch (err) {
      res.status(500).json({ message: 'Maintenance log submission failed .Please submit it again',error: err.message });
    }
  };

const generateReport = async (req, res) => {
  const sqlQuery = 'SELECT * FROM maintenance_logs';

  try {
    const request = new sql.Request();
    const result = await request.query(sqlQuery);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Maintenance Logs');
    sheet.columns = [
      { header: 'Equipment ID', key: 'equipment_id' },
      { header: 'Technician ID', key: 'technician_id' },
      { header: 'Date', key: 'maintenance_date' },
      { header: 'Type', key: 'maintenance_type' },
      { header: 'Issues Found', key: 'issues_found' },
      { header: 'Status', key: 'status' }
    ];
    result.recordset.forEach(log => sheet.addRow(log));

    res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { submitMaintenanceLog, generateReport };