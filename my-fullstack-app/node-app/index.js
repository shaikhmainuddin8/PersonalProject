const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (like index.html)

// A simple HTML page to interact with the API
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to call the Python API
app.post('/api/greet-python', async (req, res) => {
    const { name } = req.body;
    try {
        // Use the service name 'python-api' defined in docker-compose.yml
        // Docker Compose automatically resolves service names to their container IPs
        const pythonApiUrl = 'http://python-api:8000/greet'; 
        
        const response = await axios.post(pythonApiUrl, { name });
        res.json(response.data);
    } catch (error) {
        console.error('Error calling Python API:', error.message);
        // Handle Axios errors (e.g., Python API not reachable, or Python API returned an error)
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            res.status(503).json({ message: 'Python API is currently unavailable.' });
        } else {
            // Something happened in setting up the request that triggered an Error
            res.status(500).json({ message: 'An unexpected error occurred.' });
        }
    }
});

// This is the crucial line that keeps the Node.js server running
app.listen(PORT, () => {
    console.log(`Node.js app running on http://localhost:${PORT}`);
});