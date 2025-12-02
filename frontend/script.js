// ----- Elements -----
const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next");
const prevBtns = document.querySelectorAll(".prev");
const progress = document.getElementById("progress");
const progressSteps = document.querySelectorAll(".progress-bar li");
const submittedMsg = document.getElementById("submittedMsg");

// Step 1
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phoneNumber");
const countryCode = document.getElementById("countryCode");
const dobInput = document.getElementById("dob");

// Step 2
const qualification = document.getElementById("qualification");
const degree = document.getElementById("degree");
const gradYear = document.getElementById("gradYear");
const totalCgpaSelect = document.getElementById("totalCgpa");
const obtainedCgpa = document.getElementById("obtained");

// Step 3
const hasExp = document.getElementById("hasExp");
const experienceFields = document.getElementById("experienceFields");
const companyName = document.getElementById("companyName");
const jobTitle = document.getElementById("jobTitle");
const duration = document.getElementById("duration");

// Step 4
const skillsInput = document.getElementById("skills");
const languageRadios = document.getElementsByName("lang");
const resumeInput = document.getElementById('resume');

// error mesages 
const nameError = document.getElementById("errName");
const phoneError = document.getElementById("errPhone");
const emailError = document.getElementById("errEmail");
const DOBError = document.getElementById("errDate");
const qualError = document.getElementById("errQual");
const degreeError = document.getElementById("errDeg");
const yearError = document.getElementById("errYear");
const totalCgpaErr = document.getElementById("errTcgpa");
const obtCgpaErr = document.getElementById("errOcgpa");
const hasExpError = document.getElementById("errhasExp");
const compError = document.getElementById("errComp");
const jobError = document.getElementById("errJob");
const durError = document.getElementById("errDur");
const langError = document.getElementById("errLang");
const skillError = document.getElementById("errSkill");
const resumeError = document.getElementById("resumeError");

// Summary
const sumName = document.getElementById("sumName");
const sumEmail = document.getElementById("sumEmail");
const sumPhone = document.getElementById("sumPhone");
const sumQualification = document.getElementById("sumQualification");
const sumDegree = document.getElementById("sumDegree");
const sumGradYear = document.getElementById("sumGradYear");
const sumTotalCgpa = document.getElementById("sumTotalCgpa");
const sumObtainedCgpa = document.getElementById("sumObtainedCgpa");
const sumSkills = document.getElementById("sumSkills");
const sumLanguage = document.getElementById("sumLanguage");
const sumHasExp = document.getElementById("sumHasExp");
const sumCompanyName = document.getElementById("sumCompanyName");
const sumJobTitle = document.getElementById("sumJobTitle");
const sumDuration = document.getElementById("sumDuration");
const sumResume = document.getElementById("sumResume");

let currentStep = 0;

// ----- Autosave -----
function saveToLocal(key, value) {
    localStorage.setItem(key, value);
}

// Load saved data
function loadSavedData() {
    if(localStorage.getItem("name")) nameInput.value = localStorage.getItem("name");
    if(localStorage.getItem("email")) emailInput.value = localStorage.getItem("email");
    if(localStorage.getItem("phone")) phoneInput.value = localStorage.getItem("phone");
    if(localStorage.getItem("countryCode")) countryCode.value = localStorage.getItem("countryCode");
    if(localStorage.getItem("dob")) dobInput.value = localStorage.getItem("dob");
    if(localStorage.getItem("qualification")) qualification.value = localStorage.getItem("qualification");
    if(localStorage.getItem("degree")) degree.value = localStorage.getItem("degree");
    if(localStorage.getItem("gradYear")) gradYear.value = localStorage.getItem("gradYear");
    if(localStorage.getItem("totalCgpa")) totalCgpaSelect.value = localStorage.getItem("totalCgpa");
    if(localStorage.getItem("obtained")) obtainedCgpa.value = localStorage.getItem("obtained");
    if(localStorage.getItem("hasExp")) hasExp.value = localStorage.getItem("hasExp");
    if(localStorage.getItem("companyName")) companyName.value = localStorage.getItem("companyName");
    if(localStorage.getItem("jobTitle")) jobTitle.value = localStorage.getItem("jobTitle");
    if(localStorage.getItem("duration")) duration.value = localStorage.getItem("duration");
    if(localStorage.getItem("skills")) skillsInput.value = localStorage.getItem("skills");
    if(localStorage.getItem("language")) {
        Array.from(languageRadios).forEach(r => r.checked = r.value === localStorage.getItem("language"));
    }
    if(localStorage.getItem("resumeName")) sumResume.textContent = localStorage.getItem("resumeName");
}
loadSavedData();

