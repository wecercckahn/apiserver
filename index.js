const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for license keys
const licenses = {};

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/licenses', (req, res) => {
    try {
        const { key, expiryDate } = req.body;
        licenses[key] = new Date(expiryDate); // Storing expiry date as a Date object
        res.json({ success: true, message: 'License added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to add license' });
    }
});

app.get('/licenses/:key', (req, res) => {
    try {
        const { key } = req.params;
        const expiryDate = licenses[key];
        if (!expiryDate) {
            return res.json({ valid: false, message: 'Invalid license key' });
        }
        const currentDate = new Date();
        if (currentDate > expiryDate) {
            return res.json({ valid: false, message: 'License key has expired' });
        }
        res.json({ valid: true, message: 'License key is valid' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ valid: false, message: 'Error checking license key' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
