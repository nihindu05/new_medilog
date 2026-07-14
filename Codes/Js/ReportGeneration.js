const REPORT_STORAGE_KEY = "fmdis_reports_v1";
const CASE_STORAGE_KEY = "fmdis_cases_v2";
const EXAM_STORAGE_KEY = "fmdis_examinations_v1";
const EVIDENCE_STORAGE_KEY = "fmdis_evidence_samples_v1";
const LAB_STORAGE_KEY = "fmdis_lab_toxicology_v1";

const sampleCases = [
  {
    id: "CL-2026-000123",
    type: "clinical",
    category: "Assault",
    status: "Under Examination",
    patientId: "PV-2026-00124",
    patientName: "Wijesinghe, A. K.",
    patientAge: "17",
    patientGender: "Female",
    patientNic: "200912345678",
    patientBht: "BHT-12-2026-0091",
    confidentiality: "Restricted",
    primaryDoctor: "Dr. N. Perera",
    jmoOffice: "Colombo JMO Office",
    mlefNo: "MLEF/2026/145",
    policeStation: "Borella Police Station",
    policeOfficer: "PS 4521 A. Silva",
    policeRef: "BOR/CR/2026/321",
    courtName: "Colombo Magistrate Court",
    courtRef: "MC/2026/114",
    clinicalReason: "Physical assault examination",
    natureOfHarm: "Contusions and suspected fracture",
    natureOfWeapon: "Blunt object"
  },
  {
    id: "PM-2026-000045",
    type: "autopsy",
    category: "Accidental Death",
    status: "Report Drafting",
    patientId: "PV-2026-00126",
    patientName: "Fernando, R. T.",
    patientAge: "47",
    patientGender: "Male",
    patientNic: "197811223344",
    confidentiality: "Restricted",
    primaryDoctor: "Dr. H. Jayasinghe",
    jmoOffice: "Galle JMO Office",
    pmRegistryNo: "PM-REG-2026-045",
    inquestNo: "INQ/2026/310",
    courtOrderNo: "CO/2026/221",
    deathReportNo: "DR/2026/188",
    dateOfDeath: "2026-05-25",
    timeOfDeath: "21:30",
    placeOfDeath: "Road traffic scene",
    placeOfPM: "Galle Mortuary",
    policeStation: "Galle Police Station",
    policeOfficer: "IP 2210 D. Kumara",
    policeRef: "GAL/ACC/2026/056",
    courtName: "Galle Magistrate Court",
    courtRef: "MC-GAL/2026/77",
    mannerOfDeath: "Accidental",
    causeSummary: "Pending histology and toxicology. Preliminary findings suggest blunt force injuries."
  }
];

const sampleExaminations = [
  {
    id: "EXAM-2026-000001",
    caseId: "CL-2026-000123",
    patientId: "PV-2026-00124",
    patientName: "Wijesinghe, A. K.",
    caseType: "clinical",
    caseCategory: "Assault",
    examType: "Clinical Forensic Examination",
    status: "Completed",
    examDateTime: "2026-05-27T09:30",
    examPlace: "JMO Office - Colombo",
    createdBy: "Dr. N. Perera",
    primaryDoctor: "Dr. N. Perera",
    assistingDoctor: "",
    supervisingConsultant: "Dr. S. Fernando",
    privacyLevel: "Restricted",
    clinical: {
      patientCondition: "Stable",
      consciousnessLevel: "Alert",
      alcoholObservation: "Not suspected",
      drugObservation: "Not suspected",
      historyGiven: "Patient states she was assaulted with a blunt object. Injuries were documented for medico-legal opinion.",
      generalAppearance: "Patient was conscious, cooperative and complained of pain over left forearm and right cheek."
    },
    autopsy: {},
    diagramMarkers: [
      { id: "M1", view: "front", x: 38, y: 43, bodyRegion: "Left Arm", injuryId: "INJ-001" },
      { id: "M2", view: "front", x: 57, y: 18, bodyRegion: "Face / Head", injuryId: "INJ-002" }
    ],
    injuries: [
      { id: "INJ-001", markerId: "M1", type: "Abrasion", bodyLocation: "Left forearm", side: "Left", length: "3", width: "1", depth: "", description: "Superficial fresh abrasion on left forearm.", injuryAge: "Fresh", severity: "Non-Grievous", weaponOpinion: "Blunt force possible", isFatal: "No" },
      { id: "INJ-002", markerId: "M2", type: "Contusion", bodyLocation: "Right cheek", side: "Right", length: "2", width: "2", depth: "", description: "Fresh contusion over right cheek.", injuryAge: "Fresh", severity: "Minor", weaponOpinion: "Blunt force possible", isFatal: "No" }
    ],
    organFindings: [],
    samples: ["Photographs", "X-ray / CT"],
    doctorOpinion: "Observed injuries are consistent with blunt force trauma. Final opinion pending radiology report.",
    generalNotes: "Clinical photographs taken. X-ray requested."
  },
  {
    id: "EXAM-2026-000002",
    caseId: "PM-2026-000045",
    patientId: "PV-2026-00126",
    patientName: "Fernando, R. T.",
    caseType: "autopsy",
    caseCategory: "Accidental Death",
    examType: "Postmortem / Autopsy Examination",
    status: "Pending Lab Results",
    examDateTime: "2026-05-26T12:00",
    examPlace: "Galle Mortuary",
    createdBy: "Dr. H. Jayasinghe",
    primaryDoctor: "Dr. H. Jayasinghe",
    assistingDoctor: "Dr. A. Silva",
    privacyLevel: "Restricted",
    clinical: {},
    autopsy: {
      identificationConfirmed: "Yes",
      bodyCondition: "Fresh",
      rigorMortis: "Established",
      livorMortis: "Present and fixed",
      decompositionStage: "None",
      estimatedTimeSinceDeath: "12-18 hours",
      mannerOfDeath: "Accidental",
      clothingDescription: "Clothing preserved and handed over with police reference.",
      externalAppearance: "Multiple external injuries suggestive of road traffic trauma.",
      causeOfDeathSummary: "Pending toxicology and histology. Preliminary findings suggest blunt force injuries."
    },
    diagramMarkers: [
      { id: "M1", view: "front", x: 50, y: 35, bodyRegion: "Chest / Upper abdomen", injuryId: "INJ-001" }
    ],
    injuries: [
      { id: "INJ-001", markerId: "M1", type: "Contusion", bodyLocation: "Anterior chest", side: "Midline", length: "8", width: "5", depth: "", description: "Large contusion over anterior chest wall.", injuryAge: "Fresh", severity: "Life Threatening", weaponOpinion: "Blunt force possible", isFatal: "Undetermined" }
    ],
    organFindings: [
      { id: "ORG-001", organName: "Lungs", findingDescription: "Congestion noted bilaterally.", pathologicalCondition: "Congestion" },
      { id: "ORG-002", organName: "Heart", findingDescription: "No gross rupture observed. Further histology pending.", pathologicalCondition: "Pending histology" }
    ],
    samples: ["Blood", "Urine", "Vitreous Humor", "Stomach Contents", "Histology", "Toxicology", "Photographs"],
    doctorOpinion: "Preliminary opinion kept pending until toxicology and histology reports are received.",
    generalNotes: "Samples sealed and retained for evidence registration."
  }
];

