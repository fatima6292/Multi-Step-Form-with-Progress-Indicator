const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { put, list, del } = require('@vercel/blob');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const DATA_FILE = 'applicants-data.json';

// Helper: Read data file
async function readDataFile() {
    try {
        const { blobs } = await list({ prefix: DATA_FILE });
        if (blobs.length === 0) {
            return [];
        }
        const response = await fetch(blobs[0].url);
        return await response.json();
    } catch (error) {
        console.error('Read error:', error);
        return [];
    }
}

// Helper: Write data file
async function writeDataFile(data) {
    try {
        // Delete old file first
        const { blobs } = await list({ prefix: DATA_FILE });
        if (blobs.length > 0) {
            await del(blobs[0].url);
        }
        
        // Write new file
        await put(DATA_FILE, JSON.stringify(data, null, 2), {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
            addRandomSuffix: false
        });
    } catch (error) {
        console.error('Write error:', error);
        throw error;
    }
}

// POST route
app.post('/submit', upload.single('resume'), async (req, res) => {
    const data = req.body;
    
    try {
        // Read existing data
        const applicants = await readDataFile();
        
        // Check duplicate email
        const existing = applicants.find(a => a.email === data.email);
        if (existing) {
            return res.json({ success: false, error: 'Email already submitted' });
        }
        
        // Generate new ID
        const userId = applicants.length > 0 
            ? Math.max(...applicants.map(a => a.id)) + 1 
            : 1;
        
        // Upload resume if exists
        let resumeUrl = null;
        if (req.file) {
            const ext = path.extname(req.file.originalname);
            const timestamp = Date.now();
            const resumeName = `resume-user${userId}-${timestamp}${ext}`;
            
            // Use addRandomSuffix OR timestamp to ensure uniqueness
            const blob = await put(resumeName, req.file.buffer, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN,
                addRandomSuffix: true  // ← This makes it unique
            });
            
            resumeUrl = blob.url;
        }
        
        // Create new applicant
        const newApplicant = {
            id: userId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            countryCode: data.countryCode || null,
            dob: data.dob,
            qualification: data.qualification,
            degree: data.degree,
            gradYear: data.gradYear,
            totalCgpa: data.totalCgpa,
            obtainedCgpa: data.obtainedCgpa,
            hasExp: data.hasExp,
            companyName: data.companyName || null,
            jobTitle: data.jobTitle || null,
            duration: data.duration || null,
            skills: data.skills,
            language: data.language,
            resumeUrl: resumeUrl,
            submittedAt: new Date().toISOString()
        };
        
        // Add to array and save
        applicants.push(newApplicant);
        await writeDataFile(applicants);
        
        return res.json({ success: true, id: userId, resumeUrl });
        
    } catch (error) {
        console.error('Error:', error);
        return res.json({ success: false, error: error.message });
    }
});

// GET route to view all applicants
app.get('/applicants', async (req, res) => {
    try {
        const applicants = await readDataFile();
        res.json({ success: true, count: applicants.length, data: applicants });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// GET route to view single applicant
app.get('/applicants/:id', async (req, res) => {
    try {
        const applicants = await readDataFile();
        const applicant = applicants.find(a => a.id === parseInt(req.params.id));
        if (applicant) {
            res.json({ success: true, data: applicant });
        } else {
            res.json({ success: false, error: 'Applicant not found' });
        }
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => {
    res.json({ status: 'Server is running' });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));