// ----- Navigation Buttons -----
nextBtns.forEach(btn => btn.addEventListener("click", () => {
    if (!validateStep(currentStep)) return;
    currentStep++;
    updateFormSteps();
    updateProgressBar();
}));

prevBtns.forEach(btn => btn.addEventListener("click", () => {
    currentStep--;
    updateFormSteps();
    updateProgressBar();
}));

function updateFormSteps() {
    steps.forEach((step, idx) => step.classList.toggle("active", idx === currentStep));
    if(currentStep === 4) populateSummary();
}

function updateProgressBar() {
    progressSteps.forEach((step, idx) => step.classList.toggle("active", idx <= currentStep));
    const activeSteps = document.querySelectorAll(".progress-bar li.active").length;
    progress.style.width = ((activeSteps - 1) / (progressSteps.length - 1)) * 100 + "%";
}

// ----- Summary -----
function populateSummary() {
    sumName.textContent = nameInput.value;
    sumEmail.textContent = emailInput.value;
    sumPhone.textContent = countryCode.value + " " + phoneInput.value;
    sumQualification.textContent = qualification.value;
    sumDegree.textContent = degree.value;
    sumGradYear.textContent = gradYear.value;
    sumTotalCgpa.textContent = totalCgpaSelect.value;
    sumObtainedCgpa.textContent = obtainedCgpa.value;
    sumSkills.textContent = skillsInput.value;
    const selectedLang = Array.from(languageRadios).find(r => r.checked);
    sumLanguage.textContent = selectedLang ? selectedLang.value : "-";
    sumHasExp.textContent = hasExp.value === "yes" ? "Yes" : "No";
    if(hasExp.value === "yes") {
        sumCompanyName.textContent = companyName.value;
        sumJobTitle.textContent = jobTitle.value;
        sumDuration.textContent = duration.value;
        document.getElementById("companyRow").style.display = "block";
        document.getElementById("jobRow").style.display = "block";
        document.getElementById("durationRow").style.display = "block";
    } else {
        document.getElementById("companyRow").style.display = "none";
        document.getElementById("jobRow").style.display = "none";
        document.getElementById("durationRow").style.display = "none";
    }
    sumResume.textContent = localStorage.getItem("resumeName") || "Not uploaded";
}

// ----- Step Validations -----
function validateStep(step) {
    switch(step) {
        case 0: return validateName() && validateEmail() && validatePhone() && validateDOB();
        case 1: return validateQualification() && validateDegree() && validateGradYear() && validateTotalCgpa() && validateObtainedCgpa();
        case 2: return hasExp.value === "yes" ? validateCompany() && validateJobTitle() && validateDuration() : true;
        case 3: return validateSkills() && validateLanguage() && validateResume();
        default: return true;
    }
}
// ----- Field Validations -----
function validateName() {
    const val = nameInput.value.trim();

    if (!val) {
        nameError.textContent = "Name is required";
        nameInput.classList.add("input-error");
        return false;
    }
    if (val.length < 3 || !/^[A-Za-z\s]+$/.test(val)) {
        nameError.textContent = "Enter a valid name (min 3 letters)";
        nameInput.classList.add("input-error");
        return false;
    }

    nameError.textContent = "";
    nameInput.classList.remove("input-error");
    return true;
}
function validateEmail() {
    const val = emailInput.value.trim();

    if (!val) {
        emailError.textContent = "Email is required";
        emailInput.classList.add("input-error");
        return false;
    }

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(val)) {
        emailError.textContent = "Enter a valid email address";
        emailInput.classList.add("input-error");
        return false;
    }

    emailError.textContent = "";
    emailInput.classList.remove("input-error");
    return true;
}
function validatePhone() {
    const val = phoneInput.value.trim();

    if (!val) {
        phoneError.textContent = "Phone number is required";
        phoneInput.classList.add("input-error");
        return false;
    }

    const fullNumber = countryCode.value + val;
    try {
        const parsedNumber = libphonenumber.parsePhoneNumber(fullNumber);
        if (!parsedNumber.isValid()) throw new Error();

        phoneError.textContent = "";
        phoneInput.classList.remove("input-error");
        return true;

    } catch {
        phoneError.textContent = "Invalid phone number";
        phoneInput.classList.add("input-error");
        return false;
    }
}
  
