/**
 * Example Node.js Backend for Gmail Checker
 *
 * Install dependencies:
 * npm init -y
 * npm install express cors body-parser dns net
 *
 * Run server:
 * node nodejs-backend.js
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const net = require('net');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // This allows requests from any origin (solves the CORS issue)
app.use(bodyParser.json());

// API Key middleware for security (matches your frontend code)
const EXPECTED_API_KEY = "bd4696b262b869a61eb206ebf6a1ea3b17f1e846d61c57754fb7548877c9b8cb";
app.use((req, res, next) => {
    // Basic API Key check
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== EXPECTED_API_KEY) {
        // Uncomment this to enforce API Key security
        // return res.status(401).json({ message: "Invalid API Key" });
    }
    next();
});

// Mock function to verify a single email via SMTP
// Note: In reality, Google often blocks standard SMTP probing.
// A robust checker uses residential proxies and complex SMTP handshakes.
async function verifyEmail(email) {
    return new Promise((resolve) => {
        // Simple regex check first
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
             return resolve({ email, status: "Inactive", details: "Invalid format" });
        }

        const domain = email.split('@')[1];

        dns.resolveMx(domain, (err, addresses) => {
            if (err || addresses.length === 0) {
                return resolve({ email, status: "Inactive", details: "No MX records" });
            }

            // For demonstration, randomly assign Active/Inactive or assume Active if MX exists.
            // A real implementation would connect to addresses[0].exchange via net.Socket()
            // and perform the SMTP commands (HELO, MAIL FROM, RCPT TO).
            // However, doing this rapidly will get your server's IP blocked.

            // Simulating API behavior from original worker:
            resolve({
                email,
                status: "live", // Frontend expects "live" for active
                details: "MX Check Passed"
            });
        });
    });
}

// Endpoint to handle bulk checks (e.g. /auth-fastcheck1, /auth-check2)
app.post(['/auth-fastcheck1', '/auth-fastcheck2', '/auth-check2'], async (req, res) => {
    try {
        const emails = req.body.mail; // Frontend sends array in 'mail'

        if (!Array.isArray(emails)) {
            return res.status(400).json({ message: "Invalid payload format. Expected 'mail' array." });
        }

        const results = [];
        // Process sequentially or in batches.
        // For production, use a queue or parallel limits to avoid memory/network exhaustion
        for (const email of emails) {
             const result = await verifyEmail(email);
             results.push(result);
        }

        // Send back the array format expected by the frontend
        res.json(results);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Node.js Backend Server is running on port ${PORT}`);
    console.log(`Update SERVER_URL in your index.html to: http://localhost:${PORT}`);
});
