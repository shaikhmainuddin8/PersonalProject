const express = require('express');
const axios = require('axios');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;
const PYTHON_API_PORT = 8000;

// Define the full path to the uvicorn executable within the virtual environment
// The virtual environment is created at /app/python-api/venv
const UVICORN_PATH = path.join(__dirname, '../python-api/venv/bin/uvicorn');

// --- Start Python API as a child process ---
console.log('Attempting to start Python API...');
// Use the full path to uvicorn
const pythonProcess = spawn(UVICORN_PATH, ['main:app', '--host', '0.0.0.0', '--port', String(PYTHON_API_PORT)], {
    cwd: path.join(__dirname, '../python-api'), // Still set working directory for main.py
    stdio: 'inherit'
});

pythonProcess.on('error', (err) => {
    console.error(`Failed to start Python API process: ${err}`);
    // Check if the error is due to UVICORN_PATH not found
    if (err.code === 'ENOENT') {
        console.error(`ERROR: Uvicorn executable not found at ${UVICORN_PATH}. 
        Please ensure it's installed in the Python virtual environment and the path is correct.`);
    }
    process.exit(1);
});

pythonProcess.on('exit', (code, signal) => {
    console.log(`Python API process exited with code ${code} and signal ${signal}`);
    if (code !== 0) {
        console.error('Python API exited unexpectedly. Shutting down Node.js app.');
        process.exit(1);
    }
});

setTimeout(() => {
    console.log('Python API should be running. Starting Node.js app.');
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public'))); 

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    app.post('/api/greet-python', async (req, res) => {
        const { name } = req.body;
        try {
            const pythonApiUrl = `http://localhost:${PYTHON_API_PORT}/greet`; 
            
            const response = await axios.post(pythonApiUrl, { name });
            res.json(response.data);
        } catch (error) {
            console.error('Error calling Python API from Node.js:', error.message);
            if (error.response) {
                res.status(error.response.status).json(error.response.data);
            } else if (error.request) {
                res.status(503).json({ message: 'Python API is currently unreachable from Node.js.' });
            } else {
                res.status(500).json({ message: 'An unexpected error occurred in Node.js calling Python.' });
            }
        }
    });

    app.listen(PORT, () => {
        console.log(`Node.js app running on http://localhost:${PORT}`);
    });

}, 5000);