function validateDOB() {
    const dobDate = new Date(dobInput.value);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();

    if (age < 15 || dobDate > today) {
        DOBError.textContent = "Age must be at least 15";
        dobInput.classList.add("input-error");
        return false;
    }
    DOBError.textContent = "";
    dobInput.classList.remove("input-error");
    return true;
}

function validateQualification() {
    if (!qualification.value) {
        qualError.textContent = "Select qualification";
        qualification.classList.add("input-error");
        return false;
    }
    qualError.textContent = "";
    qualification.classList.remove("input-error");
    return true;
}
function validateDegree() {
    if (!degree.value) {
        degreeError.textContent = "Select degree";
        degree.classList.add("input-error");
        return false;
    }
    degreeError.textContent = "";
    degree.classList.remove("input-error");
    return true;
}
function validateGradYear() {
    const val = gradYear.value.trim();
    const year = new Date().getFullYear();

    if (!/^\d{4}$/.test(val) || parseInt(val) > year) {
        yearError.textContent = "Enter valid year";
        gradYear.classList.add("input-error");
        return false;
    }
    yearError.textContent = "";
    gradYear.classList.remove("input-error");
    return true;
}
function validateTotalCgpa() {
    if (!totalCgpaSelect.value) {
        totalCgpaErr.textContent = "Select total CGPA";
        totalCgpaSelect.classList.add("input-error");
        return false;
    }
    totalCgpaErr.textContent = "";
    totalCgpaSelect.classList.remove("input-error");
    return true;
}
function validateObtainedCgpa() {
    const o = parseFloat(obtainedCgpa.value);
    const t = parseFloat(totalCgpaSelect.value);

    if (!totalCgpaSelect.value) {
        totalCgpaErr.textContent = "Select total CGPA first";
        totalCgpaSelect.classList.add("input-error");
        return false;
    }

    if (isNaN(o)) {
        obtCgpaErr.textContent = "Enter your obtained CGPA";
        obtainedCgpa.classList.add("input-error");
        return false;
    }
    if (o < 0 || o > t) {
        obtCgpaErr.textContent = "Obtained CGPA cannot be more than total";
        obtainedCgpa.classList.add("input-error");
        return false;
    }
    obtCgpaErr.textContent = "";
    obtainedCgpa.classList.remove("input-error");
    return true;
}


function validateCompany() {
    if (!companyName.value.trim()) {
        compError.textContent = "Company name required";
        companyName.classList.add("input-error");
        return false;
    }
    compError.textContent = "";
    companyName.classList.remove("input-error");
    return true;
}
function validateJobTitle() {
    if (!jobTitle.value.trim()) {
        jobError.textContent = "Job title required";
        jobTitle.classList.add("input-error");
        return false;
    }
    jobError.textContent = "";
    jobTitle.classList.remove("input-error");
    return true;
}
function validateDuration() {
    const val = duration.value.trim();
    if (!val) {
        durError.textContent = "Duration required";
        duration.classList.add("input-error");
        return false;
    }
    durError.textContent = "";
    duration.classList.remove("input-error");
    return true;
}
function validateSkills() {
    if (!skillsInput.value.trim()) {
        skillError.textContent = "Enter skills";
        skillsInput.classList.add("input-error");
        return false;
    }
    skillError.textContent = "";
    skillsInput.classList.remove("input-error");
    return true;
}
function validateLanguage() {
    const selected = Array.from(languageRadios).some(r => r.checked);

    if (!selected) {
        langError.textContent = "Select language";
        return false;
    }
    langError.textContent = "";
    return true;
}
function validateResume() {
    const file = resumeInput.files[0];
    if(!file){ resumeError.textContent = "Resume required"; resumeInput.classList.add("input-error"); return false; }
    const types = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if(!types.includes(file.type)){ resumeError.textContent = "Only PDF/DOC allowed"; resumeInput.classList.add("input-error"); return false; }
    if(file.size > 3*1024*1024){ resumeError.textContent = "Max size 3MB"; resumeInput.classList.add("input-error"); return false; }
    resumeError.textContent = ""; resumeInput.classList.remove("input-error"); saveToLocal("resumeName", file.name); return true;
}

