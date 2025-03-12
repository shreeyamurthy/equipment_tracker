const sql = require('mssql');
const db = require('../config/db');

const fetchEquipment = async (req, res) => {
    const { type } = req.query;
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
      res.status(500).json({ error: err.message });
    }
  };
  

const createEquipment = async (req, res) => {
  const { name, type, serial_number, location, purchase_date } = req.body;
  const sqlQuery = `
    INSERT INTO scompany_equipment (name, type, serial_number, location, purchase_date)
    VALUES (@name, @type, @serial_number, @location, @purchase_date)
  `;

  try {
    const request = new sql.Request();
    request.input('name', sql.NVarChar, name);
    request.input('type', sql.NVarChar, type);
    request.input('serial_number', sql.NVarChar, serial_number);
    request.input('location', sql.NVarChar, location);
    request.input('purchase_date', sql.Date, purchase_date);
    await request.query(sqlQuery);
    res.status(201).json({ message: 'Equipment added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { fetchEquipment, createEquipment };