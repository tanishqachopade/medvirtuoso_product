"use client";

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