// ----- Experience Fields Toggle -----
// Function to show/hide experience fields
function toggleExperienceFields() {
    experienceFields.style.display = hasExp.value === "yes" ? "block" : "none";
}

// Restore saved value from localStorage (if any)
const savedExp = localStorage.getItem("hasExp");
if (savedExp) {
    hasExp.value = savedExp;
}

// Initial toggle on page load
toggleExperienceFields();

// Listen for changes and save to localStorage
hasExp.addEventListener("change", () => {
    toggleExperienceFields();
    localStorage.setItem("hasExp", hasExp.value);
});


// ----- Autosave -----
nameInput.addEventListener("input", e => { validateName(); saveToLocal("name", e.target.value); });
emailInput.addEventListener("input", e => { validateEmail(); saveToLocal("email", e.target.value); });
phoneInput.addEventListener("input", e => { validatePhone(); saveToLocal("phone", e.target.value); });
countryCode.addEventListener("change", e => { saveToLocal("countryCode", e.target.value); });
dobInput.addEventListener("input", e => { validateDOB(); saveToLocal("dob", e.target.value); });

qualification.addEventListener("change", e => { validateQualification(); saveToLocal("qualification", e.target.value); });
degree.addEventListener("change", e => { validateDegree(); saveToLocal("degree", e.target.value); });
gradYear.addEventListener("input", e => { validateGradYear(); saveToLocal("gradYear", e.target.value); });
totalCgpaSelect.addEventListener("change", e => { validateTotalCgpa(); saveToLocal("totalCgpa", e.target.value); });
obtainedCgpa.addEventListener("input", e => { validateObtainedCgpa(); saveToLocal("obtained", e.target.value); });

companyName.addEventListener("change", e => { validateCompany(); saveToLocal("companyName", e.target.value); });
jobTitle.addEventListener("change", e => { validateJobTitle(); saveToLocal("jobTitle", e.target.value); });
duration.addEventListener("input", e => { validateDuration(); saveToLocal("duration", e.target.value); });

skillsInput.addEventListener("input", e => { validateSkills(); saveToLocal("skills", e.target.value); });
languageRadios.forEach(r => r.addEventListener("change", e => { validateLanguage(); saveToLocal("language", e.target.value); }));
resumeInput.addEventListener("change", () => { validateResume(); if(resumeInput.files[0]) saveToLocal("resumeName", resumeInput.files[0].name); });

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

//----- Prevent Duplicate Submission -----
(function checkSubmitted() {
    const email = localStorage.getItem("email");
    if(email && localStorage.getItem("submitted-" + email)) {
        submittedMsg.style.display = "block";
        document.getElementById("multiForm").style.display = "none";
    }
})();

// ----- Form Submission -----
document.getElementById("multiForm").addEventListener("submit", async e => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if(!email) return showToast("Email missing!", "error");

    localStorage.setItem("submitted-" + email, "true");

    const formData = new FormData();
    formData.append('name', nameInput.value);
    formData.append('email', emailInput.value);
    formData.append('phone', phoneInput.value);
    formData.append('countryCode', countryCode.value);
    formData.append('dob', dobInput.value);
    formData.append('qualification', qualification.value);
    formData.append('degree', degree.value);
    formData.append('gradYear', gradYear.value);
    formData.append('totalCgpa', totalCgpaSelect.value);
    formData.append('obtainedCgpa', obtainedCgpa.value);
    formData.append('skills', skillsInput.value);
    formData.append('language', Array.from(languageRadios).find(r => r.checked)?.value || '');
    formData.append('hasExp', hasExp.value);
    formData.append('companyName', companyName.value);
    formData.append('jobTitle', jobTitle.value);
    formData.append('duration', duration.value);
    if(resumeInput.files[0]) formData.append('resume', resumeInput.files[0]);

    try {
        const res = await fetch('https://multi-step-form-with-progress-indic-peach.vercel.app/submit', { method: 'POST', body: formData });
        const data = await res.json();
        if(data.success){
            submittedMsg.style.display = "block";
            document.getElementById("multiForm").style.display = "none";
            showToast('Form submitted and saved to DB!', 'success');
        } else {
            showToast('Submission failed: ' + (data.error || 'Unknown error'), 'error');
        }
    } catch(err) {
        console.error(err);
        showToast('Server error', 'error');
    }
});

