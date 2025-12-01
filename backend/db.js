const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path
const dbPath = path.join(__dirname, 'formdata.db');

// Create database file if it doesn't exist
if (!fs.existsSync(dbPath)) fs.openSync(dbPath, 'w');

// Connect to SQLite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('SQLite connection error:', err.message);
    else console.log('Connected to SQLite at', dbPath);
});

// Create applicants table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS applicants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        phone TEXT,
        countryCode TEXT,
        dob TEXT,
        qualification TEXT,
        degree TEXT,
        gradYear TEXT,
        totalCgpa TEXT,
        obtainedCgpa TEXT,
        hasExp TEXT,
        companyName TEXT,
        jobTitle TEXT,
        duration TEXT,
        skills TEXT,
        language TEXT,
        resumeName TEXT
    )`, (err) => {
        if (err) console.error('Table creation error:', err.message);
        else console.log('Applicants table ready');
    });
});

module.exports = db;