const sampleEvidence = [
  {
    id: "SMP-2026-000001",
    caseId: "PM-2026-000045",
    examId: "EXAM-2026-000002",
    patientName: "Fernando, R. T.",
    sampleType: "Blood",
    evidenceCategory: "Biological Sample",
    sealNo: "SEAL/GAL/2026/045-A",
    sampleStatus: "Stored",
    labRequired: "Yes",
    requestedTests: ["Alcohol", "Poison / Toxicology"]
  },
  {
    id: "SMP-2026-000002",
    caseId: "CL-2026-000123",
    examId: "EXAM-2026-000001",
    patientName: "Wijesinghe, A. K.",
    sampleType: "Photographs",
    evidenceCategory: "Photographic Evidence",
    sealNo: "DIGI/CL/2026/123-PHOTO",
    sampleStatus: "Archived",
    labRequired: "No",
    requestedTests: []
  }
];

const dom = {
  tabButtons: document.querySelectorAll(".tab-btn"),
  generatePanel: document.getElementById("generatePanel"),
  recordsPanel: document.getElementById("recordsPanel"),
  sourceSearchInput: document.getElementById("sourceSearchInput"),
  examinationSelect: document.getElementById("examinationSelect"),
  sourceSummaryPanel: document.getElementById("sourceSummaryPanel"),
  reportForm: document.getElementById("reportForm"),
  reportId: document.getElementById("reportId"),
  reportCaseId: document.getElementById("reportCaseId"),
  reportPatientId: document.getElementById("reportPatientId"),
  reportType: document.getElementById("reportType"),
  reportStatus: document.getElementById("reportStatus"),
  issueDate: document.getElementById("issueDate"),
  officeName: document.getElementById("officeName"),
  preparedBy: document.getElementById("preparedBy"),
  approvedBy: document.getElementById("approvedBy"),
  dispatchTo: document.getElementById("dispatchTo"),
  readinessWarnings: document.getElementById("readinessWarnings"),
  historyNarrative: document.getElementById("historyNarrative"),
  findingsNarrative: document.getElementById("findingsNarrative"),
  labNarrative: document.getElementById("labNarrative"),
  opinionNarrative: document.getElementById("opinionNarrative"),
  conclusionNarrative: document.getElementById("conclusionNarrative"),
  amendmentReason: document.getElementById("amendmentReason"),
  reportPreview: document.getElementById("reportPreview"),
  btnAutoGenerate: document.getElementById("btnAutoGenerate"),
  btnRefreshPreview: document.getElementById("btnRefreshPreview"),
  btnPrintReport: document.getElementById("btnPrintReport"),
  btnSaveDraft: document.getElementById("btnSaveDraft"),
  btnSubmitApproval: document.getElementById("btnSubmitApproval"),
  btnApproveReport: document.getElementById("btnApproveReport"),
  btnDispatchReport: document.getElementById("btnDispatchReport"),
  clearFormBtn: document.getElementById("clearFormBtn"),
  reportSearch: document.getElementById("reportSearch"),
  reportStatusFilter: document.getElementById("reportStatusFilter"),
  reportTableBody: document.getElementById("reportTableBody"),
  reportEmptyMessage: document.getElementById("reportEmptyMessage"),
  fullReportDetailsContainer: document.getElementById("fullReportDetailsContainer"),
  recentReportBody: document.getElementById("recentReportBody"),
  totalReportStat: document.getElementById("totalReportStat"),
  draftReportStat: document.getElementById("draftReportStat"),
  approvedReportStat: document.getElementById("approvedReportStat"),
  globalSearch: document.getElementById("globalReportSearch"),
  menuBtn: document.querySelector(".menu-btn"),
  sidebar: document.querySelector(".sidebar"),
  sidebarOverlay: document.getElementById("sidebarOverlay"),
  dateDisplay: document.getElementById("currentDateDisplay"),
  dayDisplay: document.getElementById("currentDayDisplay")
};

let caseRecords = loadRecords(CASE_STORAGE_KEY, sampleCases);
let examinationRecords = loadRecords(EXAM_STORAGE_KEY, sampleExaminations);
let evidenceRecords = loadRecords(EVIDENCE_STORAGE_KEY, sampleEvidence);
let labRecords = loadRecords(LAB_STORAGE_KEY, []);
let reportRecords = loadRecords(REPORT_STORAGE_KEY, []);
let selectedExam = null;
let selectedCase = null;
let selectedReportId = null;
let currentReportFilter = "all";
let lastSavedReport = null;

function loadRecords(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : [...fallback];
  } catch (error) {
    console.warn(`${key} could not be loaded. Fallback data was used.`, error);
    return [...fallback];
  }
}

function saveReports() {
  localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(reportRecords));
}

function pad(number, size = 6) {
  return String(number).padStart(size, "0");
}

function currentYear() {
  return new Date().getFullYear();
}

function generateReportId() {
  const year = currentYear();
  const sameYear = reportRecords.filter(report => report.id && report.id.startsWith(`RPT-${year}-`));
  const next = sameYear.length
    ? Math.max(...sameYear.map(report => Number(report.id.split("-").pop()) || 0)) + 1
    : 1;
  return `RPT-${year}-${pad(next)}`;
}

function localDateValue(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function localDateTimeValue(date = new Date()) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function value(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

function setValue(id, input) {
  const element = document.getElementById(id);
  if (element) element.value = input ?? "";
}

function display(input) {
  return input && String(input).trim() ? input : "Not recorded";
}

function escapeHtml(input) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function paragraphize(input) {
  const safe = escapeHtml(display(input));
  return safe.split("\n").map(line => `<p>${line || "&nbsp;"}</p>`).join("");
}

function formatDate(input) {
  if (!input) return "Not recorded";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  const hasTime = String(input).includes("T");
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: hasTime ? "2-digit" : undefined,
    minute: hasTime ? "2-digit" : undefined
  });
}

function updateTopbarLiveDate() {
  const now = new Date();
  dom.dateDisplay.textContent = now.toLocaleDateString(undefined, { month: "long", day: "2-digit", year: "numeric" });
  dom.dayDisplay.textContent = now.toLocaleDateString(undefined, { weekday: "long" });
}

function findCase(caseId) {
  return caseRecords.find(record => record.id === caseId) || null;
}

function findExam(examId) {
  return examinationRecords.find(record => record.id === examId) || null;
}

function typeLabel(type) {
  return type === "autopsy" ? "Autopsy / PM" : "Clinical";
}

function reportTypeLabel(type) {
  const map = {
    MLR: "Medico-Legal Report",
    PMR: "Postmortem Report",
    COD: "Cause of Death Form",
    SUPPLEMENTARY: "Supplementary Report"
  };
  return map[type] || type || "Report";
}

