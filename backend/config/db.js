// const { type } = require('@testing-library/user-event/dist/type');
const sql = require('mssql');
const dotenv = require('dotenv');
dotenv.config();

const config = {

    server: 'AMGDCSQLT1\\W22T1',
    port: '14133',
    database: 'Interns_2025',
    authentication: {
      type: 'ntlm',
      options: {
        domain: 'sw',
        userName: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      }
    },
    options: {
      encrypt: true,
      trustServerCertificate: true,
      enableArithAbort: true
    }
  };
  
  sql.connect(config, err => {
    if (err) console.error('DB connection failed:', err);
    else console.log('Connection successfull!!');
  });

module.exports = sql;