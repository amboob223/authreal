const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./pool');
const bcrypt = require('bcrypt'); // Import bcrypt

// Middleware
app.use(express.json());
app.use(cors());

// Handle user signup
app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hash the password before storing it in the database
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Construct an SQL query to insert a new user into the database
        const query = 'INSERT INTO pass(email, password) VALUES($1, $2) RETURNING *';
        const values = [email, hashedPassword];

        // Execute the query and send the user data as a JSON response
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Handle user login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Construct an SQL query to retrieve the hashed password from the database
        const query = 'SELECT password FROM pass WHERE email = $1';
        const values = [email];

        // Execute the query
        const result = await pool.query(query, values);

        if (result.rows.length === 1) {
            const hashedPassword = result.rows[0].password;

            // Compare the provided password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, hashedPassword);

            if (passwordMatch) {
                res.status(200).json({ message: 'Login successful' });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server on port 5000
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
