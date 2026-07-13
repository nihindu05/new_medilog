const STORAGE_KEY = "fmdis_examinations_v1";
const CASE_STORAGE_KEY = "fmdis_cases_v2";

const sampleCases = [
  {
    id: "CL-2026-000123",
    type: "clinical",
    category: "Assault",
    status: "Under Examination",
    registeredDateTime: "2026-05-27T08:15",
    patientId: "PV-2026-00124",
    patientName: "Wijesinghe, A. K.",
    patientAge: "17",
    patientGender: "Female",
    patientNic: "200912345678",
    patientBht: "BHT-12-2026-0091",
    confidentiality: "Restricted",
    sexualAssault: false,
    minor: true,
    primaryDoctor: "Dr. N. Perera",
    jmoOffice: "Colombo JMO Office",
    mlefNo: "MLEF/2026/145",
    policeStation: "Borella Police Station",
    policeOfficer: "PS 4521 A. Silva",
    policeRef: "BOR/CR/2026/321",
    courtName: "Colombo Magistrate Court",
    courtRef: "MC/2026/114",
    examLocation: "JMO Office - Colombo",
    clinicalReason: "Physical assault examination",
    natureOfHarm: "Contusions and suspected fracture",
    natureOfWeapon: "Blunt object"
  },
  {
    id: "CL-2026-000124",
    type: "clinical",
    category: "Toxicology",
    status: "Awaiting Lab Results",
    registeredDateTime: "2026-05-27T14:42",
    patientId: "PV-2026-00125",
    patientName: "Perera, M. N.",
    patientAge: "27",
    patientGender: "Male",
    patientNic: "199812300456",
    patientBht: "OPD-2026-781",
    confidentiality: "Normal",
    sexualAssault: false,
    minor: false,
    primaryDoctor: "Dr. M. Dissanayake",
    jmoOffice: "Kandy JMO Office",
    mlefNo: "MLEF/2026/146",
    policeStation: "Kandy Police Station",
    policeOfficer: "PC 7782 R. Bandara",
    policeRef: "KDY/TR/2026/054",
    courtName: "Kandy Magistrate Court",
    courtRef: "",
    examLocation: "Teaching Hospital Kandy - OPD",
    clinicalReason: "Alcohol / drug influence assessment",
    natureOfHarm: "No external injury recorded",
    natureOfWeapon: "Not applicable"
  },
  {
    id: "PM-2026-000045",
    type: "autopsy",
    category: "Accidental Death",
    status: "Report Drafting",
    registeredDateTime: "2026-05-26T11:35",
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
  },
  {
    id: "PM-2026-000046",
    type: "autopsy",
    category: "Natural Death",
    status: "Closed",
    registeredDateTime: "2026-05-26T09:10",
    patientId: "PV-2026-00127",
    patientName: "Silva, K. D.",
    patientAge: "71",
    patientGender: "Male",
    patientNic: "195506067890",
    confidentiality: "Normal",
    primaryDoctor: "Dr. S. Rathnayake",
    jmoOffice: "Ragama JMO Office",
    pmRegistryNo: "PM-REG-2026-046",
    inquestNo: "INQ/2026/314",
    deathReportNo: "DR/2026/191",
    dateOfDeath: "2026-05-25",
    timeOfDeath: "06:45",
    placeOfDeath: "Hospital ward",
    placeOfPM: "Ragama Mortuary",
    policeStation: "Ragama Police Station",
    policeOfficer: "PC 6533 N. Perera",
    policeRef: "RGM/DR/2026/221",
    courtName: "Ragama Magistrate Court",
    courtRef: "",
    mannerOfDeath: "Natural",
    causeSummary: "Cause of death form issued after postmortem examination."
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
    examPurpose: "Initial Examination",
    privacyLevel: "Restricted",
    caseSummary: {
      policeRef: "BOR/CR/2026/321",
      courtRef: "MC/2026/114",
      confidentiality: "Restricted"
    },
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
      {
        id: "INJ-001",
        markerId: "M1",
        type: "Abrasion",
        bodyLocation: "Left forearm",
        side: "Left",
        length: "3",
        width: "1",
        depth: "",
        description: "Superficial fresh abrasion on left forearm.",
        injuryAge: "Fresh",
        severity: "Non-Grievous",
        weaponOpinion: "Blunt force possible",
        isFatal: "No"
      },
      {
        id: "INJ-002",
        markerId: "M2",
        type: "Contusion",
        bodyLocation: "Right cheek",
        side: "Right",
        length: "2",
        width: "2",
        depth: "",
        description: "Fresh contusion over right cheek.",
        injuryAge: "Fresh",
        severity: "Minor",
        weaponOpinion: "Blunt force possible",
        isFatal: "No"
      }
    ],
    organFindings: [],
    samples: ["Photographs", "X-ray / CT"],
    temporarySealNo: "",
    storageCondition: "Room temperature",
    labRequestNeeded: "Yes",
    samplePriority: "Normal",
    doctorOpinion: "Observed injuries are consistent with blunt force trauma. Final opinion pending radiology report.",
    generalNotes: "Clinical photographs taken. X-ray requested.",
    manualDiagram: { fileName: "", preview: "" },
    updatedAt: "2026-05-27T10:15"
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
    supervisingConsultant: "",
    examPurpose: "Main Postmortem Examination",
    privacyLevel: "Restricted",
    caseSummary: {
      policeRef: "GAL/ACC/2026/056",
      courtRef: "MC-GAL/2026/77",
      confidentiality: "Restricted"
    },
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
      {
        id: "INJ-001",
        markerId: "M1",
        type: "Contusion",
        bodyLocation: "Anterior chest",
        side: "Midline",
        length: "8",
        width: "5",
        depth: "",
        description: "Large contusion over anterior chest wall.",
        injuryAge: "Fresh",
        severity: "Life Threatening",
        weaponOpinion: "Blunt force possible",
        isFatal: "Undetermined"
      }
    ],
    organFindings: [
      {
        id: "ORG-001",
        organName: "Lungs",
        findingDescription: "Congestion noted bilaterally.",
        pathologicalCondition: "Congestion"
      },
      {
        id: "ORG-002",
        organName: "Heart",
        findingDescription: "No gross rupture observed. Further histology pending.",
        pathologicalCondition: "Pending histology"
      }
    ],
    samples: ["Blood", "Urine", "Vitreous Humor", "Stomach Contents", "Histology", "Toxicology", "Photographs"],
    temporarySealNo: "SEAL/GAL/2026/045",
    storageCondition: "Refrigerated",
    labRequestNeeded: "Yes",
    samplePriority: "Court Priority",
    doctorOpinion: "Preliminary opinion kept pending until toxicology and histology reports are received.",
    generalNotes: "Samples sealed and retained for evidence registration.",
    manualDiagram: { fileName: "", preview: "" },
    updatedAt: "2026-05-26T15:45"
  }
];

