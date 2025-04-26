const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, '../client')));

// Basic route for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Simple contact route
app.post('/api/contact', (req, res) => {
  try {
    console.log('Received contact form submission:', req.body);
    res.status(200).json({ 
      success: true, 
      message: 'Message received successfully' 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));