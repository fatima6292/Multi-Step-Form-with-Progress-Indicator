// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db'); // your SQLite db.js

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        cb(null, file.originalname); // temporary name; we'll rename after DB insert
    }
});
const upload = multer({ storage });

// POST route for form submission
app.post('/submit', upload.single('resume'), (req, res) => {
    const data = req.body;
    
    // Check duplicate email
    db.get('SELECT * FROM applicants WHERE email = ?', [data.email], (err, row) => {
        if (err) return res.json({ success: false, error: err.message });
        if (row) return res.json({ success: false, error: 'Email already submitted' });

        // Insert new applicant into DB
        const query = `INSERT INTO applicants 
            (name, email, phone, dob, qualification, degree, gradYear, totalCgpa, obtainedCgpa, hasExp, companyName, jobTitle, duration, skills, language, resumeName)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            data.name,
            data.email,
            data.phone,
            data.dob,
            data.qualification,
            data.degree,
            data.gradYear,
            data.totalCgpa,
            data.obtainedCgpa,
            data.hasExp,
            data.companyName || null,
            data.jobTitle || null,
            data.duration || null,
            data.skills,
            data.language,
            null // temporary resumeName
        ];

        db.run(query, values, function(err) {
            if (err) return res.json({ success: false, error: err.message });

            const userId = this.lastID; // auto-generated unique ID

            // Handle resume file rename
            let resumeName = null;
            if (req.file) {
                const ext = path.extname(req.file.originalname);
                resumeName = `user${userId}${ext}`;
                const newPath = path.join(uploadDir, resumeName);
                fs.renameSync(req.file.path, newPath);

                // Update DB with new resumeName
                db.run('UPDATE applicants SET resumeName=? WHERE id=?', [resumeName, userId]);
            }

            return res.json({ success: true, id: userId });
        });
    });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
