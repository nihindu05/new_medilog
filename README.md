

````md
# 🩺 MedLogs — Forensic Medicine Department Information System

<div align="center">

### Secure • Accurate • Accountable Medico-Legal Records

MedLogs is a forensic medicine database management system designed to digitize and streamline patient/victim registration, case management, forensic examinations, evidence tracking, laboratory requests, document storage, and medico-legal report workflows.

<br />

![Status](https://img.shields.io/badge/Status-In%20Development-blue)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-orange)
![Database](https://img.shields.io/badge/Database-MySQL-lightgrey)
![Project](https://img.shields.io/badge/Project-Forensic%20Medicine%20DBMS-purple)
![Security](https://img.shields.io/badge/Security-RBAC%20%7C%20Audit%20Logs-red)

</div>

---

## 📌 Project Overview

**MedLogs** is a web-based information system developed for a **Forensic Medicine Department / JMO Office**.

Many forensic medicine departments still depend on paper files, handwritten registers, physical storage rooms, scanned PDFs, and separately stored photographs or lab reports. This makes it difficult to search old records, maintain confidentiality, track evidence, generate court reports, and preserve records safely for long-term medico-legal use.

MedLogs aims to solve these problems by providing a centralized digital platform for managing:

- Living victim / patient records
- Deceased person records
- Clinical forensic cases
- Autopsy / postmortem cases
- Examination findings
- Injury documentation
- Body diagram marking
- Evidence and sample tracking
- Chain of custody
- Laboratory and toxicology workflow
- Police and court information
- Document storage
- Medico-legal report generation
- User roles and audit logs

---

## 🎯 Main Objective

The main objective of this project is to create a secure, reliable, and user-friendly database system that supports the complete medico-legal workflow of a forensic medicine department.

The system is designed around three key ideas:

```text
Patient Page      = Who is the person?
Case Page         = Why did the person/body come to JMO?
Examination Page  = What did the doctor find?
````

---

## 🧭 System Workflow

```text
Login
  ↓
Dashboard
  ↓
Patient / Victim Management
  ↓
Case Management
  ↓
Examination Forms
  ↓
Evidence & Samples
  ↓
Lab / Toxicology
  ↓
Documents
  ↓
Reports
  ↓
Approval / Dispatch
  ↓
Audit Logs / Statistics
```

---

## 🏥 Core Modules

### 1. Patient / Victim Management

This module manages personal and demographic information of both living victims and deceased persons.

#### Key Features

* Register living victims / patients
* Register deceased persons
* Generate unique Patient/Victim ID
* Store NIC/passport, DOB, age, gender, address, contact details
* Store hospital number and BHT number
* Store nationality and ethnicity
* Record next of kin details
* Separate forms for:

  * Living patients
  * Deceased persons
* Search patient/victim records
* View linked forensic cases

---

### 2. Case Management

This module manages medico-legal cases linked to patients or deceased persons.

#### Supported Case Types

| Case Type                 | Example ID       |
| ------------------------- | ---------------- |
| Clinical Case             | `CL-2026-000123` |
| Autopsy / Postmortem Case | `PM-2026-000045` |

#### Clinical Case Categories

* Accident
* Assault
* Sexual assault
* Toxicology
* Detainee examination
* Age estimation
* DNA sampling

#### Autopsy Case Categories

* Natural death
* Accidental death
* Suicidal death
* Homicidal death
* Undetermined death

#### Key Features

* Register clinical and autopsy cases
* Store MLEF details
* Store PM registry details
* Store inquest/court order details
* Store police station and officer details
* Store court and magistrate/ISD details
* Assign JMO / doctor
* Track case status
* View full case details

---

### 3. Examination Forms

This module is used by the JMO or medical officer to record actual forensic examination findings.

#### Key Features

* Select an existing case
* Auto-load patient and case summary
* Separate forms for:

  * Clinical examination
  * Autopsy / postmortem examination
* Record examination date, time, place, and doctor
* Record patient condition and history
* Record injury findings
* Record postmortem changes
* Record internal organ findings
* Record doctor opinion
* Save examination as draft or completed

#### Digital Body Diagram Marking

One of the main features of this module is the **digital body diagram marking system**.

Doctors can mark injuries directly on a front/back body diagram using the screen.

Features include:

* Front body diagram
* Back body diagram
* Click-to-add injury markers
* Numbered injury markers
* Link each marker to an injury record
* Store body region and coordinates
* Upload scanned/manual body diagram if needed

This improves the manual body diagram process by making injury locations searchable, structured, and report-ready.

---

### 4. Evidence & Samples

This module manages forensic samples and evidence collected during examinations.

#### Key Features

* Select an existing examination
* Register biological samples and physical evidence
* Store sample type, quantity, container type, and body source
* Record collected date/time and collected officer
* Store seal number and barcode number
* Track storage condition and storage location
* Prepare lab request details
* Add chain of custody events
* Upload evidence-related files or photographs
* View full evidence register

#### Sample Types

* Blood
* Urine
* Swabs
* DNA
* Hair
* Nails
* Vitreous humor
* Stomach contents
* Clothing
* Photographs
* X-ray / CT reference
* Histology tissue
* Toxicology sample

---

### 5. Lab / Toxicology

This module is planned to manage laboratory requests and results.

#### Planned Features

* Create lab requests from registered samples
* Assign laboratory
* Record requested test type
* Track request status
* Store lab result summary
* Upload result documents
* Link results to reports

---

### 6. Documents

This module is planned as a secure digital document cabinet.

#### Document Types

* MLEF
* Inquest order
* Court order
* Consent form
* Hospital admission record
* Police statement
* Clinical photographs
* Autopsy photographs
* Body diagram scans
* X-ray / CT reports
* Toxicology reports
* Histology reports
* MLR
* PMR
* Cause of death form
* Court receipt

---

### 7. Reports

This module is planned to generate official medico-legal reports.

#### Supported Reports

* Medico-Legal Report — MLR
* Postmortem Report — PMR
* Cause of Death Form — COD
* Toxicology Report
* Supplementary Report
* Monthly Statistics
* Annual Summary Report

#### Planned Report Workflow

```text
Draft
  ↓
Pending Approval
  ↓
Approved
  ↓
Submitted
  ↓
Amended, if required
```

---

## 🔐 Security Features

MedLogs is designed for highly sensitive medico-legal data. Therefore, security is a core part of the project.

### Security Goals

* Protect sensitive information
* Prevent unauthorized access
* Maintain accurate data
* Ensure continuous availability
* Detect and respond to attacks
* Comply with legal and privacy requirements

### Planned Security Controls

* Role-based access control
* Strong password hashing
* Confidentiality levels
* Restricted access for minor cases
* Restricted access for sexual assault cases
* Audit logs for all important actions
* Report versioning
* Document checksum verification
* Account locking after failed login attempts
* Backup and recovery support

---

## 👥 User Roles

| Role                          | Main Responsibilities                                     |
| ----------------------------- | --------------------------------------------------------- |
| System Administrator          | Manage users, roles, audit logs, system settings          |
| Consultant JMO                | Review cases, conduct examinations, approve reports       |
| Medical Officer / MOML / AJMO | Conduct assigned examinations and draft reports           |
| Clerk / Typist                | Register patients, cases, documents, and dispatch records |
| Lab Staff                     | Manage lab requests and enter lab results                 |
| Police Liaison                | View cases linked to police requests                      |
| Court / Legal Officer         | View submitted reports and court-related records          |

---

## 🗄️ Main Database Tables

The system is designed using a relational database model.

Main tables include:

```text
PATIENT_VICTIM
LIVING_PATIENT_DETAILS
DECEASED_PERSON_DETAILS
NEXT_OF_KIN
FORENSIC_CASE
CLINICAL_CASE_DETAILS
AUTOPSY_CASE_DETAILS
CASE_REFERRAL
COURT_CASE
CASE_DOCTOR
EXAMINATION
INJURY
BODY_DIAGRAM_MARKING
INTERNAL_FINDING
SAMPLE_EVIDENCE
CHAIN_OF_CUSTODY
LAB_REQUEST
LAB_RESULT
CASE_DOCUMENT
REPORT
REPORT_VERSION
REPORT_SIGNATORY
REPORT_DISPATCH
USER_ACCOUNT
USER_ROLE
ROLE
AUDIT_LOG
```

---

## 🧩 Current Completed Pages

| Page                        | Status                  |
| --------------------------- | ----------------------- |
| Login Page                  | Completed / In Progress |
| Dashboard                   | Planned / Partial       |
| Patient / Victim Management | Completed               |
| Case Management             | Completed               |
| Examination Forms           | Completed               |
| Evidence & Samples          | Completed               |
| Lab / Toxicology            | Planned                 |
| Documents                   | Planned                 |
| Reports                     | Planned                 |
| Audit Logs                  | Planned                 |
| Statistics                  | Planned                 |

---

## 🖥️ Frontend Pages

Current page structure:

```text
Codes/
│
├── Pages/
│   ├── PatientManagement.html
│   ├── CaseManagement.html
│   ├── ExaminationForms.html
│   └── EvidenceSamples.html
│
├── css/
│   ├── PatientManagement.css
│   ├── CaseManagement.css
│   ├── ExaminationForms.css
│   └── EvidenceSamples.css
│
├── Js/
│   ├── PatientManagement.js
│   ├── CaseManagement.js
│   ├── ExaminationForms.js
│   └── EvidenceSamples.js
│
└── images/
    └── medlogs-logo.png
```

---

## 🔗 Page Connection Logic

The website uses IDs to move between pages.

Example:

```text
ExaminationForms.html?caseId=CL-2026-000123
```

```text
EvidenceSamples.html?caseId=CL-2026-000123&examId=EXAM-2026-000001
```

```text
LabToxicology.html?caseId=CL-2026-000123&examId=EXAM-2026-000001&sampleId=SMP-2026-000001
```

This prevents duplicate data entry and keeps the system connected.

---

## 💾 Demo Data Storage

Currently, the frontend demo uses `localStorage`.

Used storage keys:

```js
fmdis_patients_v1
fmdis_cases_v2
fmdis_examinations_v1
fmdis_evidence_samples_v1
```

Later, these will be replaced with backend API calls.

Example future backend routes:

```text
GET    /api/patients
POST   /api/patients
GET    /api/cases
POST   /api/cases
GET    /api/examinations
POST   /api/examinations
GET    /api/evidence
POST   /api/evidence
GET    /api/lab-results
POST   /api/lab-results
GET    /api/reports
POST   /api/reports
```

---

## ⚙️ Technologies Used

### Current Frontend

* HTML5
* CSS3
* JavaScript
* LocalStorage
* Responsive dashboard layout

### Planned Backend

* Node.js
* Express.js
* MySQL
* REST API
* JWT / session authentication
* Role-based access control

### Planned Tools

* GitHub
* GitHub Pages / Vercel
* MySQL Workbench
* VS Code

---

## 🚀 How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/navodap/MedLogs.git
```

### 2. Open the project folder

```bash
cd MedLogs
```

### 3. Open a page in the browser

Example:

```text
Codes/Pages/CaseManagement.html
```

or use GitHub Pages:

```text
https://navodap.github.io/MedLogs/Codes/Pages/CaseManagement.html
```

---

## 🌐 Deployment Notes

If CSS or JavaScript does not load on GitHub Pages, check file paths carefully.

Correct examples:

```html
<link rel="stylesheet" href="../css/CaseManagement.css" />
<script src="../Js/CaseManagement.js"></script>
```

GitHub Pages is case-sensitive.

So these are different:

```text
Js
js
```

Use the exact folder name used in the project.

---

## 📸 Screenshots

Add screenshots here after final UI testing.

```md
![Patient Management](./screenshots/patient-management.png)
![Case Management](./screenshots/case-management.png)
![Examination Forms](./screenshots/examination-forms.png)
![Evidence Samples](./screenshots/evidence-samples.png)
```

---

## 🧠 Why This Project Is Important

Forensic medicine records are not ordinary hospital records. They are medical, legal, and evidential documents.

A good forensic system must be:

```text
Accurate
Confidential
Traceable
Searchable
Legally reliable
Available for long-term use
```

MedLogs improves the manual system by reducing paper dependency, improving search speed, preserving documents, supporting evidence tracking, and maintaining accountability through audit logs.

---

## 🛣️ Future Improvements

* Backend API integration
* MySQL database connection
* Secure login system
* Role-based dashboards
* Full lab/toxicology module
* Document upload and secure file storage
* PDF report generation
* Digital signature support
* Report approval workflow
* Court dispatch tracking
* Audit log viewer
* Statistics dashboard
* Advanced body diagram drawing tools
* Offline data entry with sync
* Backup and restore module

---

## 👨‍💻 Development Team

This project is developed as part of the **CO2050 Database Systems Mini Project**.

**Department:** Computer Engineering
**Faculty:** Faculty of Engineering
**University:** University of Peradeniya

---

## 📜 License

This project is developed for academic purposes.

---

<div align="center">

## MedLogs

### Trusted Forensic Care. Reliable Medico-Legal Records.

</div>
```
