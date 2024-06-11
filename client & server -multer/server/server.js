const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware to enable CORS
app.use(cors());

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'D:/frontend-backend working/software_backend 1/software_backend/server/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('image');

// Serve static files from the uploads directory
app.use('/uploads', express.static('D:/frontend-backend working/software_backend 1/software_backend/server/uploads'));

// MySQL database configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sf_eng'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});

// API endpoint to handle smartphone registration
app.post('/api/insert_smartphone', (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            console.log('Multer error:', err);
            return res.status(500).json({ error: 'Error uploading file' });
        } else if (err) {
            // An unknown error occurred
            console.log('Unknown error:', err);
            return res.status(500).json({ error: 'Unknown error' });
        }

        // File upload was successful
        const { product, pdt_name, current_price, initial_price, storage_capacity, ram,
            display_description, resolution, refresh_rate, camera_setup, processor,
            battery_life, operating_system, biometric_security, water_resistance,
            fast_charging_support, wireless_charging_support, connectivity_options,
            color_options, dimensions } = req.body;
        const imagePath = req.file.path;

        // Insert data into MySQL database
        const sql = 'INSERT INTO smartphones (product, pdt_name, current_price, initial_price, storage_capacity, ram, ' +
            'display_description, resolution, refresh_rate, camera_setup, processor, battery_life, operating_system, ' +
            'biometric_security, water_resistance, fast_charging_support, wireless_charging_support, connectivity_options, ' +
            'color_options, dimensions, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        connection.query(sql, [product, pdt_name, current_price, initial_price, storage_capacity, ram,
            display_description, resolution, refresh_rate, camera_setup, processor,
            battery_life, operating_system, biometric_security, water_resistance,
            fast_charging_support, wireless_charging_support, connectivity_options,
            color_options, dimensions, imagePath], (err, result) => {
                if (err) {
                    console.error('Error inserting data into database:', err);
                    res.status(500).json({ error: 'Failed to register smartphone' });
                } else {
                    console.log('Smartphone registered successfully');
                    res.status(200).json({ message: 'Smartphone registered successfully' });
                }
            });

        // Delete the uploaded image after storing in the database (optional)
        // fs.unlinkSync(imagePath);
    });
});
// Modify the route to accept product type as a query parameter
// Modify the route to accept product type as a query parameter
app.get('/api/products', (req, res) => {
    const productType = req.query.type; // Extract product type from query params
    
    // Construct the SQL query dynamically based on the product type
    let sql;
    if (productType === 'smartphones' || productType === 'laptops' || productType === 'accessories') {
        sql = `SELECT * FROM smartphones WHERE product = '${productType}'`; // Assuming 'product' is the column storing product type
    } else {
        // If an invalid product type is provided
        return res.status(400).json({ error: 'Invalid product type' });
    }

    // Execute the SQL query
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).json({ error: 'Failed to fetch products' });
        } else {
            res.json(results);
            console.error('fetched successfully');

        }
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