function statusClass(status) {
  if (["Approved", "Dispatched", "Locked"].includes(status)) return "success";
  if (["Pending Approval", "Amended"].includes(status)) return "warn";
  if (["Draft"].includes(status)) return "purple";
  return "light";
}

function mainReference(caseRecord) {
  if (!caseRecord) return "";
  if (caseRecord.type === "autopsy") {
    return caseRecord.pmRegistryNo || caseRecord.inquestNo || caseRecord.courtOrderNo || caseRecord.policeRef || "Not recorded";
  }
  return caseRecord.mlefNo || caseRecord.mlrSerialNo || caseRecord.policeRef || "Not recorded";
}

function sourceEvidence(caseId, examId) {
  return evidenceRecords.filter(record => record.caseId === caseId || record.examId === examId);
}

function sourceLab(caseId, examId) {
  return labRecords.filter(record => record.caseId === caseId || record.examId === examId || record.sampleId);
}

function populateExaminationSelect(filter = "") {
  const query = filter.toLowerCase().trim();
  const filtered = examinationRecords.filter(exam => {
    if (!query) return true;
    const caseRecord = findCase(exam.caseId);
    return [
      exam.id,
      exam.caseId,
      exam.patientId,
      exam.patientName,
      exam.caseCategory,
      exam.examType,
      exam.primaryDoctor,
      exam.status,
      caseRecord?.mlefNo,
      caseRecord?.pmRegistryNo,
      caseRecord?.inquestNo,
      caseRecord?.policeRef
    ].join(" ").toLowerCase().includes(query);
  });

  dom.examinationSelect.innerHTML = `
    <option value="">Select examination</option>
    ${filtered.map(exam => `
      <option value="${exam.id}">${exam.id} • ${exam.caseId} • ${display(exam.patientName)} • ${typeLabel(exam.caseType)}</option>
    `).join("")}
  `;
}

function renderSourceSummary() {
  if (!selectedExam) {
    dom.sourceSummaryPanel.innerHTML = `
      <div class="preview-empty compact-empty">
        <div><span>⌕</span><h4>No source selected</h4><p>Select an examination to load patient, case, injury, evidence and lab information.</p></div>
      </div>
    `;
    return;
  }

  const evidence = sourceEvidence(selectedExam.caseId, selectedExam.id);
  const lab = sourceLab(selectedExam.caseId, selectedExam.id);

  dom.sourceSummaryPanel.innerHTML = `
    <div class="selected-case-summary">
      <div class="summary-main">
        <small>Report Source</small>
        <strong>${selectedExam.id}</strong>
        <span class="badge ${selectedExam.caseType === "clinical" ? "success" : "warn"}">${typeLabel(selectedExam.caseType)}</span>
        <span class="badge ${statusClass(selectedExam.status)}">${display(selectedExam.status)}</span>
      </div>
      <div class="summary-cell"><small>Case / Patient</small><span>${display(selectedExam.caseId)}<br>${display(selectedExam.patientName)} • ${display(selectedExam.patientId)}</span></div>
      <div class="summary-cell"><small>Reference</small><span>${display(mainReference(selectedCase))}</span></div>
      <div class="summary-cell"><small>Doctor</small><span>${display(selectedExam.primaryDoctor)}</span></div>
      <div class="summary-cell"><small>Police</small><span>${display(selectedCase?.policeStation)}<br>${display(selectedCase?.policeRef)}</span></div>
      <div class="summary-cell"><small>Court</small><span>${display(selectedCase?.courtName)}<br>${display(selectedCase?.courtRef)}</span></div>
      <div class="summary-cell"><small>Findings</small><span>${selectedExam.injuries?.length || 0} injuries<br>${selectedExam.organFindings?.length || 0} internal findings</span></div>
      <div class="summary-cell"><small>Evidence / Lab</small><span>${evidence.length} evidence records<br>${lab.length} lab records</span></div>
      <div class="summary-cell"><small>Confidentiality</small><span>${display(selectedExam.privacyLevel || selectedCase?.confidentiality)}</span></div>
    </div>
  `;
}

function updateReportTypeOptions() {
  const current = dom.reportType.value;
  const type = selectedExam?.caseType || selectedCase?.type || "clinical";
  const options = type === "autopsy"
    ? [
        ["PMR", "PMR - Postmortem Report"],
        ["COD", "COD - Cause of Death Form"],
        ["SUPPLEMENTARY", "Supplementary Report"]
      ]
    : [
        ["MLR", "MLR - Medico-Legal Report"],
        ["SUPPLEMENTARY", "Supplementary Report"]
      ];

  dom.reportType.innerHTML = options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
  if (options.some(([value]) => value === current)) dom.reportType.value = current;
}

function selectExamination(examId) {
  selectedExam = findExam(examId);
  selectedCase = selectedExam ? findCase(selectedExam.caseId) : null;

  if (!selectedExam) {
    setValue("reportCaseId", "");
    setValue("reportPatientId", "");
    renderSourceSummary();
    renderReadinessWarnings();
    return;
  }

  setValue("reportCaseId", selectedExam.caseId);
  setValue("reportPatientId", selectedExam.patientId);
  setValue("preparedBy", selectedExam.primaryDoctor || selectedCase?.primaryDoctor || "");
  setValue("approvedBy", selectedExam.supervisingConsultant || "");
  setValue("dispatchTo", selectedCase?.courtName || selectedCase?.policeStation || "");

  updateReportTypeOptions();
  renderSourceSummary();
  renderReadinessWarnings();
}

function renderReadinessWarnings() {
  const warnings = [];

  if (!selectedExam) warnings.push("No examination selected.");
  if (selectedExam && selectedExam.status !== "Completed" && selectedExam.status !== "Pending Lab Results") {
    warnings.push(`Examination status is ${selectedExam.status}. Final report should usually wait until examination is complete.`);
  }

  if (selectedExam?.caseType === "clinical") {
    if (!selectedCase?.mlefNo) warnings.push("MLEF number is missing for clinical MLR.");
    if (!selectedExam?.injuries?.length) warnings.push("No injury findings recorded for clinical report.");
    if (!selectedExam?.doctorOpinion) warnings.push("Doctor opinion is missing from examination form.");
  }

  if (selectedExam?.caseType === "autopsy") {
    if (!selectedCase?.pmRegistryNo) warnings.push("PM registry number is missing.");
    if (!selectedCase?.inquestNo && !selectedCase?.courtOrderNo) warnings.push("Inquest number or court order number is missing.");
    if (!selectedExam?.organFindings?.length && dom.reportType.value !== "COD") warnings.push("No internal organ findings recorded for PMR.");
    if (!selectedExam?.autopsy?.causeOfDeathSummary && dom.reportType.value === "COD") warnings.push("Cause of death summary is missing for COD form.");
  }

  const evidence = selectedExam ? sourceEvidence(selectedExam.caseId, selectedExam.id) : [];
  if (selectedExam?.samples?.length && !evidence.length) warnings.push("Samples were marked during examination but no evidence records were found.");

  if (!warnings.length) {
    dom.readinessWarnings.innerHTML = `<div class="warning-item success"><span>✓</span><div>Critical source data is available. Report can be drafted.</div></div>`;
    return;
  }

  dom.readinessWarnings.innerHTML = warnings.map(item => `
    <div class="warning-item"><span>⚠</span><div>${escapeHtml(item)}</div></div>
  `).join("");
}