const dom = {
  tabButtons: document.querySelectorAll(".tab-btn"),
  entryPanel: document.getElementById("entryPanel"),
  recordsPanel: document.getElementById("recordsPanel"),
  switchButtons: document.querySelectorAll(".case-switch-btn"),
  form: document.getElementById("examinationForm"),
  caseSearchInput: document.getElementById("caseSearchInput"),
  caseSelect: document.getElementById("caseSelect"),
  caseSummaryPanel: document.getElementById("caseSummaryPanel"),
  selectedCaseType: document.getElementById("selectedCaseType"),
  examTypeHidden: document.getElementById("examTypeHidden"),
  manualFormType: document.getElementById("manualFormType"),
  entryFormHeader: document.getElementById("entryFormHeader"),
  examinationId: document.getElementById("examinationId"),
  examCaseId: document.getElementById("examCaseId"),
  examPatientId: document.getElementById("examPatientId"),
  examDateTime: document.getElementById("examDateTime"),
  examPlace: document.getElementById("examPlace"),
  primaryDoctor: document.getElementById("primaryDoctor"),
  bodyDiagramStage: document.getElementById("bodyDiagramStage"),
  diagramTitleSvg: document.getElementById("diagramTitleSvg"),
  diagramMarkerLayer: document.getElementById("diagramMarkerLayer"),
  markerList: document.getElementById("markerList"),
  injuryTableBody: document.getElementById("injuryTableBody"),
  injuryEmptyMessage: document.getElementById("injuryEmptyMessage"),
  organTableBody: document.getElementById("organTableBody"),
  organEmptyMessage: document.getElementById("organEmptyMessage"),
  manualDiagramUpload: document.getElementById("manualDiagramUpload"),
  manualDiagramPreviewWrap: document.getElementById("manualDiagramPreviewWrap"),
  manualDiagramPreview: document.getElementById("manualDiagramPreview"),
  manualDiagramFileName: document.getElementById("manualDiagramFileName"),
  examSearch: document.getElementById("examSearch"),
  examStatusFilter: document.getElementById("examStatusFilter"),
  examTableBody: document.getElementById("examTableBody"),
  examEmptyMessage: document.getElementById("examEmptyMessage"),
  fullExamDetailsContainer: document.getElementById("fullExamDetailsContainer"),
  recentExamBody: document.getElementById("recentExamBody"),
  totalExamStat: document.getElementById("totalExamStat"),
  clinicalExamStat: document.getElementById("clinicalExamStat"),
  autopsyExamStat: document.getElementById("autopsyExamStat"),
  clearFormBtn: document.getElementById("clearFormBtn"),
  btnSaveDraft: document.getElementById("btnSaveDraft"),
  btnCompleteExam: document.getElementById("btnCompleteExam"),
  btnAddInjury: document.getElementById("btnAddInjury"),
  btnAddOrganFinding: document.getElementById("btnAddOrganFinding"),
  btnClearMarkers: document.getElementById("btnClearMarkers"),
  viewRecentBtn: document.getElementById("viewRecentBtn"),
  menuBtn: document.querySelector(".menu-btn"),
  sidebar: document.querySelector(".sidebar"),
  sidebarOverlay: document.getElementById("sidebarOverlay"),
  dateDisplay: document.getElementById("currentDateDisplay"),
  dayDisplay: document.getElementById("currentDayDisplay"),
  globalSearch: document.getElementById("globalExaminationSearch")
};

let caseRecords = loadCaseRecords();
let examinations = loadExaminations();
let selectedCase = null;
let selectedExamId = null;
let currentEntryType = "clinical";
let currentDetailsType = "clinical";
let currentDiagramView = "front";
let diagramMarkers = [];
let injuries = [];
let organFindings = [];
let selectedMarkerId = null;
let manualDiagramDataUrl = "";
let manualDiagramName = "";
let isEditMode = false;

function loadCaseRecords() {
  try {
    const stored = localStorage.getItem(CASE_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : [...sampleCases];
  } catch (error) {
    console.warn("Case records could not be loaded. Sample cases were used.", error);
    return [...sampleCases];
  }
}

function loadExaminations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : [...sampleExaminations];
  } catch (error) {
    console.warn("Examination records could not be loaded. Sample examinations were used.", error);
    return [...sampleExaminations];
  }
}

function saveExaminations() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(examinations));
}

function pad(number, size = 6) {
  return String(number).padStart(size, "0");
}

function currentYear() {
  return new Date().getFullYear();
}

function generateExaminationId() {
  const year = currentYear();
  const sameSeries = examinations.filter(record => record.id && record.id.startsWith(`EXAM-${year}-`));

  const next = sameSeries.length
    ? Math.max(...sameSeries.map(record => Number(record.id.split("-").pop()) || 0)) + 1
    : 1;

  return `EXAM-${year}-${pad(next)}`;
}

