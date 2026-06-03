"use client";


import { useRef, useState } from "react";
import {
  X,
  User,
  Hash,
  CalendarDays,
  FileText,
  Link2,
  Brain,
  Zap,
  Activity,
  Cpu,
  Upload,
  CheckCircle2,
  Lock,
  FileImage,
  FilePlus2,
  ClipboardList,
  BookOpen,
  Paperclip,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UploadedFile {
  name: string;
  size: number;
}

interface DocumentSlot {
  key: string;
  label: string;
  icon: React.ReactNode;
  files: UploadedFile[];
}

interface AddCaseModalProps {
  isOpen: boolean;
  isEditing: boolean;
  loading: boolean;

  // Patient Details
  patientName: string;
  patientId: string;
  age: string;
  gender: string;
  studyDescription: string;

  // Modalities
  selectedModalities: string[];

  // Link
  imagingLink: string;

  // Setters
  setPatientName: (v: string) => void;
  setPatientId: (v: string) => void;
  setAge: (v: string) => void;
  setGender: (v: string) => void;
  setStudyDescription: (v: string) => void;
  setSelectedModalities: React.Dispatch<React.SetStateAction<string[]>>;
  setImagingLink: (v: string) => void;

  // Actions
  onClose: () => void;
  onSubmit: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Small styled input */
function FieldInput({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  id,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  id: string;
}) {
  return (
    <div className="acm-field">
      <span className="acm-field-icon">{icon}</span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="acm-input"
        autoComplete="off"
      />
    </div>
  );
}

/** Gender toggle M / F / Other */
function GenderSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const opts = [
    { label: "M", val: "Male" },
    { label: "F", val: "Female" },
    { label: "X", val: "Other" },
  ];
  return (
    <div className="acm-gender-row" role="group" aria-label="Gender">
      {opts.map((o) => (
        <button
          key={o.val}
          type="button"
          aria-pressed={value === o.val}
          onClick={() => onChange(o.val)}
          className={`acm-gender-btn${value === o.val ? " acm-gender-btn--active" : ""}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Modality upload card */
function ModalityCard({
  modality,
  selected,
  disabled,
  helperText,
  attachedFile,
  accept,
  onFileSelect,
}: {
  modality: string;
  selected: boolean;
  disabled: boolean;
  helperText?: string;
  attachedFile: UploadedFile | null;
  accept?: string;
  onFileSelect: (file: UploadedFile | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect({
        name: file.name,
        size: file.size,
      });
    }
    // Reset so same file can be re-selected
    e.target.value = "";
  }

  function handleClick() {
    if (!disabled) {
      inputRef.current?.click();
    }
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      aria-pressed={selected}
      className={`acm-modality-card${selected ? " acm-modality-card--active" : ""}${disabled ? " acm-modality-card--disabled" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="acm-hidden-input"
        onChange={handleChange}
        aria-hidden="true"
        tabIndex={-1}
        disabled={disabled}
      />
      <span className="acm-modality-label">{modality}</span>
      {selected && (
        <CheckCircle2
          size={13}
          className="acm-modality-check"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            onFileSelect(null);
          }}
        />
      )}
      {disabled && <Lock size={12} className="acm-modality-lock" />}
      {attachedFile ? (
        <span className="acm-modality-helper">File Attached</span>
      ) : helperText ? (
        <span className="acm-modality-helper">{helperText}</span>
      ) : null}
    </button>
  );
}

/** Compact document upload chip */
function DocChip({
  slot,
  onFiles,
}: {
  slot: DocumentSlot;
  onFiles: (files: UploadedFile[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFiles = slot.files.length > 0;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(e.target.files ?? []).map((f) => ({
      name: f.name,
      size: f.size,
    }));
    onFiles(chosen);
    // Reset so same file can be re-selected
    e.target.value = "";
  }

  return (
    <div
      className={`acm-doc-chip${hasFiles ? " acm-doc-chip--filled" : ""}`}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      aria-label={`Upload ${slot.label}`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="acm-hidden-input"
        onChange={handleChange}
        aria-hidden="true"
        tabIndex={-1}
      />
      <span className="acm-doc-chip-icon">
        {hasFiles ? <CheckCircle2 size={14} /> : slot.icon}
      </span>
      <div className="acm-doc-chip-text">
        <span className="acm-doc-chip-label">{slot.label}</span>
        {hasFiles ? (
          <span className="acm-doc-chip-count">
            {slot.files.length} file{slot.files.length > 1 ? "s" : ""} ·{" "}
            {fmtSize(slot.files.reduce((a, f) => a + f.size, 0))}
          </span>
        ) : (
          <span className="acm-doc-chip-hint">Click to attach</span>
        )}
      </div>
      <Upload size={13} className="acm-doc-chip-arrow" />
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

const MODALITIES: {
  key: string;
  label: string;
  requiresMRI: boolean;
}[] = [
  { key: "MRI", label: "MRI", requiresMRI: false },
  { key: "PET", label: "PET", requiresMRI: true },
  { key: "DWI", label: "DWI", requiresMRI: true },
  { key: "OTHER", label: "OTHER", requiresMRI: false },
];

const INITIAL_DOCS: DocumentSlot[] = [
  {
    key: "clinical_history",
    label: "Clinical History",
    icon: <BookOpen size={14} />,
    files: [],
  },
  {
    key: "consent_form",
    label: "Consent Form",
    icon: <ClipboardList size={14} />,
    files: [],
  },
  {
    key: "case_report",
    label: "Case Report Form",
    icon: <FileText size={14} />,
    files: [],
  },
  {
    key: "patient_info",
    label: "Patient Info Sheet",
    icon: <FileImage size={14} />,
    files: [],
  },
  {
    key: "others",
    label: "Others",
    icon: <Paperclip size={14} />,
    files: [],
  },
];

export default function AddCaseModal({
  isOpen,
  isEditing,
  loading,
  patientName,
  patientId,
  age,
  gender,
  studyDescription,
  selectedModalities,
  imagingLink,
  setPatientName,
  setPatientId,
  setAge,
  setGender,
  setStudyDescription,
  setSelectedModalities,
  setImagingLink,
  onClose,
  onSubmit,
}: AddCaseModalProps) {
  const [docs, setDocs] = useState<DocumentSlot[]>(INITIAL_DOCS);
  const [submitted, setSubmitted] = useState(false);

  const [mriFile, setMriFile] = useState<UploadedFile | null>(null);
  const [petFile, setPetFile] = useState<UploadedFile | null>(null);
  const [dwiFile, setDwiFile] = useState<UploadedFile | null>(null);
  const [otherFile, setOtherFile] = useState<UploadedFile | null>(null);

  const mriSelected = selectedModalities.includes("MRI") || mriFile !== null;

  function handleFileSelect(key: string, file: UploadedFile | null) {
    if (key === "MRI") {
      setMriFile(file);
      if (file) {
        setSelectedModalities((prev) => Array.from(new Set([...prev, "MRI"])));
      } else {
        setPetFile(null);
        setDwiFile(null);
        setSelectedModalities((prev) => prev.filter((m) => m !== "MRI" && m !== "PET" && m !== "DWI"));
      }
    } else if (key === "PET") {
      setPetFile(file);
      if (file) {
        setSelectedModalities((prev) => Array.from(new Set([...prev, "PET"])));
      } else {
        setSelectedModalities((prev) => prev.filter((m) => m !== "PET"));
      }
    } else if (key === "DWI") {
      setDwiFile(file);
      if (file) {
        setSelectedModalities((prev) => Array.from(new Set([...prev, "DWI"])));
      } else {
        setSelectedModalities((prev) => prev.filter((m) => m !== "DWI"));
      }
    } else if (key === "OTHER") {
      setOtherFile(file);
      if (file) {
        setSelectedModalities((prev) => Array.from(new Set([...prev, "OTHER"])));
      } else {
        setSelectedModalities((prev) => prev.filter((m) => m !== "OTHER"));
      }
    }
  }

  function toggleModality(key: string) {
    setSelectedModalities((prev) => {
      if (prev.includes(key)) {
        // Prevent removing MRI if PET/DWI are active
        if (key === "MRI" && (prev.includes("PET") || prev.includes("DWI"))) {
          return prev; // silently block — UI shows lock icon
        }
        return prev.filter((m) => m !== key);
      }
      // PET/DWI auto-adds MRI
      if (key === "PET" || key === "DWI") {
        return Array.from(new Set([...prev, "MRI", key]));
      }
      return [...prev, key];
    });
  }

  function handleDocFiles(key: string, files: UploadedFile[]) {
    setDocs((prev) =>
      prev.map((d) => (d.key === key ? { ...d, files } : d))
    );
  }

  function handleClose() {
    setMriFile(null);
    setPetFile(null);
    setDwiFile(null);
    setOtherFile(null);
    setDocs(INITIAL_DOCS);
    setSubmitted(false);
    onClose();
  }

  async function handleSubmit() {
    setSubmitted(true);
    if (!patientName.trim() || !patientId.trim()) return;
    await onSubmit();
    setMriFile(null);
    setPetFile(null);
    setDwiFile(null);
    setOtherFile(null);
    setDocs(INITIAL_DOCS);
    setSubmitted(false);
  }

  if (!isOpen) return null;

  return (
    <>
      {/* ── Inline styles ── */}
      <style>{ACM_STYLES}</style>

      {/* ── Backdrop ── */}
      <div
        className="acm-backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* ── Dialog ── */}
      <div
        className="acm-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? "Edit Case" : "Add New Case"}
      >
        {/* ══ HEADER ══ */}
        <div className="acm-header">
          <div className="acm-header-left">
            <div className="acm-header-icon">
              <FilePlus2 size={17} />
            </div>
            <div>
              <h2 className="acm-title">
                {isEditing ? "Edit Case" : "Add New Case"}
              </h2>
              <p className="acm-subtitle">
                {isEditing
                  ? "Update patient study information"
                  : "Register a new patient study"}
              </p>
            </div>
          </div>
          <button
            className="acm-close"
            onClick={handleClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* ══ BODY ══ */}
        <div className="acm-body">

          {/* ── LEFT COLUMN ── */}
          <div className="acm-col acm-col-left">

            {/* § 1 Patient Details */}
            <section className="acm-section">
              <div className="acm-section-header">
                <span className="acm-section-dot acm-dot-blue" />
                <h3 className="acm-section-title">Patient Details</h3>
              </div>

              <div className="acm-patient-grid">
                {/* Row 1: Name + ID */}
                <FieldInput
                  id="acm-patient-name"
                  icon={<User size={14} />}
                  placeholder="Patient Name *"
                  value={patientName}
                  onChange={setPatientName}
                />
                <FieldInput
                  id="acm-patient-id"
                  icon={<Hash size={14} />}
                  placeholder="Patient ID *"
                  value={patientId}
                  onChange={setPatientId}
                />

                {/* Row 2: Age + Gender */}
                <FieldInput
                  id="acm-age"
                  icon={<CalendarDays size={14} />}
                  placeholder="Age"
                  value={age}
                  onChange={setAge}
                  type="number"
                />
                <GenderSelector value={gender} onChange={setGender} />
              </div>

              {/* Validation hint */}
              {submitted && (!patientName.trim() || !patientId.trim()) && (
                <div className="acm-validation">
                  <AlertCircle size={13} />
                  Patient Name and ID are required
                </div>
              )}

              {/* Study Description */}
              <div className="acm-textarea-wrap">
                <FileText size={13} className="acm-textarea-icon" />
                <textarea
                  id="acm-study-desc"
                  rows={2}
                  placeholder="Study Description (optional)"
                  value={studyDescription}
                  onChange={(e) => setStudyDescription(e.target.value)}
                  className="acm-textarea"
                />
              </div>
            </section>

            {/* § 2 Modality Uploads */}
            <section className="acm-section">
              <div className="acm-section-header">
                <span className="acm-section-dot acm-dot-indigo" />
                <h3 className="acm-section-title">Modality Uploads</h3>
                {!mriSelected && (
                  <span className="acm-section-badge">MRI required first</span>
                )}
              </div>

              <div className="acm-modality-grid">
                {MODALITIES.map((m) => {
                  let isDisabled = false;
                  let attachedFile: UploadedFile | null = null;
                  let accept: string | undefined = undefined;

                  if (m.key === "MRI") {
                    attachedFile = mriFile;
                    accept = ".dcm,.nii,.nii.gz,.zip,.tar,.gz";
                  } else if (m.key === "PET") {
                    attachedFile = petFile;
                    isDisabled = mriFile === null;
                    accept = ".dcm,.nii,.nii.gz,.zip,.tar,.gz";
                  } else if (m.key === "DWI") {
                    attachedFile = dwiFile;
                    isDisabled = mriFile === null;
                    accept = ".dcm,.nii,.nii.gz,.zip,.tar,.gz";
                  } else if (m.key === "OTHER") {
                    attachedFile = otherFile;
                  }

                  const isSelected = selectedModalities.includes(m.key) || attachedFile !== null;

                  return (
                    <ModalityCard
                      key={m.key}
                      modality={m.label}
                      selected={isSelected}
                      disabled={isDisabled}
                      helperText={isDisabled ? "Needs MRI" : undefined}
                      attachedFile={attachedFile}
                      accept={accept}
                      onFileSelect={(file) => handleFileSelect(m.key, file)}
                    />
                  );
                })}
              </div>

              {selectedModalities.includes("MRI") &&
                (selectedModalities.includes("PET") ||
                  selectedModalities.includes("DWI")) && (
                  <p className="acm-mri-hint">
                    <ChevronRight size={12} />
                    MRI must be removed last — deselect PET/DWI first
                  </p>
                )}
            </section>

            {/* § 3 Report Link */}
            <section className="acm-section acm-section--flat">
              <div className="acm-section-header">
                <span className="acm-section-dot acm-dot-teal" />
                <h3 className="acm-section-title">Report Link</h3>
              </div>
              <div className="acm-field">
                <span className="acm-field-icon">
                  <Link2 size={14} />
                </span>
                <input
                  id="acm-imaging-link"
                  type="url"
                  placeholder="Paste PACS / Drive / imaging URL…"
                  value={imagingLink}
                  onChange={(e) => setImagingLink(e.target.value)}
                  className="acm-input"
                  autoComplete="off"
                />
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="acm-col acm-col-right">
            <section className="acm-section acm-section--full">
              <div className="acm-section-header">
                <span className="acm-section-dot acm-dot-violet" />
                <h3 className="acm-section-title">Documents</h3>
                <span className="acm-section-badge">
                  {docs.filter((d) => d.files.length > 0).length}/{docs.length}{" "}
                  attached
                </span>
              </div>

              <p className="acm-doc-info">
                Attach supporting medical documents. All formats accepted.
              </p>

              <div className="acm-doc-list">
                {docs.map((slot) => (
                  <DocChip
                    key={slot.key}
                    slot={slot}
                    onFiles={(files) => handleDocFiles(slot.key, files)}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* ══ FOOTER ══ */}
        <div className="acm-footer">
          <p className="acm-footer-note">
            * Required fields. Documents are optional.
          </p>
          <div className="acm-footer-actions">
            <button
              type="button"
              onClick={handleClose}
              className="acm-btn acm-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="acm-btn acm-btn-submit"
            >
              {loading ? (
                <>
                  <span className="acm-spinner" />
                  Saving…
                </>
              ) : isEditing ? (
                "Update Case"
              ) : (
                "Create Case"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Styles (scoped to .acm-* prefix) ────────────────────────────────────────

const ACM_STYLES = `
/* ── Reset & base ── */
.acm-backdrop {
  position: fixed;
  inset: 0;
  z-index: 49;
  background: rgba(7, 23, 57, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.acm-dialog {
  position: fixed;
  inset: 0;
  z-index: 50;
  margin: auto;
  display: flex;
  flex-direction: column;
  width: calc(100vw - 48px);
  max-width: 980px;
  height: fit-content;
  max-height: calc(100vh - 48px);
  background: #ffffff;
  border-radius: 20px;
  box-shadow:
    0 0 0 1px rgba(7,23,57,0.08),
    0 24px 64px rgba(7,23,57,0.18),
    0 8px 24px rgba(7,23,57,0.10);
  overflow: hidden;
  font-family: var(--font-geist-sans, 'Inter', system-ui, sans-serif);
}

/* ── Header ── */
.acm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px 13px;
  border-bottom: 1px solid #eef0f5;
  background: linear-gradient(to right, #f8faff, #ffffff);
  flex-shrink: 0;
}

.acm-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.acm-header-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #071739;
  display: grid;
  place-items: center;
  color: #ffffff;
  flex-shrink: 0;
}

.acm-title {
  font-size: 15px;
  font-weight: 700;
  color: #071739;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.acm-subtitle {
  font-size: 11.5px;
  color: #7a8599;
  margin: 2px 0 0;
}

.acm-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e8eaf0;
  background: #f7f9fc;
  color: #6b7280;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.acm-close:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #dc2626;
}

/* ── Body ── */
.acm-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.acm-col {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: hidden;
}

.acm-col-left {
  border-right: 1px solid #eef0f5;
}

.acm-col-right {
  background: #fafbfe;
}

/* ── Section ── */
.acm-section {
  background: #ffffff;
  border: 1px solid #eef0f5;
  border-radius: 14px;
  padding: 13px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.acm-section--flat {
  gap: 8px;
}

.acm-section--full {
  flex: 1;
  background: #ffffff;
  border: 1px solid #eef0f5;
  border-radius: 14px;
  padding: 13px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
}

.acm-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.acm-section-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.acm-dot-blue   { background: #3b82f6; }
.acm-dot-indigo { background: #6366f1; }
.acm-dot-teal   { background: #14b8a6; }
.acm-dot-violet { background: #8b5cf6; }

.acm-section-title {
  font-size: 12.5px;
  font-weight: 700;
  color: #071739;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  margin: 0;
}

.acm-section-badge {
  margin-left: auto;
  font-size: 10.5px;
  font-weight: 600;
  color: #6366f1;
  background: #eef2ff;
  border-radius: 20px;
  padding: 2px 8px;
  white-space: nowrap;
}

/* ── Patient grid ── */
.acm-patient-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

/* ── Field input ── */
.acm-field {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8faff;
  border: 1px solid #e2e8f4;
  border-radius: 10px;
  padding: 0 10px;
  height: 36px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.acm-field:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  background: #ffffff;
}

.acm-field-icon {
  color: #94a3b8;
  display: flex;
  flex-shrink: 0;
}

.acm-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 12.5px;
  color: #1e293b;
  outline: none;
  min-width: 0;
}
.acm-input::placeholder { color: #a0aec0; }

/* ── Gender selector ── */
.acm-gender-row {
  display: flex;
  border: 1px solid #e2e8f4;
  border-radius: 10px;
  overflow: hidden;
  height: 36px;
  background: #f8faff;
}

.acm-gender-btn {
  flex: 1;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  background: transparent;
  border: none;
  border-right: 1px solid #e2e8f4;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.acm-gender-btn:last-child { border-right: none; }
.acm-gender-btn:hover { background: #eef2ff; color: #4f46e5; }
.acm-gender-btn--active {
  background: #071739;
  color: #ffffff;
}

/* ── Validation ── */
.acm-validation {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: #dc2626;
  font-weight: 500;
  padding: 4px 0 0;
}

/* ── Textarea ── */
.acm-textarea-wrap {
  position: relative;
}

.acm-textarea-icon {
  position: absolute;
  top: 9px;
  left: 10px;
  color: #94a3b8;
}

.acm-textarea {
  width: 100%;
  padding: 8px 10px 8px 28px;
  font-size: 12.5px;
  color: #1e293b;
  background: #f8faff;
  border: 1px solid #e2e8f4;
  border-radius: 10px;
  resize: none;
  outline: none;
  line-height: 1.5;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.acm-textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  background: #ffffff;
}
.acm-textarea::placeholder { color: #a0aec0; }

/* ── Modality grid ── */
.acm-modality-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
}

.acm-modality-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 10px 6px 8px;
  border: 1.5px solid #e2e8f4;
  border-radius: 12px;
  background: #f8faff;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.acm-modality-card:hover:not([disabled]) {
  border-color: #6366f1;
  background: #eef2ff;
}
.acm-modality-card--active {
  border-color: #071739 !important;
  background: #071739 !important;
}
.acm-modality-card--disabled {
  opacity: 0.48;
  cursor: not-allowed;
  background: #f1f4fb !important;
}

.acm-modality-icon {
  color: #6366f1;
  display: flex;
}
.acm-modality-icon--active { color: #ffffff; }

.acm-modality-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #071739;
}
.acm-modality-card--active .acm-modality-label { color: #ffffff; }
.acm-modality-card--disabled .acm-modality-label { color: #94a3b8; }

.acm-modality-check {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #86efac;
}
.acm-modality-lock {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #94a3b8;
}
.acm-modality-helper {
  font-size: 9.5px;
  color: #94a3b8;
  font-weight: 500;
}
.acm-modality-card--active .acm-modality-helper {
  color: rgba(255, 255, 255, 0.8) !important;
}

.acm-mri-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #f59e0b;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 7px;
  padding: 5px 9px;
  margin: 0;
}

/* ── Doc list ── */
.acm-doc-info {
  font-size: 11.5px;
  color: #94a3b8;
  margin: -4px 0 0;
}

.acm-doc-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
  overflow: hidden;
}

.acm-hidden-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.acm-doc-chip {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: 1.5px dashed #d1d9ef;
  border-radius: 11px;
  background: #fafbfe;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}
.acm-doc-chip:hover {
  border-color: #8b5cf6;
  background: #f5f3ff;
}
.acm-doc-chip--filled {
  border-style: solid;
  border-color: #22c55e;
  background: #f0fdf4;
}
.acm-doc-chip--filled:hover {
  border-color: #16a34a;
  background: #dcfce7;
}

.acm-doc-chip-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: #eef2ff;
  color: #6366f1;
  flex-shrink: 0;
}
.acm-doc-chip--filled .acm-doc-chip-icon {
  background: #dcfce7;
  color: #16a34a;
}

.acm-doc-chip-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.acm-doc-chip-label {
  font-size: 12.5px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.acm-doc-chip-count {
  font-size: 11px;
  color: #16a34a;
  font-weight: 500;
}

.acm-doc-chip-hint {
  font-size: 11px;
  color: #a0aec0;
}

.acm-doc-chip-arrow {
  color: #94a3b8;
  flex-shrink: 0;
  transition: color 0.15s;
}
.acm-doc-chip:hover .acm-doc-chip-arrow { color: #8b5cf6; }
.acm-doc-chip--filled .acm-doc-chip-arrow { color: #22c55e; }

/* ── Footer ── */
.acm-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 20px;
  border-top: 1px solid #eef0f5;
  background: linear-gradient(to right, #f8faff, #fafbfe);
  flex-shrink: 0;
  gap: 12px;
}

.acm-footer-note {
  font-size: 11px;
  color: #a0aec0;
  margin: 0;
}

.acm-footer-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.acm-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 18px;
  height: 36px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  white-space: nowrap;
}

.acm-btn-cancel {
  background: #ffffff;
  border: 1.5px solid #e2e8f4;
  color: #475569;
}
.acm-btn-cancel:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.acm-btn-submit {
  background: #071739;
  border: 1.5px solid #071739;
  color: #ffffff;
}
.acm-btn-submit:hover:not(:disabled) {
  background: #0b2559;
  border-color: #0b2559;
  box-shadow: 0 4px 12px rgba(7,23,57,0.22);
  transform: translateY(-1px);
}
.acm-btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

/* ── Spinner ── */
.acm-spinner {
  width: 13px;
  height: 13px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: acm-spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes acm-spin { to { transform: rotate(360deg); } }
`;
=======
import {
    X,
    User,
    Hash,
    Calendar,
    Link as LinkIcon,
    Activity,
    Layers,
    Lock,
    FileText,
    Paperclip,
} from "lucide-react";

interface AddCaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingStudyId: string | null;
    onSubmit: () => void;
    patientId: string;
    setPatientId: (val: string) => void;
    patientName: string;
    setPatientName: (val: string) => void;
    age: string;
    setAge: (val: string) => void;
    gender: "M" | "F" | "";
    setGender: (val: "M" | "F" | "") => void;
    studyDescription: string;
    setStudyDescription: (val: string) => void;
    reportUrl: string;
    setReportUrl: (val: string) => void;

    // Files states
    mriFile: File | string | null;
    setMriFile: (val: File | string | null) => void;
    petFile: File | string | null;
    setPetFile: (val: File | string | null) => void;
    dwiFile: File | string | null;
    setDwiFile: (val: File | string | null) => void;
    otherModalityFile: File | string | null;
    setOtherModalityFile: (val: File | string | null) => void;

    // Document states
    docMedicalHistory: File | string | null;
    setDocMedicalHistory: (val: File | string | null) => void;
    docConsent: File | string | null;
    setDocConsent: (val: File | string | null) => void;
    docCaseReport: File | string | null;
    setDocCaseReport: (val: File | string | null) => void;
    docPatientInfo: File | string | null;
    setDocPatientInfo: (val: File | string | null) => void;
    docOthers: File | string | null;
    setDocOthers: (val: File | string | null) => void;

    setModality: (val: string) => void;
    loading: boolean;
}

export default function AddCaseModal({
    isOpen,
    onClose,
    editingStudyId,
    onSubmit,
    patientId,
    setPatientId,
    patientName,
    setPatientName,
    age,
    setAge,
    gender,
    setGender,
    studyDescription,
    setStudyDescription,
    reportUrl,
    setReportUrl,
    mriFile,
    setMriFile,
    petFile,
    setPetFile,
    dwiFile,
    setDwiFile,
    otherModalityFile,
    setOtherModalityFile,
    docMedicalHistory,
    setDocMedicalHistory,
    docConsent,
    setDocConsent,
    docCaseReport,
    setDocCaseReport,
    docPatientInfo,
    setDocPatientInfo,
    docOthers,
    setDocOthers,
    setModality,
    loading,
}: AddCaseModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-[0_20px_40px_rgba(15,23,42,0.12)] border border-slate-100 flex flex-col relative overflow-hidden transition-all duration-300">

                {/* Top brand accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#071739]" />

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-slate-100 bg-[#fdfdfe]">
                    <div>
                        <h2 className="text-base font-bold text-[#071739] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse inline-block"></span>
                            {editingStudyId ? "Edit Study Case" : "Add New Clinical Case"}
                        </h2>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                            Provide patient info, attach diagnostic scans, and link reports.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-150"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* 2-Column Layout: Left = Patient + Modalities | Right = Report + Documents */}
                <div className="px-6 py-4 grid grid-cols-2 gap-5 bg-[#fcfcfd]">

                    {/* ═══════════ LEFT SECTION: Patient Details + Modality Scans ═══════════ */}
                    <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-4 shadow-sm">

                        {/* Section Header: Patient Details */}
                        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                            <User size={14} className="text-blue-600 shrink-0" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Patient Details</span>
                        </div>

                        {/* Patient Form Grid */}
                        <div className="space-y-3">
                            {/* Row 1: Name & ID */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Patient Name</span>
                                    <div className="relative">
                                        <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                                        <input
                                            type="text"
                                            placeholder="e.g. Eleanor Vance"
                                            value={patientName}
                                            onChange={(e) => setPatientName(e.target.value)}
                                            className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-slate-200 rounded-lg outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739]/10 transition-all bg-white text-slate-800 font-medium placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Patient ID</span>
                                    <div className="relative">
                                        <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                                        <input
                                            type="text"
                                            placeholder="e.g. PT-8291"
                                            value={patientId}
                                            onChange={(e) => setPatientId(e.target.value)}
                                            className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-slate-200 rounded-lg outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739]/10 transition-all bg-white text-slate-800 font-medium placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Age, Gender, Study Description */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Age</span>
                                    <div className="relative">
                                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                                        <input
                                            type="number"
                                            placeholder="42"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-slate-200 rounded-lg outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739]/10 transition-all bg-white text-slate-800 font-medium placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Gender</span>
                                    <div className="flex rounded-lg border border-slate-200 p-0.5 bg-white h-[32px]">
                                        <button
                                            type="button"
                                            onClick={() => setGender("M")}
                                            className={`flex-1 text-[11px] font-bold rounded-md transition-all ${gender === "M"
                                                ? "bg-[#071739] text-white shadow-sm"
                                                : "text-slate-600 hover:bg-slate-50"
                                                }`}
                                        >
                                            Male
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setGender("F")}
                                            className={`flex-1 text-[11px] font-bold rounded-md transition-all ${gender === "F"
                                                ? "bg-[#071739] text-white shadow-sm"
                                                : "text-slate-600 hover:bg-slate-50"
                                                }`}
                                        >
                                            Female
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Study Desc.</span>
                                    <input
                                        type="text"
                                        placeholder="Clinical details..."
                                        value={studyDescription}
                                        onChange={(e) => setStudyDescription(e.target.value)}
                                        className="w-full px-3 py-1.5 text-[12px] border border-slate-200 rounded-lg outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739]/10 transition-all bg-white text-slate-800 font-medium placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-100" />

                        {/* Modality Scans Sub-Section */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Layers size={14} className="text-blue-600 shrink-0" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Modality Scans</span>
                                </div>
                                <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">DICOM files</span>
                            </div>

                            {/* 2x2 Modality Grid */}
                            <div className="grid grid-cols-2 gap-2">

                                {/* MRI Card */}
                                <div
                                    onClick={() => {
                                        if (!mriFile) document.getElementById("mri-card-file")?.click();
                                    }}
                                    className={`group flex items-center justify-between px-3 py-2 rounded-lg border-2 transition-all cursor-pointer ${mriFile
                                        ? "border-green-500/20 bg-green-50/30"
                                        : "border-dashed border-slate-200 hover:border-blue-500/30 hover:bg-slate-50/50"
                                        }`}
                                >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <Activity size={14} className={mriFile ? "text-green-600" : "text-slate-400 group-hover:text-blue-600"} />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11px] font-bold text-slate-700 leading-tight">MRI Scan</p>
                                            <p className="text-[9px] text-slate-400 truncate leading-none mt-0.5">
                                                {mriFile ? (typeof mriFile === "string" ? mriFile : mriFile.name) : "Attach *.dcm"}
                                            </p>
                                        </div>
                                    </div>
                                    {mriFile && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMriFile(null);
                                                setPetFile(null);
                                                setDwiFile(null);
                                            }}
                                            className="p-0.5 text-slate-400 hover:text-red-500 rounded"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                    <input
                                        type="file"
                                        id="mri-card-file"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setMriFile(file);
                                                setModality("MRI");
                                            }
                                        }}
                                    />
                                </div>

                                {/* OTHER Card */}
                                <div
                                    onClick={() => {
                                        if (!otherModalityFile) document.getElementById("other-card-file")?.click();
                                    }}
                                    className={`group flex items-center justify-between px-3 py-2 rounded-lg border-2 transition-all cursor-pointer ${otherModalityFile
                                        ? "border-green-500/20 bg-green-50/30"
                                        : "border-dashed border-slate-200 hover:border-blue-500/30 hover:bg-slate-50/50"
                                        }`}
                                >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <Layers size={14} className={otherModalityFile ? "text-green-600" : "text-slate-400 group-hover:text-blue-600"} />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11px] font-bold text-slate-700 leading-tight">OTHER Scan</p>
                                            <p className="text-[9px] text-slate-400 truncate leading-none mt-0.5">
                                                {otherModalityFile ? (typeof otherModalityFile === "string" ? otherModalityFile : otherModalityFile.name) : "CT / Ultrasound"}
                                            </p>
                                        </div>
                                    </div>
                                    {otherModalityFile && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOtherModalityFile(null);
                                            }}
                                            className="p-0.5 text-slate-400 hover:text-red-500 rounded"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                    <input
                                        type="file"
                                        id="other-card-file"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setOtherModalityFile(file);
                                                setModality("OTHER");
                                            }
                                        }}
                                    />
                                </div>

                                {/* PET Card */}
                                <div
                                    onClick={() => {
                                        if (mriFile && !petFile) document.getElementById("pet-card-file")?.click();
                                    }}
                                    className={`group flex items-center justify-between px-3 py-2 rounded-lg border-2 transition-all ${!mriFile
                                        ? "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
                                        : petFile
                                            ? "border-green-500/20 bg-green-50/30 cursor-pointer"
                                            : "border-dashed border-slate-200 hover:border-blue-500/30 hover:bg-slate-50/50 cursor-pointer"
                                        }`}
                                >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        {!mriFile ? (
                                            <Lock size={13} className="text-slate-300" />
                                        ) : (
                                            <Activity size={14} className={petFile ? "text-green-600" : "text-slate-400 group-hover:text-blue-600"} />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11px] font-bold text-slate-700 leading-tight">PET Scan</p>
                                            <p className="text-[9px] text-slate-400 truncate leading-none mt-0.5">
                                                {petFile ? (typeof petFile === "string" ? petFile : petFile.name) : "Attach *.dcm"}
                                            </p>
                                        </div>
                                    </div>
                                    {petFile && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPetFile(null);
                                            }}
                                            className="p-0.5 text-slate-400 hover:text-red-500 rounded"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                    {mriFile && (
                                        <input
                                            type="file"
                                            id="pet-card-file"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setPetFile(file);
                                                    setModality("PET");
                                                }
                                            }}
                                        />
                                    )}
                                </div>

                                {/* DWI Card */}
                                <div
                                    onClick={() => {
                                        if (mriFile && !dwiFile) document.getElementById("dwi-card-file")?.click();
                                    }}
                                    className={`group flex items-center justify-between px-3 py-2 rounded-lg border-2 transition-all ${!mriFile
                                        ? "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
                                        : dwiFile
                                            ? "border-green-500/20 bg-green-50/30 cursor-pointer"
                                            : "border-dashed border-slate-200 hover:border-blue-500/30 hover:bg-slate-50/50 cursor-pointer"
                                        }`}
                                >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        {!mriFile ? (
                                            <Lock size={13} className="text-slate-300" />
                                        ) : (
                                            <Activity size={14} className={dwiFile ? "text-green-600" : "text-slate-400 group-hover:text-blue-600"} />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11px] font-bold text-slate-700 leading-tight">DWI Scan</p>
                                            <p className="text-[9px] text-slate-400 truncate leading-none mt-0.5">
                                                {dwiFile ? (typeof dwiFile === "string" ? dwiFile : dwiFile.name) : "Attach *.dcm"}
                                            </p>
                                        </div>
                                    </div>
                                    {dwiFile && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDwiFile(null);
                                            }}
                                            className="p-0.5 text-slate-400 hover:text-red-500 rounded"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                    {mriFile && (
                                        <input
                                            type="file"
                                            id="dwi-card-file"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setDwiFile(file);
                                                    setModality("DWI");
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══════════ RIGHT SECTION: Report Link + Clinical Attachments ═══════════ */}
                    <div className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm flex flex-col">

                        {/* Section Header */}
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-4">
                            <div className="flex items-center gap-2">
                                <FileText size={14} className="text-blue-600 shrink-0" />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Report & Documents</span>
                            </div>
                            <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">Metadata</span>
                        </div>

                        {/* Diagnostic Report URL */}
                        <div className="space-y-1 mb-4">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Diagnostic Report Link</span>
                            <div className="relative">
                                <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                                <input
                                    type="text"
                                    placeholder="Paste PACS URL, Google Drive or PDF link"
                                    value={reportUrl}
                                    onChange={(e) => setReportUrl(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-slate-200 rounded-lg outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739]/10 transition-all bg-white text-slate-800 font-medium placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* Support Documents */}
                        <div className="space-y-2.5 flex-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Support Attachments</span>
                            <div className="space-y-2">

                                {/* 1. Medical History */}
                                <div className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${docMedicalHistory ? "border-green-500/20 bg-green-50/30 text-green-700" : "border-slate-200/80 bg-white hover:bg-slate-50/30"
                                    }`}>
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <Paperclip size={12} className={docMedicalHistory ? "text-green-600 shrink-0" : "text-slate-400 shrink-0"} />
                                        <span className="text-[11px] font-semibold text-slate-600 truncate">
                                            {docMedicalHistory ? (typeof docMedicalHistory === "string" ? docMedicalHistory : docMedicalHistory.name) : "Medical History"}
                                        </span>
                                    </div>
                                    <div className="shrink-0 ml-2">
                                        {docMedicalHistory ? (
                                            <button type="button" onClick={() => setDocMedicalHistory(null)} className="text-slate-400 hover:text-red-500 text-[11px]">✕</button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById("h-doc")?.click()}
                                                className="text-[10px] font-bold text-[#071739] hover:text-[#0b2559]"
                                            >
                                                Attach
                                            </button>
                                        )}
                                        <input
                                            type="file"
                                            id="h-doc"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setDocMedicalHistory(file);
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* 2. Consent Form */}
                                <div className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${docConsent ? "border-green-500/20 bg-green-50/30 text-green-700" : "border-slate-200/80 bg-white hover:bg-slate-50/30"
                                    }`}>
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <Paperclip size={12} className={docConsent ? "text-green-600 shrink-0" : "text-slate-400 shrink-0"} />
                                        <span className="text-[11px] font-semibold text-slate-600 truncate">
                                            {docConsent ? (typeof docConsent === "string" ? docConsent : docConsent.name) : "Consent Form"}
                                        </span>
                                    </div>
                                    <div className="shrink-0 ml-2">
                                        {docConsent ? (
                                            <button type="button" onClick={() => setDocConsent(null)} className="text-slate-400 hover:text-red-500 text-[11px]">✕</button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById("c-doc")?.click()}
                                                className="text-[10px] font-bold text-[#071739] hover:text-[#0b2559]"
                                            >
                                                Attach
                                            </button>
                                        )}
                                        <input
                                            type="file"
                                            id="c-doc"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setDocConsent(file);
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* 3. Case Report Form */}
                                <div className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${docCaseReport ? "border-green-500/20 bg-green-50/30 text-green-700" : "border-slate-200/80 bg-white hover:bg-slate-50/30"
                                    }`}>
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <Paperclip size={12} className={docCaseReport ? "text-green-600 shrink-0" : "text-slate-400 shrink-0"} />
                                        <span className="text-[11px] font-semibold text-slate-600 truncate">
                                            {docCaseReport ? (typeof docCaseReport === "string" ? docCaseReport : docCaseReport.name) : "Case Report Form"}
                                        </span>
                                    </div>
                                    <div className="shrink-0 ml-2">
                                        {docCaseReport ? (
                                            <button type="button" onClick={() => setDocCaseReport(null)} className="text-slate-400 hover:text-red-500 text-[11px]">✕</button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById("cr-doc")?.click()}
                                                className="text-[10px] font-bold text-[#071739] hover:text-[#0b2559]"
                                            >
                                                Attach
                                            </button>
                                        )}
                                        <input
                                            type="file"
                                            id="cr-doc"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setDocCaseReport(file);
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* 4. Patient Info Sheet */}
                                <div className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${docPatientInfo ? "border-green-500/20 bg-green-50/30 text-green-700" : "border-slate-200/80 bg-white hover:bg-slate-50/30"
                                    }`}>
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <Paperclip size={12} className={docPatientInfo ? "text-green-600 shrink-0" : "text-slate-400 shrink-0"} />
                                        <span className="text-[11px] font-semibold text-slate-600 truncate">
                                            {docPatientInfo ? (typeof docPatientInfo === "string" ? docPatientInfo : docPatientInfo.name) : "Patient Info Sheet"}
                                        </span>
                                    </div>
                                    <div className="shrink-0 ml-2">
                                        {docPatientInfo ? (
                                            <button type="button" onClick={() => setDocPatientInfo(null)} className="text-slate-400 hover:text-red-500 text-[11px]">✕</button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById("is-doc")?.click()}
                                                className="text-[10px] font-bold text-[#071739] hover:text-[#0b2559]"
                                            >
                                                Attach
                                            </button>
                                        )}
                                        <input
                                            type="file"
                                            id="is-doc"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setDocPatientInfo(file);
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* 5. Others */}
                                <div className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${docOthers ? "border-green-500/20 bg-green-50/30 text-green-700" : "border-slate-200/80 bg-white hover:bg-slate-50/30"
                                    }`}>
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <Paperclip size={12} className={docOthers ? "text-green-600 shrink-0" : "text-slate-400 shrink-0"} />
                                        <span className="text-[11px] font-semibold text-slate-600 truncate">
                                            {docOthers ? (typeof docOthers === "string" ? docOthers : docOthers.name) : "Others"}
                                        </span>
                                    </div>
                                    <div className="shrink-0 ml-2">
                                        {docOthers ? (
                                            <button type="button" onClick={() => setDocOthers(null)} className="text-slate-400 hover:text-red-500 text-[11px]">✕</button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById("o-doc")?.click()}
                                                className="text-[10px] font-bold text-[#071739] hover:text-[#0b2559]"
                                            >
                                                Attach
                                            </button>
                                        )}
                                        <input
                                            type="file"
                                            id="o-doc"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setDocOthers(file);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-slate-100 bg-[#fbfbfe]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-1.5 text-[12px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition duration-150"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={loading}
                        className="px-6 py-1.5 text-[12px] font-bold bg-[#071739] hover:bg-[#0b2559] disabled:bg-[#071739]/60 text-white rounded-lg shadow transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <span>{editingStudyId ? "Update Study" : "Submit Case"}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

