const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { put } = require('@vercel/blob');
const db = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup - use memory storage instead of disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route for form submission
app.post('/submit', upload.single('resume'), async (req, res) => {
    const data = req.body;
    
    try {
        // Check duplicate email
        const row = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM applicants WHERE email = ?', [data.email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

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
            null
        ];

        const userId = await new Promise((resolve, reject) => {
            db.run(query, values, function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });

        // Upload resume to Vercel Blob
        let resumeUrl = null;
        if (req.file) {
            const ext = require('path').extname(req.file.originalname);
            const resumeName = `user${userId}${ext}`;
            
            const blob = await put(resumeName, req.file.buffer, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN
            });
            
            resumeUrl = blob.url;
            
            // Update DB with resume URL
            await new Promise((resolve, reject) => {
                db.run('UPDATE applicants SET resumeName=? WHERE id=?', [resumeUrl, userId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }

        return res.json({ success: true, id: userId, resumeUrl });
        
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));