function localDateTimeValue(date = new Date()) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function value(id) {
  const element = document.getElementById(id);
  if (!element) return "";
  if (element.type === "checkbox") return element.checked;
  return element.value && element.value.trim ? element.value.trim() : element.value;
}

function setValue(id, input) {
  const element = document.getElementById(id);
  if (!element) return;

  if (element.type === "checkbox") {
    element.checked = Boolean(input);
  } else {
    element.value = input ?? "";
  }
}

function display(input) {
  return input && String(input).trim() ? input : "Not recorded";
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

  dom.dateDisplay.textContent = now.toLocaleDateString(undefined, {
    month: "long",
    day: "2-digit",
    year: "numeric"
  });

  dom.dayDisplay.textContent = now.toLocaleDateString(undefined, {
    weekday: "long"
  });
}

function typeLabel(type) {
  return type === "autopsy" ? "Autopsy / PM" : "Clinical";
}

function statusClass(status) {
  if (["Completed", "Locked"].includes(status)) return "success";
  if (["Pending Lab Results", "Pending Review"].includes(status)) return "warn";
  if (["Draft"].includes(status)) return "purple";
  if (["Highly Restricted"].includes(status)) return "danger";
  return "";
}

function mainReference(record) {
  if (!record) return "";

  if (record.type === "autopsy") {
    return record.pmRegistryNo || record.inquestNo || record.courtOrderNo || record.policeRef || "Not recorded";
  }

  return record.mlefNo || record.mlrSerial || record.policeRef || "Not recorded";
}

