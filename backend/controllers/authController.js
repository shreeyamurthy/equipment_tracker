const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const db = require('../config/db');
const nodemailer = require('nodemailer');

const register = async (req, res) => {
    const { employee_id, name, email, password, selected_role } = req.body;

    // Input validation
    if (!employee_id || !name || !email || !password || !selected_role) {
      return res.status(400).json({ error: 'All fields (employee_id, name, email, password, selected_role) are required' });
    }

    // Email format validation (must end with @gmail.com)
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email must be a valid Gmail address (e.g., example@gmail.com)' });
    }

    // Password length validation (greater than 6 characters)
    if (password.length <= 6) {
      return res.status(400).json({ error: 'Password must be greater than 6 characters' });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Step 1: Check if the user exists in the employees table using employee_id
      const checkEmployeeQuery = `
        SELECT * FROM scompany_Employee 
        WHERE [employee_id] = @employee_id
      `;
      const employeeRequest = new sql.Request();
      employeeRequest.input('employee_id', sql.NVarChar, employee_id);

      const employeeResult = await employeeRequest.query(checkEmployeeQuery);

      // If no matching employee is found
      if (employeeResult.recordset.length === 0) {
        return res.status(403).json({ error: 'Invalid Employee ID. User is not part of the company' });
      }

      // Step 2: Check if the user is already registered in the users table (by employee_id OR email)
      const checkUserQuery = `
        SELECT * FROM scompany_users 
        WHERE [employee_id] = @employee_id OR [email] = @email
      `;
      const userCheckRequest = new sql.Request();
      userCheckRequest.input('employee_id', sql.NVarChar, employee_id);
      userCheckRequest.input('email', sql.NVarChar, email);

      const userResult = await userCheckRequest.query(checkUserQuery);
      console.log(userResult);

      // If user is already registered
      if (userResult.recordset.length > 0) {
        const existingUser = userResult.recordset[0];
        if (existingUser.employee_id === employee_id) {
          return res.status(409).json({ error: 'User with this Employee ID is already registered' });
        } else if (existingUser.email === email) {
          return res.status(409).json({ error: 'This email is already registered with another Employee ID' });
        }
      }

      // Step 3: Register the user in the users table
      const insertUserQuery = `
        INSERT INTO scompany_users (employee_id, name, email, password, selected_role, assigned_role)
        VALUES (@employee_id, @name, @email, @password, @selected_role, 'Pending')
      `;

      const insertRequest = new sql.Request();
      insertRequest.input('employee_id', sql.NVarChar, employee_id);
      insertRequest.input('name', sql.NVarChar, name);
      insertRequest.input('email', sql.NVarChar, email);
      insertRequest.input('password', sql.NVarChar, hashedPassword);
      insertRequest.input('selected_role', sql.NVarChar, selected_role);

      await insertRequest.query(insertUserQuery);

      // Success response
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      // Handle specific errors (e.g., duplicate email if email is unique in users table)
      if (err.number === 2627) { // SQL Server error code for unique constraint violation
        return res.status(409).json({ error: 'Email or Employee ID already registered' });
      }
      res.status(500).json({ error: 'Server error: ' + err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password ) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
    // Email format validation (must end with @gmail.com)
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email must be a valid Gmail address (e.g., example@gmail.com)' });
    }
    if (password.length <= 6) {
        return res.status(400).json({ message: 'Password must be greater than 6 characters' });
      }
  
    const sqlQuery = 'SELECT * FROM scompany_users WHERE email = @Email';
  
    try {
      const request = new sql.Request();
      request.input('email', sql.NVarChar, email);
      const result = await request.query(sqlQuery);
  
      if (result.recordset.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const user = result.recordset[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch || user.assigned_role === 'Pending') {
        return res.status(401).json({ message: 'Access denied' });
      }
  
      const token = jwt.sign(
        { id: user.id, assigned_role: user.assigned_role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ token, role: user.assigned_role });
    } catch (err) {
      res.status(500).json({ message: "unable to log you in"});
    }
  };

  const fetchUsers = async (req, res) => {
    try {
      // Step 1: Query to fetch users with assigned role 'Pending'
      const fetchUsersQuery = `
        SELECT * FROM scompany_users 
        WHERE [assigned_role] = 'Pending'
        ORDER BY [entry_date] ASC
      `;
      const request = new sql.Request();
      const result = await request.query(fetchUsersQuery);
  
      // Step 2: Check if any users are found
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: 'No users with pending roles found' });
      }
  
      // Step 3: Return the list of users
      res.status(200).json(result.recordset);
    } catch (err) {
      res.status(500).json({ error: 'Server error: ' + err.message });
    }
  };
  


  const updateRole = async (req, res) => {
    // const { action } = req.body;
    // const { employee_id } = req.query;
  
    // // Validate input
    // if (!employee_id || !action) {
    //   return res.status(400).json({ error: 'Employee ID and action are required' });
    // }
  
    // // Fetch the user's email and selected role
    // const fetchUserQuery = `
    //   SELECT email, selected_role FROM scompany_users
    //   WHERE employee_id = @employee_id
    // `;
    // const request = new sql.Request();
    // request.input('employee_id', sql.NVarChar, employee_id);
  
    // try {
    //   const userResult = await request.query(fetchUserQuery);
    //   if (userResult.recordset.length === 0) {
    //     return res.status(404).json({ error: 'User not found' });
    //   }
  
    //   const userEmail = userResult.recordset[0].email;
    //   const selectedRole = userResult.recordset[0].selected_role;
  
    //   let assignedRole = 'Pending';
    //   let emailSubject = '';
    //   let emailText = '';
  
    //   if (action === 'assign') {
    //     assignedRole = selectedRole;
    //     emailSubject = 'Role Assignment Notification';
    //     emailText = `You have been successfully assigned the role of ${assignedRole}.You can login now.`;
    //   } else if (action === 'decline') {
    //     emailSubject = 'Role Assignment Declined';
    //     emailText = 'Your role assignment request has been declined.';
    //   } else {
    //     return res.status(400).json({ error: 'Invalid action' });
    //   }
  
    //   // Update the assigned role if action is 'assign'
    //   if (action === 'assign') {
    //     const updateRoleQuery = `
    //       UPDATE scompany_users
    //       SET assigned_role = @assigned_role
    //       WHERE employee_id = @employee_id
    //     `;
    //     request.input('assigned_role', sql.NVarChar, assignedRole);
    //     await request.query(updateRoleQuery);
    //   }
  
    //   Send email notification
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,// true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        connectionTimeout:30000,
        tls: {
          rejectUnauthorized: false
        }
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "murthyshreeya@gmail.com",
        subject: "hiiiii",
        text: "helooo"
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ error: 'Error sending email: ' + error.message });
        }
        res.status(200).json({ message: 'Action completed and email sent successfully' });
      });
    
    // res.status(200).json({ message: 'Action completed successfully' });
    // } 
    // catch (err) {
    //   res.status(500).json({ error: 'Server error: ' + err.message });
    // }
  };
  