function injurySummary(exam = selectedExam) {
  const injuries = exam?.injuries || [];
  if (!injuries.length) return "No structured injury findings were recorded.";

  return injuries.map((injury, index) => {
    const size = [injury.length, injury.width, injury.depth].filter(Boolean).join(" × ");
    const sizeText = size ? ` measuring ${size} cm` : "";
    const marker = injury.markerId ? `Marker ${injury.markerId}: ` : "";
    return `${index + 1}. ${marker}${display(injury.type)} at ${display(injury.bodyLocation)}${sizeText}. ${display(injury.description)} Severity: ${display(injury.severity)}. Weapon opinion: ${display(injury.weaponOpinion)}.`;
  }).join("\n");
}

function organSummary(exam = selectedExam) {
  const findings = exam?.organFindings || [];
  if (!findings.length) return "No structured internal organ findings were recorded.";

  return findings.map((finding, index) => {
    return `${index + 1}. ${display(finding.organName)}: ${display(finding.findingDescription)} Pathological condition: ${display(finding.pathologicalCondition)}.`;
  }).join("\n");
}

function evidenceSummary() {
  const records = selectedExam ? sourceEvidence(selectedExam.caseId, selectedExam.id) : [];
  if (!records.length) return "No official evidence/sample register records were found for this examination.";

  return records.map((record, index) => {
    const tests = record.requestedTests?.length ? ` Requested tests: ${record.requestedTests.join(", ")}.` : "";
    return `${index + 1}. ${display(record.sampleType)} (${display(record.evidenceCategory)}) - Seal No: ${display(record.sealNo)}, Status: ${display(record.sampleStatus)}, Lab required: ${display(record.labRequired)}.${tests}`;
  }).join("\n");
}

function labSummary() {
  const records = selectedExam ? sourceLab(selectedExam.caseId, selectedExam.id) : [];
  if (!records.length) return "No lab or toxicology result was available at the time of report generation.";

  return records.map((record, index) => {
    return `${index + 1}. ${display(record.testType || record.labTestType || "Lab test")}: ${display(record.resultSummary || record.result || record.status)}.`;
  }).join("\n");
}

function generateNarratives() {
  if (!selectedExam) {
    showValidation(["Please select an examination before generating the report."]);
    return;
  }

  const type = dom.reportType.value;
  const evidenceText = evidenceSummary();
  const labText = labSummary();

  if (type === "MLR") {
    dom.historyNarrative.value = selectedExam.clinical?.historyGiven || selectedCase?.clinicalReason || "History was obtained from the patient and referral documents.";
    dom.findingsNarrative.value = [
      `The patient was examined on ${formatDate(selectedExam.examDateTime)} at ${display(selectedExam.examPlace)} by ${display(selectedExam.primaryDoctor)}.`,
      `General condition: ${display(selectedExam.clinical?.patientCondition)}. Consciousness: ${display(selectedExam.clinical?.consciousnessLevel)}.`,
      `General appearance: ${display(selectedExam.clinical?.generalAppearance)}.`,
      "",
      injurySummary()
    ].join("\n");
    dom.labNarrative.value = `${evidenceText}\n\n${labText}`;
    dom.opinionNarrative.value = selectedExam.doctorOpinion || "The above findings are reviewed for medico-legal opinion.";
    dom.conclusionNarrative.value = `The findings are documented for medico-legal purposes. Final opinion should be interpreted with available investigation and laboratory results.`;
  } else if (type === "PMR") {
    dom.historyNarrative.value = `The deceased was referred for postmortem examination under ${display(selectedCase?.inquestNo || selectedCase?.courtOrderNo)}. Death was reported at ${display(selectedCase?.placeOfDeath)} on ${formatDate(selectedCase?.dateOfDeath || selectedExam.examDateTime)}.`;
    dom.findingsNarrative.value = [
      `Postmortem examination was conducted on ${formatDate(selectedExam.examDateTime)} at ${display(selectedExam.examPlace || selectedCase?.placeOfPM)} by ${display(selectedExam.primaryDoctor)}.`,
      `Body condition: ${display(selectedExam.autopsy?.bodyCondition)}. Identification confirmed: ${display(selectedExam.autopsy?.identificationConfirmed)}.`,
      `Postmortem changes: Rigor mortis - ${display(selectedExam.autopsy?.rigorMortis)}, Livor mortis - ${display(selectedExam.autopsy?.livorMortis)}, Decomposition - ${display(selectedExam.autopsy?.decompositionStage)}. Estimated time since death: ${display(selectedExam.autopsy?.estimatedTimeSinceDeath)}.`,
      `External appearance: ${display(selectedExam.autopsy?.externalAppearance)}.`,
      "",
      "External injuries:",
      injurySummary(),
      "",
      "Internal findings:",
      organSummary()
    ].join("\n");
    dom.labNarrative.value = `${evidenceText}\n\n${labText}`;
    dom.opinionNarrative.value = selectedExam.doctorOpinion || "Final postmortem opinion is kept pending until all relevant laboratory results are reviewed.";
    dom.conclusionNarrative.value = selectedExam.autopsy?.causeOfDeathSummary || selectedCase?.causeSummary || "Cause of death is pending further investigation.";
  } else if (type === "COD") {
    dom.historyNarrative.value = `Cause of Death Form prepared for ${display(selectedExam.patientName)} linked to case ${display(selectedExam.caseId)}.`;
    dom.findingsNarrative.value = `Postmortem reference: ${display(selectedCase?.pmRegistryNo)}. Manner of death: ${display(selectedExam.autopsy?.mannerOfDeath || selectedCase?.mannerOfDeath)}.`;
    dom.labNarrative.value = `${evidenceText}\n\n${labText}`;
    dom.opinionNarrative.value = selectedExam.doctorOpinion || "Cause of death opinion prepared from postmortem findings and available investigations.";
    dom.conclusionNarrative.value = selectedExam.autopsy?.causeOfDeathSummary || selectedCase?.causeSummary || "Cause of death not finalized.";
  } else {
    dom.historyNarrative.value = `Supplementary report for case ${display(selectedExam.caseId)} and examination ${display(selectedExam.id)}.`;
    dom.findingsNarrative.value = selectedExam.caseType === "autopsy" ? organSummary() : injurySummary();
    dom.labNarrative.value = `${evidenceText}\n\n${labText}`;
    dom.opinionNarrative.value = selectedExam.doctorOpinion || "Supplementary medico-legal opinion.";
    dom.conclusionNarrative.value = "Supplementary conclusion prepared based on additional findings or documents.";
  }

  renderPreview();
}