function populateCaseSelect(filter = "") {
  const query = filter.toLowerCase().trim();

  const filtered = caseRecords.filter(record => {
    if (!query) return true;

    return [
      record.id,
      record.patientId,
      record.patientName,
      record.category,
      record.mlefNo,
      record.pmRegistryNo,
      record.inquestNo,
      record.policeRef,
      record.courtRef
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  dom.caseSelect.innerHTML = `
    <option value="">Select registered case</option>
    ${filtered.map(record => `
      <option value="${record.id}">
        ${record.id} • ${display(record.patientName)} • ${typeLabel(record.type)} • ${display(mainReference(record))}
      </option>
    `).join("")}
  `;
}

function findCase(caseId) {
  return caseRecords.find(record => record.id === caseId) || null;
}

function renderCaseSummary(record) {
  if (!record) {
    dom.caseSummaryPanel.innerHTML = `
      <div class="preview-empty compact-empty">
        <div>
          <span>⌕</span>
          <h4>No case selected</h4>
          <p>Select a registered case to load patient, police, court and JMO details.</p>
        </div>
      </div>
    `;
    return;
  }

  dom.caseSummaryPanel.innerHTML = `
    <div class="selected-case-summary">
      <div class="summary-main">
        <small>Selected Case</small>
        <strong>${record.id}</strong>
        <span class="badge ${record.type === "clinical" ? "success" : "warn"}">${typeLabel(record.type)}</span>
        <span class="badge ${record.confidentiality === "Normal" ? "light" : "danger"}">${display(record.confidentiality)}</span>
      </div>

      <div class="summary-cell">
        <small>Patient / Victim</small>
        <span>${display(record.patientName)}<br>${display(record.patientId)}</span>
      </div>

      <div class="summary-cell">
        <small>Category</small>
        <span>${display(record.category)}</span>
      </div>

      <div class="summary-cell">
        <small>Main Reference</small>
        <span>${display(mainReference(record))}</span>
      </div>

      <div class="summary-cell">
        <small>Doctor / Office</small>
        <span>${display(record.primaryDoctor)}<br>${display(record.jmoOffice)}</span>
      </div>

      <div class="summary-cell">
        <small>Police</small>
        <span>${display(record.policeStation)}<br>${display(record.policeRef)}</span>
      </div>

      <div class="summary-cell">
        <small>Court</small>
        <span>${display(record.courtName)}<br>${display(record.courtRef)}</span>
      </div>

      <div class="summary-cell">
        <small>Age / Gender</small>
        <span>${display(record.patientAge)} / ${display(record.patientGender)}</span>
      </div>

      <div class="summary-cell">
        <small>Case Status</small>
        <span>${display(record.status)}</span>
      </div>
    </div>
  `;
}

function selectCase(caseId, preserveExistingArrays = false) {
  selectedCase = findCase(caseId);

  if (!selectedCase) {
    renderCaseSummary(null);
    return;
  }

  const type = selectedCase.type === "autopsy" ? "autopsy" : "clinical";
  currentEntryType = type;

  setEntryFormType(type, preserveExistingArrays);

  setValue("examCaseId", selectedCase.id);
  setValue("examPatientId", selectedCase.patientId);
  setValue("selectedCaseType", typeLabel(type));
  setValue("examTypeHidden", type);
  setValue("examPlace", selectedCase.examLocation || selectedCase.placeOfPM || selectedCase.jmoOffice || "JMO Office");
  setValue("primaryDoctor", selectedCase.primaryDoctor || "");
  setValue("examPrivacyLevel", selectedCase.confidentiality || "Normal");

  renderCaseSummary(selectedCase);
}

function setInitialFormValues() {
  setValue("examinationId", generateExaminationId());
  setValue("examDateTime", localDateTimeValue());
  setValue("createdBy", "Dr. N. Perera");
  setValue("examinationStatus", "In Progress");
}

function setEntryFormType(type, preserveExistingArrays = false) {
  currentEntryType = type;

  setValue("examTypeHidden", type);
  setValue("selectedCaseType", typeLabel(type));

  document.querySelectorAll(`.case-switch-btn[data-context="entryType"]`).forEach(button => {
    button.classList.toggle("active", button.dataset.type === type);
  });

  document.querySelectorAll(".clinical-section").forEach(section => {
    section.classList.toggle("active", type === "clinical");
  });

  document.querySelectorAll(".autopsy-section").forEach(section => {
    section.classList.toggle("active", type === "autopsy");
  });

  if (type === "clinical") {
    dom.entryFormHeader.textContent = "Clinical Forensic Examination Form";
    setValue("manualFormType", "Clinical Forensic Examination Form");
    setValue("examPurpose", "Initial Examination");
  } else {
    dom.entryFormHeader.textContent = "Autopsy / Postmortem Examination Form";
    setValue("manualFormType", "Postmortem Examination Form");
    setValue("examPurpose", "Main Postmortem Examination");
  }

  if (!preserveExistingArrays && !isEditMode) {
    diagramMarkers = [];
    injuries = [];
    organFindings = [];
    selectedMarkerId = null;

    renderDiagramMarkers();
    renderMarkerList();
    renderInjuryTable();
    renderOrganTable();
  }
}

function activateTab(tab) {
  dom.tabButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });

  dom.entryPanel.classList.toggle("active", tab === "entry");
  dom.recordsPanel.classList.toggle("active", tab === "records");

  if (tab === "records") {
    renderExaminationTable();
  }
}

function setDetailsType(type) {
  currentDetailsType = type;

  document.querySelectorAll(`.case-switch-btn[data-context="details"]`).forEach(button => {
    button.classList.toggle("active", button.dataset.type === type);
  });

  renderExaminationTable();
  dom.fullExamDetailsContainer.style.display = "none";
}

function estimateBodyRegion(x, y, view) {
  if (y < 18) return "Head / Face";
  if (y < 25) return "Neck";

  if (y < 45) {
    if (x < 33) return view === "front" ? "Left Arm" : "Right Arm";
    if (x > 67) return view === "front" ? "Right Arm" : "Left Arm";
    return view === "front" ? "Chest / Upper abdomen" : "Upper back";
  }

  if (y < 58) return view === "front" ? "Abdomen / Pelvis" : "Lower back / Pelvis";

  if (y < 88) {
    if (x < 50) return view === "front" ? "Left Leg" : "Right Leg";
    return view === "front" ? "Right Leg" : "Left Leg";
  }

  return "Foot / Lower limb";
}

function setDiagramView(view) {
  currentDiagramView = view;
  dom.bodyDiagramStage.dataset.view = view;
  dom.diagramTitleSvg.textContent = view === "front" ? "FRONT" : "BACK";

  document.querySelectorAll(".diagram-view-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  renderDiagramMarkers();
}

function addDiagramMarker(event) {
  if (event.target.closest(".diagram-marker")) return;

  const rect = dom.bodyDiagramStage.getBoundingClientRect();

  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  if (x < 0 || x > 100 || y < 0 || y > 100) return;

  const id = `M${diagramMarkers.length + 1}`;

  const marker = {
    id,
    view: currentDiagramView,
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
    bodyRegion: estimateBodyRegion(x, y, currentDiagramView),
    injuryId: ""
  };

  diagramMarkers.push(marker);
  selectedMarkerId = id;

  setValue("linkedMarker", id);
  setValue("bodyLocation", marker.bodyRegion);

  renderDiagramMarkers();
  renderMarkerList();
}

function renderDiagramMarkers() {
  const viewMarkers = diagramMarkers.filter(marker => marker.view === currentDiagramView);

  dom.diagramMarkerLayer.innerHTML = viewMarkers.map(marker => `
    <button
      type="button"
      class="diagram-marker ${marker.id === selectedMarkerId ? "selected" : ""}"
      data-marker-id="${marker.id}"
      style="left:${marker.x}%; top:${marker.y}%;"
      title="${marker.id} - ${display(marker.bodyRegion)}"
    >
      ${marker.id.replace("M", "")}
    </button>
  `).join("");
}

function renderMarkerList() {
  if (!diagramMarkers.length) {
    dom.markerList.className = "marker-list empty-marker-list";
    dom.markerList.textContent = "No body markers added yet.";
    return;
  }

  dom.markerList.className = "marker-list";

  dom.markerList.innerHTML = diagramMarkers.map(marker => `
    <div class="marker-item">
      <div>
        <strong>${marker.id} • ${marker.view.toUpperCase()} • ${display(marker.bodyRegion)}</strong>
        <small>
          X: ${marker.x}% / Y: ${marker.y}%
          ${marker.injuryId ? `• Linked: ${marker.injuryId}` : "• Not linked"}
        </small>
      </div>
      <button type="button" data-delete-marker="${marker.id}" title="Delete marker">×</button>
    </div>
  `).join("");
}

function clearMarkers() {
  diagramMarkers = [];
  selectedMarkerId = null;

  setValue("linkedMarker", "");

  renderDiagramMarkers();
  renderMarkerList();
}

function addInjury() {
  const id = `INJ-${String(injuries.length + 1).padStart(3, "0")}`;
  const marker = selectedMarkerId ? diagramMarkers.find(item => item.id === selectedMarkerId) : null;

  const injury = {
    id,
    markerId: selectedMarkerId || "",
    type: value("injuryType"),
    bodyLocation: value("bodyLocation") || marker?.bodyRegion || "Not recorded",
    side: value("injurySide"),
    length: value("injuryLength"),
    width: value("injuryWidth"),
    depth: value("injuryDepth"),
    description: value("injuryDescription"),
    injuryAge: value("injuryAge"),
    severity: value("injurySeverity"),
    weaponOpinion: value("weaponOpinion"),
    isFatal: value("isFatal")
  };

  injuries.push(injury);

  if (marker) {
    marker.injuryId = id;
  }

  setValue("injuryDescription", "");
  setValue("injuryLength", "");
  setValue("injuryWidth", "");
  setValue("injuryDepth", "");

  renderInjuryTable();
  renderDiagramMarkers();
  renderMarkerList();
}

function renderInjuryTable() {
  dom.injuryTableBody.innerHTML = injuries.map((injury, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><strong>${display(injury.markerId)}</strong></td>
      <td>${display(injury.type)}</td>
      <td>${display(injury.bodyLocation)}<br><small>${display(injury.side)}</small></td>
      <td>${display(injury.length)} × ${display(injury.width)} × ${display(injury.depth)} cm</td>
      <td>
        <span class="badge ${injury.severity === "Fatal" || injury.isFatal === "Yes" ? "danger" : "light"}">
          ${display(injury.severity)}
        </span>
      </td>
      <td>
        <button class="table-action" type="button" data-delete-injury="${injury.id}">
          Delete
        </button>
      </td>
    </tr>
  `).join("");

  dom.injuryEmptyMessage.hidden = injuries.length !== 0;
}

function addOrganFinding() {
  const id = `ORG-${String(organFindings.length + 1).padStart(3, "0")}`;

  organFindings.push({
    id,
    organName: value("organName"),
    findingDescription: value("findingDescription"),
    pathologicalCondition: value("pathologicalCondition")
  });

  setValue("findingDescription", "");
  setValue("pathologicalCondition", "");

  renderOrganTable();
}

function renderOrganTable() {
  dom.organTableBody.innerHTML = organFindings.map((finding, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><strong>${display(finding.organName)}</strong></td>
      <td>${display(finding.findingDescription)}</td>
      <td>${display(finding.pathologicalCondition)}</td>
      <td>
        <button class="table-action" type="button" data-delete-organ="${finding.id}">
          Delete
        </button>
      </td>
    </tr>
  `).join("");

  dom.organEmptyMessage.hidden = organFindings.length !== 0;
}

function selectedSamples() {
  return [...document.querySelectorAll(".sample-checkbox")]
    .filter(input => input.checked)
    .map(input => input.dataset.sample);
}

function setSelectedSamples(samples = []) {
  document.querySelectorAll(".sample-checkbox").forEach(input => {
    input.checked = samples.includes(input.dataset.sample);
  });
}

function validateRecord(record, statusOverride) {
  const missing = [];

  if (!record.caseId) missing.push("Registered Case ID");
  if (!record.examDateTime) missing.push("Examination date and time");
  if (!record.examPlace) missing.push("Examination place");
  if (!record.primaryDoctor) missing.push("Primary examiner / JMO");

  if (statusOverride === "Completed") {
    if (record.caseType === "clinical" && !record.injuries.length && !record.doctorOpinion) {
      missing.push("At least one injury record or doctor opinion for completed clinical examination");
    }

    if (record.caseType === "autopsy" && !record.organFindings.length && !record.autopsy.causeOfDeathSummary) {
      missing.push("Internal findings or preliminary cause of death summary for completed autopsy examination");
    }
  }

  return missing;
}

function getFormData(statusOverride) {
  const status = statusOverride || value("examinationStatus") || "Draft";
  const caseType = value("examTypeHidden") || currentEntryType;

  const record = {
    id: value("examinationId") || generateExaminationId(),
    caseId: value("examCaseId"),
    patientId: value("examPatientId"),
    patientName: selectedCase?.patientName || "",
    caseType,
    caseCategory: selectedCase?.category || "",
    examType: caseType === "clinical" ? "Clinical Forensic Examination" : "Postmortem / Autopsy Examination",
    status,
    examDateTime: value("examDateTime"),
    examPlace: value("examPlace"),
    createdBy: value("createdBy"),
    primaryDoctor: value("primaryDoctor"),
    doctorRole: value("doctorRole"),
    assistingDoctor: value("assistingDoctor"),
    supervisingConsultant: value("supervisingConsultant"),
    femaleDoctorRequired: value("femaleDoctorRequired"),
    examPurpose: value("examPurpose"),
    privacyLevel: value("examPrivacyLevel"),

    caseSummary: {
      policeRef: selectedCase?.policeRef || "",
      courtRef: selectedCase?.courtRef || "",
      confidentiality: selectedCase?.confidentiality || value("examPrivacyLevel")
    },

    clinical: {
      patientCondition: value("patientCondition"),
      consciousnessLevel: value("consciousnessLevel"),
      alcoholObservation: value("alcoholObservation"),
      drugObservation: value("drugObservation"),
      historyGiven: value("historyGiven"),
      generalAppearance: value("generalAppearance")
    },

    autopsy: {
      identificationConfirmed: value("identificationConfirmed"),
      bodyCondition: value("bodyCondition"),
      rigorMortis: value("rigorMortis"),
      livorMortis: value("livorMortis"),
      decompositionStage: value("decompositionStage"),
      estimatedTimeSinceDeath: value("estimatedTimeSinceDeath"),
      mannerOfDeath: value("mannerOfDeath"),
      clothingDescription: value("clothingDescription"),
      externalAppearance: value("externalAppearance"),
      causeOfDeathSummary: value("causeOfDeathSummary")
    },

    diagramMarkers: [...diagramMarkers],
    injuries: [...injuries],
    organFindings: [...organFindings],
    samples: selectedSamples(),
    temporarySealNo: value("temporarySealNo"),
    storageCondition: value("storageCondition"),
    labRequestNeeded: value("labRequestNeeded"),
    samplePriority: value("samplePriority"),
    doctorOpinion: value("doctorOpinion"),
    generalNotes: value("generalNotes"),

    manualDiagram: {
      fileName: manualDiagramName,
      preview: manualDiagramDataUrl
    },

    updatedAt: localDateTimeValue()
  };

  return record;
}

function saveExamination(statusOverride) {
  const record = getFormData(statusOverride);
  const missing = validateRecord(record, statusOverride);

  if (missing.length) {
    document.getElementById("validationMissingList").innerHTML =
      missing.map(item => `<li>${item}</li>`).join("");

    document.getElementById("validationModal").style.display = "grid";
    return;
  }

  examinations = [record, ...examinations.filter(item => item.id !== record.id)];
  selectedExamId = record.id;

  saveExaminations();
  renderExaminationTable();
  renderRecentExaminations();
  updateStats();

  document.getElementById("successModalMessage").textContent =
    `${record.id} saved as ${record.status}.`;

  document.getElementById("successModal").style.display = "grid";

  if (statusOverride === "Completed") {
    resetForm();
  }
}

function resetForm() {
  dom.form.reset();

  isEditMode = false;
  selectedCase = null;
  selectedMarkerId = null;
  diagramMarkers = [];
  injuries = [];
  organFindings = [];
  manualDiagramDataUrl = "";
  manualDiagramName = "";

  dom.manualDiagramPreviewWrap.hidden = true;

  renderCaseSummary(null);
  setEntryFormType("clinical");
  setInitialFormValues();
  populateCaseSelect();
  renderDiagramMarkers();
  renderMarkerList();
  renderInjuryTable();
  renderOrganTable();
}

function filteredExaminations() {
  const query = ((dom.examSearch.value || dom.globalSearch.value || "").toLowerCase()).trim();
  const status = dom.examStatusFilter.value;

  return examinations.filter(record => {
    if (record.caseType !== currentDetailsType) return false;
    if (status !== "all" && record.status !== status) return false;
    if (!query) return true;

    return [
      record.id,
      record.caseId,
      record.patientId,
      record.patientName,
      record.caseCategory,
      record.examType,
      record.primaryDoctor,
      record.status,
      record.doctorOpinion,
      record.generalNotes,
      (record.injuries || []).map(item => `${item.type} ${item.bodyLocation} ${item.description}`).join(" "),
      (record.organFindings || []).map(item => `${item.organName} ${item.findingDescription} ${item.pathologicalCondition}`).join(" "),
      (record.samples || []).join(" ")
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

function renderExaminationTable() {
  const data = filteredExaminations();

  dom.examTableBody.innerHTML = data.map(record => `
    <tr>
      <td><strong>${record.id}</strong></td>
      <td>${display(record.caseId)}<br><small>${display(record.patientName)} • ${display(record.patientId)}</small></td>
      <td>${display(record.examType)}<br><small>${display(record.caseCategory)}</small></td>
      <td>${display(record.primaryDoctor)}</td>
      <td><span class="badge ${statusClass(record.status)}">${display(record.status)}</span></td>
      <td>${formatDate(record.examDateTime)}</td>
      <td>
        <button class="table-action" type="button" data-exam-id="${record.id}">
          View
        </button>
      </td>
    </tr>
  `).join("");

  dom.examEmptyMessage.hidden = data.length !== 0;
}

function renderRecentExaminations() {
  const recent = examinations.slice(0, 5);

  dom.recentExamBody.innerHTML = recent.map(record => `
    <tr>
      <td><strong>${record.id}</strong></td>
      <td>${display(record.caseId)}</td>
      <td>${typeLabel(record.caseType)}</td>
      <td><span class="badge ${statusClass(record.status)}">${display(record.status)}</span></td>
      <td>${formatDate(record.examDateTime)}</td>
    </tr>
  `).join("");
}

function updateStats() {
  dom.totalExamStat.textContent = examinations.length;
  dom.clinicalExamStat.textContent = examinations.filter(record => record.caseType === "clinical").length;
  dom.autopsyExamStat.textContent = examinations.filter(record => record.caseType === "autopsy").length;
}

function listItem(title, subtitle, text) {
  return `
    <div class="detail-list-item">
      <strong>${title}</strong>
      ${subtitle ? `<small>${subtitle}</small>` : ""}
      ${text ? `<p>${text}</p>` : ""}
    </div>
  `;
}

function populateFullExamDetails(examId) {
  const record = examinations.find(item => item.id === examId);

  if (!record) {
    dom.fullExamDetailsContainer.style.display = "none";
    return;
  }

  dom.fullExamDetailsContainer.style.display = "block";

  document.getElementById("detHeaderExamId").textContent = record.id;
  document.getElementById("detHeaderType").textContent = record.examType;
  document.getElementById("detHeaderType").className =
    `badge ${record.caseType === "clinical" ? "success" : "warn"}`;

  document.getElementById("detHeaderStatus").textContent = record.status;
  document.getElementById("detHeaderStatus").className =
    `badge ${statusClass(record.status)}`;

  document.getElementById("detHeaderCasePatient").textContent =
    `Case: ${record.caseId} • ${display(record.patientName)}`;

  document.getElementById("detHeaderPrivacy").textContent =
    display(record.privacyLevel || record.caseSummary?.confidentiality);

  document.getElementById("detHeaderPrivacy").className =
    `badge ${(record.privacyLevel || record.caseSummary?.confidentiality) === "Normal" ? "light" : "danger"}`;

  document.getElementById("detHeaderMarkers").textContent =
    `${record.diagramMarkers?.length || 0} markers`;

  document.getElementById("detCaseId").textContent = display(record.caseId);
  document.getElementById("detPatientId").textContent = display(record.patientId);
  document.getElementById("detExamDateTime").textContent = formatDate(record.examDateTime);
  document.getElementById("detExamPlace").textContent = display(record.examPlace);
  document.getElementById("detExamPurpose").textContent = display(record.examPurpose);

  document.getElementById("detPrimaryDoctor").textContent = display(record.primaryDoctor);
  document.getElementById("detAssistingDoctor").textContent = display(record.assistingDoctor);
  document.getElementById("detSupervisor").textContent = display(record.supervisingConsultant);
  document.getElementById("detPrivacyLevel").textContent = display(record.privacyLevel);

  document.getElementById("detPatientCondition").textContent = display(record.clinical?.patientCondition);
  document.getElementById("detHistory").textContent = display(record.clinical?.historyGiven);
  document.getElementById("detGeneralAppearance").textContent = display(record.clinical?.generalAppearance);
  document.getElementById("detAlcoholDrug").textContent =
    `${display(record.clinical?.alcoholObservation)} / ${display(record.clinical?.drugObservation)}`;

  document.getElementById("detBodyCondition").textContent = display(record.autopsy?.bodyCondition);
  document.getElementById("detPmChanges").textContent =
    `Rigor: ${display(record.autopsy?.rigorMortis)} / Livor: ${display(record.autopsy?.livorMortis)} / Decomposition: ${display(record.autopsy?.decompositionStage)}`;

  document.getElementById("detExternalAppearance").textContent = display(record.autopsy?.externalAppearance);
  document.getElementById("detCauseManner").textContent =
    `${display(record.autopsy?.causeOfDeathSummary)} / ${display(record.autopsy?.mannerOfDeath)}`;

  const injuryList = record.injuries || [];

  document.getElementById("detInjuryList").innerHTML = injuryList.length
    ? injuryList.map(item =>
        listItem(
          `${display(item.id)} • ${display(item.type)} • ${display(item.bodyLocation)}`,
          `Marker: ${display(item.markerId)} • Size: ${display(item.length)} × ${display(item.width)} × ${display(item.depth)} cm • Severity: ${display(item.severity)}`,
          `${display(item.description)} Weapon opinion: ${display(item.weaponOpinion)}. Fatal: ${display(item.isFatal)}.`
        )
      ).join("")
    : listItem("No injury records", "No structured injuries added.", "");

  const organList = record.organFindings || [];

  document.getElementById("detOrganList").innerHTML = organList.length
    ? organList.map(item =>
        listItem(
          `${display(item.id)} • ${display(item.organName)}`,
          display(item.pathologicalCondition),
          display(item.findingDescription)
        )
      ).join("")
    : listItem("No internal findings", "No organ findings added.", "");

  const samples = record.samples || [];

  document.getElementById("detSampleList").innerHTML = samples.length
    ? samples.map(item =>
        listItem(
          item,
          `Seal: ${display(record.temporarySealNo)} • Storage: ${display(record.storageCondition)}`,
          `Lab request: ${display(record.labRequestNeeded)} • Priority: ${display(record.samplePriority)}`
        )
      ).join("")
    : listItem("No samples recorded", "No collection/request selected.", "");

  document.getElementById("detDoctorOpinion").textContent = display(record.doctorOpinion);
  document.getElementById("detGeneralNotes").textContent = display(record.generalNotes);
  document.getElementById("detManualDiagram").textContent = display(record.manualDiagram?.fileName);
}

function populateFormForEditing(examId) {
  const record = examinations.find(item => item.id === examId);
  if (!record) return;

  isEditMode = true;

  activateTab("entry");
  setInitialFormValues();

  setValue("examinationId", record.id);
  selectCase(record.caseId, true);
  setEntryFormType(record.caseType, true);

  setValue("examinationStatus", record.status);
  setValue("examDateTime", record.examDateTime);
  setValue("examPlace", record.examPlace);
  setValue("createdBy", record.createdBy);
  setValue("primaryDoctor", record.primaryDoctor);
  setValue("doctorRole", record.doctorRole || "Primary Examiner");
  setValue("assistingDoctor", record.assistingDoctor);
  setValue("supervisingConsultant", record.supervisingConsultant);
  setValue("femaleDoctorRequired", record.femaleDoctorRequired || "No");
  setValue("examPurpose", record.examPurpose);
  setValue("examPrivacyLevel", record.privacyLevel);

  setValue("patientCondition", record.clinical?.patientCondition);
  setValue("consciousnessLevel", record.clinical?.consciousnessLevel);
  setValue("alcoholObservation", record.clinical?.alcoholObservation);
  setValue("drugObservation", record.clinical?.drugObservation);
  setValue("historyGiven", record.clinical?.historyGiven);
  setValue("generalAppearance", record.clinical?.generalAppearance);

  setValue("identificationConfirmed", record.autopsy?.identificationConfirmed);
  setValue("bodyCondition", record.autopsy?.bodyCondition);
  setValue("rigorMortis", record.autopsy?.rigorMortis);
  setValue("livorMortis", record.autopsy?.livorMortis);
  setValue("decompositionStage", record.autopsy?.decompositionStage);
  setValue("estimatedTimeSinceDeath", record.autopsy?.estimatedTimeSinceDeath);
  setValue("mannerOfDeath", record.autopsy?.mannerOfDeath);
  setValue("clothingDescription", record.autopsy?.clothingDescription);
  setValue("externalAppearance", record.autopsy?.externalAppearance);
  setValue("causeOfDeathSummary", record.autopsy?.causeOfDeathSummary);

  diagramMarkers = [...(record.diagramMarkers || [])];
  injuries = [...(record.injuries || [])];
  organFindings = [...(record.organFindings || [])];
  selectedMarkerId = null;

  setSelectedSamples(record.samples || []);

  setValue("temporarySealNo", record.temporarySealNo);
  setValue("storageCondition", record.storageCondition);
  setValue("labRequestNeeded", record.labRequestNeeded);
  setValue("samplePriority", record.samplePriority);
  setValue("doctorOpinion", record.doctorOpinion);
  setValue("generalNotes", record.generalNotes);

  manualDiagramName = record.manualDiagram?.fileName || "";
  manualDiagramDataUrl = record.manualDiagram?.preview || "";

  if (manualDiagramDataUrl) {
    dom.manualDiagramPreview.src = manualDiagramDataUrl;
    dom.manualDiagramFileName.textContent = manualDiagramName;
    dom.manualDiagramPreviewWrap.hidden = false;
  }

  renderDiagramMarkers();
  renderMarkerList();
  renderInjuryTable();
  renderOrganTable();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindEvents() {
  dom.tabButtons.forEach(button => {
    button.addEventListener("click", () => activateTab(button.dataset.tab));
  });

  dom.switchButtons.forEach(button => {
    button.addEventListener("click", () => {
      if (button.dataset.context === "entryType") {
        setEntryFormType(button.dataset.type);
      }

      if (button.dataset.context === "details") {
        setDetailsType(button.dataset.type);
      }
    });
  });

  dom.caseSearchInput.addEventListener("input", () => {
    populateCaseSelect(dom.caseSearchInput.value);
  });

  dom.caseSelect.addEventListener("change", () => {
    selectCase(dom.caseSelect.value);
  });

  document.querySelectorAll(".diagram-view-btn").forEach(button => {
    button.addEventListener("click", () => {
      setDiagramView(button.dataset.view);
    });
  });

  dom.bodyDiagramStage.addEventListener("click", addDiagramMarker);

  dom.diagramMarkerLayer.addEventListener("click", event => {
    const button = event.target.closest(".diagram-marker");
    if (!button) return;

    selectedMarkerId = button.dataset.markerId;
    const marker = diagramMarkers.find(item => item.id === selectedMarkerId);

    setValue("linkedMarker", selectedMarkerId);

    if (marker) {
      setValue("bodyLocation", marker.bodyRegion);
    }

    renderDiagramMarkers();
  });

  dom.markerList.addEventListener("click", event => {
    const deleteBtn = event.target.closest("button[data-delete-marker]");
    if (!deleteBtn) return;

    const markerId = deleteBtn.dataset.deleteMarker;

    diagramMarkers = diagramMarkers.filter(marker => marker.id !== markerId);

    injuries = injuries.map(injury =>
      injury.markerId === markerId ? { ...injury, markerId: "" } : injury
    );

    if (selectedMarkerId === markerId) {
      selectedMarkerId = null;
    }

    renderDiagramMarkers();
    renderMarkerList();
    renderInjuryTable();
  });

  dom.btnClearMarkers.addEventListener("click", clearMarkers);
  dom.btnAddInjury.addEventListener("click", addInjury);

  dom.injuryTableBody.addEventListener("click", event => {
    const button = event.target.closest("button[data-delete-injury]");
    if (!button) return;

    const injuryId = button.dataset.deleteInjury;

    injuries = injuries.filter(injury => injury.id !== injuryId);

    diagramMarkers = diagramMarkers.map(marker =>
      marker.injuryId === injuryId ? { ...marker, injuryId: "" } : marker
    );

    renderInjuryTable();
    renderMarkerList();
    renderDiagramMarkers();
  });

  dom.btnAddOrganFinding.addEventListener("click", addOrganFinding);

  dom.organTableBody.addEventListener("click", event => {
    const button = event.target.closest("button[data-delete-organ]");
    if (!button) return;

    organFindings = organFindings.filter(finding => finding.id !== button.dataset.deleteOrgan);
    renderOrganTable();
  });

  dom.manualDiagramUpload.addEventListener("change", event => {
    const file = event.target.files?.[0];
    if (!file) return;

    manualDiagramName = file.name;
    dom.manualDiagramFileName.textContent = file.name;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = () => {
        manualDiagramDataUrl = reader.result;
        dom.manualDiagramPreview.src = manualDiagramDataUrl;
        dom.manualDiagramPreviewWrap.hidden = false;
      };

      reader.readAsDataURL(file);
    } else {
      manualDiagramDataUrl = "";
      dom.manualDiagramPreviewWrap.hidden = false;
      dom.manualDiagramPreview.removeAttribute("src");
    }
  });

  dom.btnSaveDraft.addEventListener("click", () => {
    saveExamination("Draft");
  });

  dom.btnCompleteExam.addEventListener("click", () => {
    saveExamination("Completed");
  });

  dom.clearFormBtn.addEventListener("click", resetForm);

  dom.examSearch.addEventListener("input", renderExaminationTable);
  dom.examStatusFilter.addEventListener("change", renderExaminationTable);

  dom.globalSearch.addEventListener("input", () => {
    activateTab("records");
    dom.examSearch.value = dom.globalSearch.value;
    renderExaminationTable();
  });

  dom.examTableBody.addEventListener("click", event => {
    const button = event.target.closest("button[data-exam-id]");
    if (!button) return;

    selectedExamId = button.dataset.examId;
    populateFullExamDetails(selectedExamId);
  });

  document.getElementById("btnEditExamDetails").addEventListener("click", () => {
    if (selectedExamId) {
      populateFormForEditing(selectedExamId);
    } else {
      alert("Please select an examination record first.");
    }
  });

  dom.viewRecentBtn.addEventListener("click", () => {
    activateTab("records");
  });

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

  document.getElementById("btnCloseSuccessModal").addEventListener("click", () => {
    document.getElementById("successModal").style.display = "none";
  });
}

function readCaseIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("caseId");
}

function init() {
  bindEvents();
  populateCaseSelect();
  setInitialFormValues();
  setDiagramView("front");
  renderInjuryTable();
  renderOrganTable();
  renderExaminationTable();
  renderRecentExaminations();
  updateStats();
  updateTopbarLiveDate();

  const requestedCaseId = readCaseIdFromUrl();

  if (requestedCaseId && findCase(requestedCaseId)) {
    dom.caseSelect.value = requestedCaseId;
    selectCase(requestedCaseId);
  }
}

init();
