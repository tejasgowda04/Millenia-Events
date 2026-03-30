// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const CSV_FILE = path.join(__dirname, 'registrations.csv');

// Initialize CSV if it doesn't exist
if (!fs.existsSync(CSV_FILE)) {
    fs.writeFileSync(CSV_FILE, 'Name,Email,Mobile,Business Type,UTR Number,Date\n');
}

const server = http.createServer((req, res) => {
    // Enable CORS to allow requests from the HTML file served locally
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle Preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/register') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                // Helper to sanitize and escape CSV columns
                const escapeCSV = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
                
                const csvRow = [
                    escapeCSV(data.name),
                    escapeCSV(data.email),
                    escapeCSV(data.mobile),
                    escapeCSV(data.business),
                    escapeCSV(data.utr),
                    escapeCSV(new Date().toISOString()) // Added Date for reference
                ].join(',') + '\n';
                
                // Append the row to the CSV file
                fs.appendFileSync(CSV_FILE, csvRow);
                console.log(`[SUCCESS] New Registration Added: ${data.name} (UTR: ${data.utr})`);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Saved successfully' }));
            } catch (err) {
                console.error('[ERROR] Failed to save registration:', err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid request' }));
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`Backend Server Started!`);
    console.log(`Listening on http://localhost:${PORT}`);
    console.log(`Registrations will be saved to: ${CSV_FILE}`);
    console.log('='.repeat(50));
    console.log('Waiting for submissions...');
});
