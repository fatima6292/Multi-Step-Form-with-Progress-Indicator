const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'applicants.json');

// Helper: Read data file
function readDataFile() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, '[]');
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Helper: Write data file
function writeDataFile(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Then use in your routes
app.post('/submit', upload.single('resume'), async (req, res) => {
    const data = req.body;
    
    try {
        const applicants = readDataFile();
        
        // Check duplicate
        const existing = applicants.find(a => a.email === data.email);
        if (existing) {
            return res.json({ success: false, error: 'Email already submitted' });
        }
        
        const userId = applicants.length > 0 
            ? Math.max(...applicants.map(a => a.id)) + 1 
            : 1;
        
        // Handle resume upload (save locally for testing)
        let resumePath = null;
        if (req.file) {
            const uploadDir = path.join(__dirname, 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }
            
            const ext = path.extname(req.file.originalname);
            const resumeName = `user${userId}${ext}`;
            resumePath = path.join(uploadDir, resumeName);
            fs.writeFileSync(resumePath, req.file.buffer);
        }
        
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
            resumePath: resumePath,
            submittedAt: new Date().toISOString()
        };
        
        applicants.push(newApplicant);
        writeDataFile(applicants);
        
        return res.json({ success: true, id: userId });
        
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
});