function buildReportObject(statusOverride) {
  const now = localDateTimeValue();
  const existing = reportRecords.find(report => report.id === value("reportId"));
  const status = statusOverride || value("reportStatus") || "Draft";
  const versionNumber = existing?.versions?.length ? existing.versions.length + 1 : 1;
  const actionLabel = statusOverride ? `Status changed to ${statusOverride}` : `Saved as ${status}`;

  return {
    id: value("reportId") || generateReportId(),
    caseId: value("reportCaseId"),
    examId: selectedExam?.id || existing?.examId || dom.examinationSelect.value,
    patientId: value("reportPatientId"),
    patientName: selectedExam?.patientName || existing?.patientName || "",
    caseType: selectedExam?.caseType || selectedCase?.type || existing?.caseType || "clinical",
    reportType: value("reportType"),
    reportStatus: status,
    issueDate: value("issueDate"),
    officeName: value("officeName"),
    preparedBy: value("preparedBy"),
    approvedBy: value("approvedBy"),
    dispatchTo: value("dispatchTo"),
    historyNarrative: value("historyNarrative"),
    findingsNarrative: value("findingsNarrative"),
    labNarrative: value("labNarrative"),
    opinionNarrative: value("opinionNarrative"),
    conclusionNarrative: value("conclusionNarrative"),
    amendmentReason: value("amendmentReason"),
    sourceSnapshot: {
      case: selectedCase,
      examination: selectedExam,
      evidence: selectedExam ? sourceEvidence(selectedExam.caseId, selectedExam.id) : [],
      lab: selectedExam ? sourceLab(selectedExam.caseId, selectedExam.id) : []
    },
    versions: [
      ...(existing?.versions || []),
      {
        versionNo: versionNumber,
        status,
        action: actionLabel,
        user: value("preparedBy") || "Current user",
        reason: value("amendmentReason"),
        dateTime: now
      }
    ],
    updatedAt: now
  };
}

function validateReport(report, action) {
  const missing = [];
  if (!report.caseId) missing.push("Case ID");
  if (!report.examId) missing.push("Examination ID");
  if (!report.reportType) missing.push("Report type");
  if (!report.preparedBy) missing.push("Prepared by doctor");

  if (["Pending Approval", "Approved", "Dispatched"].includes(action)) {
    if (!report.historyNarrative) missing.push("History / circumstances section");
    if (!report.findingsNarrative) missing.push("Findings section");
    if (!report.opinionNarrative) missing.push("Opinion section");
    if (!report.conclusionNarrative) missing.push("Final conclusion section");
  }

  if (["Approved", "Dispatched"].includes(action) && !report.approvedBy) {
    missing.push("Approving Consultant JMO");
  }

  if (action === "Dispatched" && !report.dispatchTo) {
    missing.push("Dispatch destination");
  }

  if (["Amended", "Locked"].includes(report.reportStatus) && !report.amendmentReason) {
    missing.push("Amendment reason");
  }

  return missing;
}

function saveReport(statusOverride) {
  if (!selectedExam && dom.examinationSelect.value) {
    selectExamination(dom.examinationSelect.value);
  }

  if (!value("historyNarrative") && selectedExam) {
    generateNarratives();
  }

  const report = buildReportObject(statusOverride);
  const missing = validateReport(report, statusOverride || report.reportStatus);

  if (missing.length) {
    showValidation(missing);
    return;
  }

  reportRecords = [report, ...reportRecords.filter(item => item.id !== report.id)];
  selectedReportId = report.id;
  lastSavedReport = report;
  saveReports();
  renderPreview(report);
  renderReportTable();
  renderRecentReports();
  updateStats();

  document.getElementById("successModalMessage").textContent = `${report.id} saved as ${report.reportStatus}.`;
  document.getElementById("successModal").style.display = "grid";
}

function showValidation(missing) {
  document.getElementById("validationMissingList").innerHTML = missing.map(item => `<li>${escapeHtml(item)}</li>`).join("");
  document.getElementById("validationModal").style.display = "grid";
}

function sourceRows() {
  const caseRecord = selectedCase || {};
  const exam = selectedExam || {};
  const reportType = value("reportType");

  if (reportType === "MLR") {
    return [
      ["Report ID", value("reportId")],
      ["Case ID", value("reportCaseId")],
      ["MLEF No", caseRecord.mlefNo],
      ["Police Reference", caseRecord.policeRef],
      ["Police Station", caseRecord.policeStation],
      ["Court Reference", caseRecord.courtRef],
      ["Patient Name", exam.patientName],
      ["Patient ID", exam.patientId],
      ["Age / Sex", `${display(caseRecord.patientAge)} / ${display(caseRecord.patientGender)}`],
      ["Date and Time of Examination", formatDate(exam.examDateTime)],
      ["Place of Examination", exam.examPlace],
      ["Examining Doctor", exam.primaryDoctor]
    ];
  }

  if (reportType === "COD") {
    return [
      ["Report ID", value("reportId")],
      ["Case ID", value("reportCaseId")],
      ["PM Registry No", caseRecord.pmRegistryNo],
      ["Inquest / Court Order", caseRecord.inquestNo || caseRecord.courtOrderNo],
      ["Deceased Name", exam.patientName],
      ["Deceased ID", exam.patientId],
      ["Age / Sex", `${display(caseRecord.patientAge)} / ${display(caseRecord.patientGender)}`],
      ["Date / Time of Death", `${formatDate(caseRecord.dateOfDeath)} ${display(caseRecord.timeOfDeath)}`],
      ["Place of Death", caseRecord.placeOfDeath],
      ["Manner of Death", exam.autopsy?.mannerOfDeath || caseRecord.mannerOfDeath],
      ["Examining JMO", exam.primaryDoctor],
      ["Issue Date", formatDate(value("issueDate"))]
    ];
  }

  return [
    ["Report ID", value("reportId")],
    ["Case ID", value("reportCaseId")],
    ["PM Registry No", caseRecord.pmRegistryNo],
    ["Inquest No", caseRecord.inquestNo],
    ["Court Order No", caseRecord.courtOrderNo],
    ["Death Report No", caseRecord.deathReportNo],
    ["Deceased Name", exam.patientName],
    ["Deceased ID", exam.patientId],
    ["Age / Sex", `${display(caseRecord.patientAge)} / ${display(caseRecord.patientGender)}`],
    ["Date and Time of Death", `${formatDate(caseRecord.dateOfDeath)} ${display(caseRecord.timeOfDeath)}`],
    ["Place of Death", caseRecord.placeOfDeath],
    ["Place of Postmortem", exam.examPlace || caseRecord.placeOfPM],
    ["Date and Time of Postmortem", formatDate(exam.examDateTime)],
    ["Examining JMO", exam.primaryDoctor]
  ];
}

function renderRows(rows) {
  return rows.map(([key, val]) => `
    <tr><th>${escapeHtml(key)}</th><td>${escapeHtml(display(val))}</td></tr>
  `).join("");
}