module.exports = { register, login,updateRole, fetchUsers };

// -- Create the employees table with Email column (unique)
// CREATE TABLE employees (
//     [Employee ID] VARCHAR(10) PRIMARY KEY,
//     [Name] VARCHAR(50),
//     [Email] VARCHAR(100) UNIQUE,  -- Added Email with UNIQUE constraint
//     [Age] INT,
//     [Department] VARCHAR(50),
//     [Selected Role] VARCHAR(50),
//     [Assigned Role] VARCHAR(50)
// );

// -- Insert the five records with unique email addresses
// INSERT INTO employees ([Employee ID], [Name], [Email], [Age], [Department], [Selected Role], [Assigned Role])
// VALUES 
//     ('E001', 'John Smith', 'john.smith@company.com', 32, 'Engineering', 'Software Engineer', 'Software Engineer'),
//     ('E002', 'Maria Gonzalez', 'maria.gonzalez@company.com', 28, 'Marketing', 'Marketing Manager', 'Content Specialist'),
//     ('E003', 'David Kim', 'david.kim@company.com', 45, 'Finance', 'Financial Analyst', 'Senior Accountant'),
//     ('E004', 'Sarah Johnson', 'sarah.johnson@company.com', 37, 'Human Resources', 'HR Specialist', 'HR Manager'),
//     ('E005', 'Ahmed Patel', 'ahmed.patel@company.com', 29, 'IT Support', 'Systems Admin', 'Network Technician');

// -- Verify the data
// SELECT * FROM employees;