function renderInjuryTableForPaper() {
  const injuries = selectedExam?.injuries || [];
  if (!injuries.length) return `<p>No injury table available.</p>`;

  return `
    <table class="paper-table">
      <thead><tr><th>No</th><th>Marker</th><th>Type</th><th>Location</th><th>Size</th><th>Description</th><th>Opinion</th></tr></thead>
      <tbody>
        ${injuries.map((item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(display(item.markerId))}</td>
            <td>${escapeHtml(display(item.type))}</td>
            <td>${escapeHtml(display(item.bodyLocation))}</td>
            <td>${escapeHtml([item.length, item.width, item.depth].filter(Boolean).join(" × "))} cm</td>
            <td>${escapeHtml(display(item.description))}</td>
            <td>${escapeHtml(display(item.weaponOpinion))}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderOrganTableForPaper() {
  const findings = selectedExam?.organFindings || [];
  if (!findings.length) return `<p>No structured internal organ finding table available.</p>`;

  return `
    <table class="paper-table">
      <thead><tr><th>No</th><th>Organ</th><th>Finding</th><th>Pathological Condition</th></tr></thead>
      <tbody>
        ${findings.map((item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(display(item.organName))}</td>
            <td>${escapeHtml(display(item.findingDescription))}</td>
            <td>${escapeHtml(display(item.pathologicalCondition))}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderQrBox() {
  return `
    <div class="qr-box">
      <div class="qr-mini">
        <span></span><span></span><span></span>
        <span></span><span></span><span></span>
        <span></span><span></span><span></span>
      </div>
      <small>Verification<br>${escapeHtml(value("reportId"))}</small>
    </div>
  `;
}

function renderSignatureBlock() {
  return `
    <div class="signature-grid">
      <div class="signature-box">
        <strong>Prepared By</strong><br>
        ${escapeHtml(display(value("preparedBy")))}<br>
        Date: ${escapeHtml(formatDate(value("issueDate")))}
      </div>
      <div class="signature-box">
        <strong>Approved By / Consultant JMO</strong><br>
        ${escapeHtml(display(value("approvedBy")))}<br>
        <div class="seal-box">Official Seal</div>
      </div>
    </div>
  `;
}

function paperFooter() {
  return `
    <div class="paper-footer">
      <span>Generated by MedLogs • ${escapeHtml(value("officeName"))}</span>
      <span>Page 1 of 1 • ${escapeHtml(value("reportStatus"))}</span>
    </div>
  `;
}

function renderMLR() {
  return `
    <div class="paper-watermark">${escapeHtml(value("reportStatus"))}</div>
    <div class="paper-header">
      <h1>${escapeHtml(value("officeName"))}</h1>
      <h2>Medico-Legal Report</h2>
      <p>Manual-style official report generated from verified digital records</p>
    </div>
    <div class="paper-meta-row">
      <div class="report-number-box"><strong>Report No:</strong> ${escapeHtml(value("reportId"))}<br><strong>Version:</strong> ${escapeHtml(getCurrentVersionText())}<br><strong>Status:</strong> ${escapeHtml(value("reportStatus"))}</div>
      ${renderQrBox()}
    </div>
    <table class="paper-table"><tbody>${renderRows(sourceRows())}</tbody></table>
    <div class="paper-section"><h3>History / Circumstances</h3>${paragraphize(value("historyNarrative"))}</div>
    <div class="paper-section"><h3>Examination Findings</h3>${paragraphize(value("findingsNarrative"))}</div>
    <div class="paper-section"><h3>Structured Injury Table and Body Diagram Markers</h3>${renderInjuryTableForPaper()}<p>Body diagram marker coordinates are stored digitally with the examination record.</p></div>
    <div class="paper-section"><h3>Evidence, Samples and Laboratory Results</h3>${paragraphize(value("labNarrative"))}</div>
    <div class="paper-section"><h3>Medico-Legal Opinion</h3>${paragraphize(value("opinionNarrative"))}</div>
    <div class="paper-section"><h3>Conclusion</h3>${paragraphize(value("conclusionNarrative"))}</div>
    ${renderSignatureBlock()}
    ${paperFooter()}
  `;
}

function renderPMR() {
  return `
    <div class="paper-watermark">${escapeHtml(value("reportStatus"))}</div>
    <div class="paper-header">
      <h1>${escapeHtml(value("officeName"))}</h1>
      <h2>Postmortem Report</h2>
      <p>Manual-style postmortem report generated from digital autopsy findings</p>
    </div>
    <div class="paper-meta-row">
      <div class="report-number-box"><strong>Report No:</strong> ${escapeHtml(value("reportId"))}<br><strong>Version:</strong> ${escapeHtml(getCurrentVersionText())}<br><strong>Status:</strong> ${escapeHtml(value("reportStatus"))}</div>
      ${renderQrBox()}
    </div>
    <table class="paper-table"><tbody>${renderRows(sourceRows())}</tbody></table>
    <div class="paper-section"><h3>History / Circumstances</h3>${paragraphize(value("historyNarrative"))}</div>
    <div class="paper-section"><h3>External Examination and Postmortem Changes</h3>${paragraphize(value("findingsNarrative"))}</div>
    <div class="paper-section"><h3>External Injury Table</h3>${renderInjuryTableForPaper()}</div>
    <div class="paper-section"><h3>Internal Organ Findings</h3>${renderOrganTableForPaper()}</div>
    <div class="paper-section"><h3>Evidence, Samples and Laboratory Results</h3>${paragraphize(value("labNarrative"))}</div>
    <div class="paper-section"><h3>Opinion</h3>${paragraphize(value("opinionNarrative"))}</div>
    <div class="paper-section"><h3>Cause and Manner of Death</h3>${paragraphize(value("conclusionNarrative"))}</div>
    ${renderSignatureBlock()}
    ${paperFooter()}
  `;
}

function renderCOD() {
  const conclusion = value("conclusionNarrative");
  return `
    <div class="paper-watermark">${escapeHtml(value("reportStatus"))}</div>
    <div class="paper-header">
      <h1>${escapeHtml(value("officeName"))}</h1>
      <h2>Cause of Death Form</h2>
      <p>Manual-style certificate details prepared from postmortem findings</p>
    </div>
    <div class="paper-meta-row">
      <div class="report-number-box"><strong>Report No:</strong> ${escapeHtml(value("reportId"))}<br><strong>Version:</strong> ${escapeHtml(getCurrentVersionText())}<br><strong>Status:</strong> ${escapeHtml(value("reportStatus"))}</div>
      ${renderQrBox()}
    </div>
    <table class="paper-table"><tbody>${renderRows(sourceRows())}</tbody></table>
    <div class="paper-section">
      <h3>Cause of Death</h3>
      <div class="cod-cause-box"><strong>Immediate Cause:</strong><br>${escapeHtml(display(conclusion))}</div>
      <div class="cod-cause-box"><strong>Antecedent / Underlying Cause:</strong><br>To be completed by the JMO according to postmortem and laboratory findings.</div>
      <div class="cod-cause-box"><strong>Other Significant Conditions:</strong><br>${escapeHtml(display(value("labNarrative")))}</div>
    </div>
    <div class="paper-section"><h3>Manner of Death / Opinion</h3>${paragraphize(value("opinionNarrative"))}</div>
    <div class="paper-section"><h3>Remarks</h3>${paragraphize(value("historyNarrative"))}</div>
    ${renderSignatureBlock()}
    ${paperFooter()}
  `;
}

function renderSupplementary() {
  return `
    <div class="paper-watermark">${escapeHtml(value("reportStatus"))}</div>
    <div class="paper-header">
      <h1>${escapeHtml(value("officeName"))}</h1>
      <h2>Supplementary Medico-Legal Report</h2>
      <p>Generated from additional findings, lab results or amendments</p>
    </div>
    <div class="paper-meta-row">
      <div class="report-number-box"><strong>Report No:</strong> ${escapeHtml(value("reportId"))}<br><strong>Version:</strong> ${escapeHtml(getCurrentVersionText())}<br><strong>Status:</strong> ${escapeHtml(value("reportStatus"))}</div>
      ${renderQrBox()}
    </div>
    <table class="paper-table"><tbody>${renderRows(sourceRows())}</tbody></table>
    <div class="paper-section"><h3>Supplementary Context</h3>${paragraphize(value("historyNarrative"))}</div>
    <div class="paper-section"><h3>Additional Findings</h3>${paragraphize(value("findingsNarrative"))}</div>
    <div class="paper-section"><h3>Evidence / Lab Reference</h3>${paragraphize(value("labNarrative"))}</div>
    <div class="paper-section"><h3>Supplementary Opinion</h3>${paragraphize(value("opinionNarrative"))}</div>
    <div class="paper-section"><h3>Conclusion</h3>${paragraphize(value("conclusionNarrative"))}</div>
    <div class="paper-section"><h3>Amendment Reason</h3>${paragraphize(value("amendmentReason"))}</div>
    ${renderSignatureBlock()}
    ${paperFooter()}
  `;
}

function getCurrentVersionText(reportId = value("reportId")) {
  const record = reportRecords.find(report => report.id === reportId);
  if (!record?.versions?.length) return "Version 1";
  return `Version ${record.versions.length + 1}`;
}

function renderPreview(report) {
  if (report) {
    loadReportIntoForm(report, false);
  }

  const type = value("reportType");
  if (type === "MLR") dom.reportPreview.innerHTML = renderMLR();
  else if (type === "PMR") dom.reportPreview.innerHTML = renderPMR();
  else if (type === "COD") dom.reportPreview.innerHTML = renderCOD();
  else dom.reportPreview.innerHTML = renderSupplementary();
}

function filteredReports() {
  const query = ((dom.reportSearch.value || dom.globalSearch.value || "").toLowerCase()).trim();
  const status = dom.reportStatusFilter.value;

  return reportRecords.filter(report => {
    if (currentReportFilter !== "all" && report.reportType !== currentReportFilter) return false;
    if (status !== "all" && report.reportStatus !== status) return false;
    if (!query) return true;

    return [
      report.id,
      report.caseId,
      report.examId,
      report.patientId,
      report.patientName,
      report.reportType,
      report.reportStatus,
      report.preparedBy,
      report.approvedBy,
      report.dispatchTo,
      report.opinionNarrative,
      report.conclusionNarrative
    ].join(" ").toLowerCase().includes(query);
  });
}

function renderReportTable() {
  const data = filteredReports();

  dom.reportTableBody.innerHTML = data.map(report => `
    <tr>
      <td><strong>${escapeHtml(report.id)}</strong></td>
      <td>${escapeHtml(display(report.caseId))}<br><small>${escapeHtml(display(report.patientName))} • ${escapeHtml(display(report.patientId))}</small></td>
      <td>${escapeHtml(report.reportType)}<br><small>${escapeHtml(reportTypeLabel(report.reportType))}</small></td>
      <td>${escapeHtml(display(report.preparedBy))}</td>
      <td><span class="badge ${statusClass(report.reportStatus)}">${escapeHtml(display(report.reportStatus))}</span></td>
      <td>${escapeHtml(formatDate(report.issueDate))}</td>
      <td><button class="table-action" type="button" data-report-id="${escapeHtml(report.id)}">View</button></td>
    </tr>
  `).join("");

  dom.reportEmptyMessage.hidden = data.length !== 0;
}

function renderRecentReports() {
  const recent = reportRecords.slice(0, 5);
  dom.recentReportBody.innerHTML = recent.map(report => `
    <tr>
      <td><strong>${escapeHtml(report.id)}</strong></td>
      <td>${escapeHtml(display(report.caseId))}</td>
      <td>${escapeHtml(report.reportType)}</td>
      <td><span class="badge ${statusClass(report.reportStatus)}">${escapeHtml(report.reportStatus)}</span></td>
    </tr>
  `).join("");
}

function updateStats() {
  dom.totalReportStat.textContent = reportRecords.length;
  dom.draftReportStat.textContent = reportRecords.filter(report => report.reportStatus === "Draft").length;
  dom.approvedReportStat.textContent = reportRecords.filter(report => ["Approved", "Dispatched", "Locked"].includes(report.reportStatus)).length;
}

function populateFullReportDetails(reportId) {
  const report = reportRecords.find(item => item.id === reportId);
  if (!report) return;

  dom.fullReportDetailsContainer.style.display = "block";
  selectedReportId = report.id;

  document.getElementById("detHeaderReportId").textContent = report.id;
  document.getElementById("detHeaderCasePatient").textContent = `Case: ${display(report.caseId)} • ${display(report.patientName)}`;
  document.getElementById("detHeaderType").textContent = report.reportType;
  document.getElementById("detHeaderType").className = `badge ${report.caseType === "autopsy" ? "warn" : "success"}`;
  document.getElementById("detHeaderStatus").textContent = report.reportStatus;
  document.getElementById("detHeaderStatus").className = `badge ${statusClass(report.reportStatus)}`;
  document.getElementById("detHeaderVersion").textContent = `Version ${report.versions?.length || 1}`;

  document.getElementById("detCaseId").textContent = display(report.caseId);
  document.getElementById("detExamId").textContent = display(report.examId);
  document.getElementById("detPatientId").textContent = display(report.patientId);
  document.getElementById("detIssueDate").textContent = formatDate(report.issueDate);
  document.getElementById("detPreparedBy").textContent = display(report.preparedBy);
  document.getElementById("detApprovedBy").textContent = display(report.approvedBy);
  document.getElementById("detDispatchTo").textContent = display(report.dispatchTo);
  document.getElementById("detUpdatedAt").textContent = formatDate(report.updatedAt);
  document.getElementById("detVersionTimeline").innerHTML = renderVersionTimeline(report);
}

function renderVersionTimeline(report) {
  const versions = report.versions || [];
  if (!versions.length) return `<p class="empty-state" style="padding:12px;">No version history recorded.</p>`;

  return versions.map(version => `
    <div class="version-step" data-version="${version.versionNo}">
      <strong>${escapeHtml(version.action)} • ${escapeHtml(version.status)}</strong>
      <small>${escapeHtml(display(version.user))} • ${escapeHtml(formatDate(version.dateTime))}</small>
      ${version.reason ? `<p>${escapeHtml(version.reason)}</p>` : ""}
    </div>
  `).join("");
}

function loadReportIntoForm(report, shouldSelectSource = true) {
  if (shouldSelectSource) {
    selectedExam = findExam(report.examId) || report.sourceSnapshot?.examination || null;
    selectedCase = findCase(report.caseId) || report.sourceSnapshot?.case || null;
    if (selectedExam) dom.examinationSelect.value = selectedExam.id;
  }

  setValue("reportId", report.id);
  setValue("reportCaseId", report.caseId);
  setValue("reportPatientId", report.patientId);
  setValue("reportType", report.reportType);
  setValue("reportStatus", report.reportStatus);
  setValue("issueDate", report.issueDate);
  setValue("officeName", report.officeName);
  setValue("preparedBy", report.preparedBy);
  setValue("approvedBy", report.approvedBy);
  setValue("dispatchTo", report.dispatchTo);
  setValue("historyNarrative", report.historyNarrative);
  setValue("findingsNarrative", report.findingsNarrative);
  setValue("labNarrative", report.labNarrative);
  setValue("opinionNarrative", report.opinionNarrative);
  setValue("conclusionNarrative", report.conclusionNarrative);
  setValue("amendmentReason", report.amendmentReason);

  if (shouldSelectSource) {
    renderSourceSummary();
    renderReadinessWarnings();
  }
}

function editSelectedReport() {
  const report = reportRecords.find(item => item.id === selectedReportId);
  if (!report) {
    alert("Please select a report first.");
    return;
  }

  activateTab("generate");
  updateReportTypeOptions();
  loadReportIntoForm(report, true);
  renderPreview();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  dom.reportForm.reset();
  selectedExam = null;
  selectedCase = null;
  selectedReportId = null;
  setValue("reportId", generateReportId());
  setValue("issueDate", localDateValue());
  setValue("officeName", "Forensic Medicine Department");
  setValue("reportStatus", "Draft");
  renderSourceSummary();
  renderReadinessWarnings();
  renderPreview();
}

function activateTab(tab) {
  dom.tabButtons.forEach(button => button.classList.toggle("active", button.dataset.tab === tab));
  dom.generatePanel.classList.toggle("active", tab === "generate");
  dom.recordsPanel.classList.toggle("active", tab === "records");
  if (tab === "records") renderReportTable();
}

function printCurrentReport() {
  renderPreview();
  window.print();
}

function initFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const reportId = params.get("reportId");
  const examId = params.get("examId");
  const caseId = params.get("caseId");

  if (reportId) {
    const report = reportRecords.find(item => item.id === reportId);
    if (report) {
      loadReportIntoForm(report, true);
      renderPreview();
      return;
    }
  }

  if (examId && findExam(examId)) {
    dom.examinationSelect.value = examId;
    selectExamination(examId);
    generateNarratives();
    return;
  }

  if (caseId) {
    const exam = examinationRecords.find(item => item.caseId === caseId);
    if (exam) {
      dom.examinationSelect.value = exam.id;
      selectExamination(exam.id);
      generateNarratives();
    }
  }
}

function bindEvents() {
  dom.tabButtons.forEach(button => button.addEventListener("click", () => activateTab(button.dataset.tab)));

  dom.sourceSearchInput.addEventListener("input", () => populateExaminationSelect(dom.sourceSearchInput.value));
  dom.examinationSelect.addEventListener("change", () => selectExamination(dom.examinationSelect.value));
  dom.reportType.addEventListener("change", () => {
    renderReadinessWarnings();
    generateNarratives();
  });
  dom.reportStatus.addEventListener("change", renderPreview);

  document.querySelectorAll("[data-template-shortcut]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-template-shortcut]").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      updateReportTypeOptions();
      if ([...dom.reportType.options].some(option => option.value === button.dataset.templateShortcut)) {
        dom.reportType.value = button.dataset.templateShortcut;
      }
      generateNarratives();
    });
  });

  dom.btnAutoGenerate.addEventListener("click", generateNarratives);
  dom.btnRefreshPreview.addEventListener("click", renderPreview);
  dom.btnPrintReport.addEventListener("click", printCurrentReport);
  dom.btnSaveDraft.addEventListener("click", () => saveReport("Draft"));
  dom.btnSubmitApproval.addEventListener("click", () => saveReport("Pending Approval"));
  dom.btnApproveReport.addEventListener("click", () => saveReport("Approved"));
  dom.btnDispatchReport.addEventListener("click", () => saveReport("Dispatched"));
  dom.clearFormBtn.addEventListener("click", resetForm);

  [dom.historyNarrative, dom.findingsNarrative, dom.labNarrative, dom.opinionNarrative, dom.conclusionNarrative, dom.amendmentReason].forEach(textarea => {
    textarea.addEventListener("input", renderPreview);
  });

  dom.reportSearch.addEventListener("input", renderReportTable);
  dom.reportStatusFilter.addEventListener("change", renderReportTable);
  dom.globalSearch.addEventListener("input", () => {
    activateTab("records");
    dom.reportSearch.value = dom.globalSearch.value;
    renderReportTable();
  });

  document.querySelectorAll("[data-report-filter]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-report-filter]").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      currentReportFilter = button.dataset.reportFilter;
      renderReportTable();
      dom.fullReportDetailsContainer.style.display = "none";
    });
  });

  dom.reportTableBody.addEventListener("click", event => {
    const button = event.target.closest("button[data-report-id]");
    if (!button) return;
    selectedReportId = button.dataset.reportId;
    populateFullReportDetails(selectedReportId);
  });

  document.getElementById("btnEditReportDetails").addEventListener("click", editSelectedReport);
  document.getElementById("btnPrintSelectedReport").addEventListener("click", () => {
    const report = reportRecords.find(item => item.id === selectedReportId);
    if (!report) return;
    loadReportIntoForm(report, true);
    renderPreview();
    printCurrentReport();
  });

  document.getElementById("viewRecentBtn").addEventListener("click", () => activateTab("records"));

  dom.menuBtn.addEventListener("click", () => {
    dom.sidebar.classList.add("open");
    dom.sidebarOverlay.classList.add("active");
  });

  dom.sidebarOverlay.addEventListener("click", () => {
    dom.sidebar.classList.remove("open");
    dom.sidebarOverlay.classList.remove("active");
  });

  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      dom.sidebar.classList.remove("open");
      dom.sidebarOverlay.classList.remove("active");
    });
  });

  document.getElementById("btnCloseValidationModal").addEventListener("click", () => {
    document.getElementById("validationModal").style.display = "none";
  });

  document.getElementById("btnSuccessClose").addEventListener("click", () => {
    document.getElementById("successModal").style.display = "none";
  });

  document.getElementById("btnSuccessPrint").addEventListener("click", () => {
    document.getElementById("successModal").style.display = "none";
    if (lastSavedReport) {
      loadReportIntoForm(lastSavedReport, true);
      renderPreview();
    }
    printCurrentReport();
  });
}

function init() {
  bindEvents();
  populateExaminationSelect();
  resetForm();
  renderReportTable();
  renderRecentReports();
  updateStats();
  updateTopbarLiveDate();
  initFromUrl();
}

init();
