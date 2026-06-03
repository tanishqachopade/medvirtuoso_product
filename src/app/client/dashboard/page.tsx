"use client";

import WorklistToolbar from "@/components/client-dashboard/WorklistToolbar";
import AddCaseModal from "@/components/client-dashboard/AddCaseModal";
import { useRouter } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  Eye,
  Pencil,
  Trash2,
  MessageSquare,
  Download,
  FileText,
  UploadCloud,
  CheckCircle2,
  Lock,
  User,
  Hash,
  Calendar,
  Activity,
  Layers,
  Link,
  Check,
  X,
  Paperclip,
} from "lucide-react";

export default function ClientDashboard() {

  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  const [editingStudyId, setEditingStudyId] = useState<string | null>(null);

  // COMMENTS STATES
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedStudyId, setSelectedStudyId] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);

  // FORM STATES
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [studyDescription, setStudyDescription] = useState("");
  const [selectedModalities, setSelectedModalities] = useState<string[]>([]);
  const [modality, setModality] = useState("");
  const [imagingLink, setImagingLink] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "">("");
  const [reportUrl, setReportUrl] = useState("");

  // MODALITY UPLOAD STATES
  const [mriFile, setMriFile] = useState<File | string | null>(null);
  const [petFile, setPetFile] = useState<File | string | null>(null);
  const [dwiFile, setDwiFile] = useState<File | string | null>(null);
  const [otherModalityFile, setOtherModalityFile] = useState<File | string | null>(null);

  // DOCUMENT UPLOAD STATES
  const [docMedicalHistory, setDocMedicalHistory] = useState<File | string | null>(null);
  const [docConsent, setDocConsent] = useState<File | string | null>(null);
  const [docCaseReport, setDocCaseReport] = useState<File | string | null>(null);
  const [docPatientInfo, setDocPatientInfo] = useState<File | string | null>(null);
  const [docOthers, setDocOthers] = useState<File | string | null>(null);

  const [loading, setLoading] = useState(false);

  // DATABASE STUDIES
  const [studies, setStudies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // =========================
  // FETCH STUDIES
  // =========================
  async function fetchStudies() {
    try {
      const response = await fetch("/api/studies");

      if (!response.ok) {
        throw new Error("API failed");
      }

      const data = await response.json();


if (Array.isArray(data)) {
  setStudies(data);
} else {
  throw new Error("Invalid API response");
}
    } catch (error) {
      console.error("API failed or unconfigured, seeding mock studies:", error);
      setStudies([
        {
          id: "study_mock_1",
          patient: {
            patientId: "PT-8291",
            patientName: "Eleanor Vance",
            age: "42",
            gender: "F",
          },
          studyDescription: "Brain MRI Metastasis Screening",
          modality: "MRI",
          status: "READY",
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          imagingLink: "https://pacs.medvirtuoso.com/study/pt-8291",
          report: {
            id: "report_mock_1",
            reportUrl: "https://pdfobject.com/pdf/sample.pdf",
          },
        },
        {
          id: "study_mock_2",
          patient: {
            patientId: "PT-0912",
            patientName: "Marcus Sterling",
            age: "58",
            gender: "M",
          },
          studyDescription: "Whole Body PET-CT Oncology Staging",
          modality: "PET",
          status: "PROCESSING",
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          imagingLink: "https://pacs.medvirtuoso.com/study/pt-0912",
          report: null,
        },
        {
          id: "study_mock_3",
          patient: {
            patientId: "PT-4392",
            patientName: "Sarah Jenkins",
            age: "31",
            gender: "F",
          },
          studyDescription: "Ischemic Stroke DWI Assessment",
          modality: "DWI",
          status: "UPLOADED",
          createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
          imagingLink: "",
          report: null,
        },
      ]);
    }
  }

  useEffect(() => {
    fetchStudies();
  }, []);

  const filteredStudies = studies.filter((study) => {
    const matchesSearch =
      study.patient?.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.patient?.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.studyDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.modality?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ? true : study.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // FETCH COMMENTS
  // =========================
  async function fetchComments(studyId: string) {
    try {
      const response = await fetch(`/api/studies/${studyId}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  }

  // =========================
  // OPEN COMMENTS
  // =========================
  async function openComments(studyId: string) {
    setSelectedStudyId(studyId);
    setShowCommentsModal(true);
    await fetchComments(studyId);
  }

  // =========================
  // SEND MESSAGE
  // =========================
  async function handleSendMessage() {
    try {
      if (!message || !selectedStudyId) {
        return;
      }

      setCommentsLoading(true);

      const response = await fetch(`/api/studies/${selectedStudyId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          role: "CLIENT",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      setMessage("");
      await fetchComments(selectedStudyId);
    } catch (error) {
      console.error(error);
      alert("Failed to send message");
    } finally {
      setCommentsLoading(false);
    }
  }

  // =========================
  // EDIT FUNCTION
  // =========================
  function handleEdit(study: any) {
    setEditingStudyId(study.id);
    setPatientId(study.patient?.patientId || "");
    setPatientName(study.patient?.patientName || "");
    setStudyDescription(study.studyDescription || "");
    setSelectedModalities(
      study.modality
        ? study.modality.split(",").map((m: string) => m.trim())
        : []
    );
    setImagingLink(study.imagingLink || "");
    setAge(study.patient?.age || "");
    setGender(study.patient?.gender || "");
    setReportUrl(study.report?.reportUrl || "");

    if (study.modality) {
      if (study.modality === "OTHER") {
        setOtherModalityFile("scan_other_existing.dcm");
      } else {
        setMriFile("scan_mri_existing.dcm");
      }
    }

    setShowModal(true);
  }

  // =========================
  // DELETE FUNCTION
  // =========================

  async function handleDelete(
  id: string
) {
  try {

    const confirmed =
      window.confirm(
        "Delete this study?"
      );

    if (!confirmed) {
      return;
    }

    const response =
      await fetch(
        `/api/studies/${id}`,
        {
          method: "DELETE",
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error
      );
    }

    await fetchStudies();

    alert(
      "Study deleted successfully"
    );

  } catch (error) {

    console.error(error);

    alert(
      "Failed to delete study"
    );
  }
}
  

  // =========================
  // SUBMIT FUNCTION
  // =========================
  async function handleSubmit() {
    if (!patientId.trim()) {
      alert("Patient ID is required.");
      return;
    }

    if (!patientName.trim()) {
      alert("Patient Name is required.");
      return;
    }

    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

         if (editingStudyId) {

  const response = await fetch(
    `/api/studies/${editingStudyId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId,
        patientName,
        studyDescription,
        modality: selectedModalities.join(", "),
        imagingLink,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  await fetchStudies();

  alert("Study updated successfully");
}
         
else {

  const response = await fetch("/api/studies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      patientId,
      patientName,
      studyDescription,
      modality: selectedModalities.join(", "),
      imagingLink,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  const studyId = data.study.id;

  const filesToUpload = [

    mriFile,
    petFile,
    dwiFile,
    otherModalityFile,

    docMedicalHistory,
    docConsent,
    docCaseReport,
    docPatientInfo,
    docOthers,

  ].filter(Boolean);

  for (const file of filesToUpload) {

    const formData =
      new FormData();

    formData.append(
      "file",
      file as File
    );

    const uploadResponse =
      await fetch(
        `/api/studies/${studyId}/files`,
        {
          method: "POST",
          body: formData,
        }
      );

    if (!uploadResponse.ok) {
      throw new Error(
        "Failed to upload file"
      );
    }
  }

  await fetchStudies();

  alert("Study created successfully");
}
   
      // RESET FORM
      setPatientId("");
      setPatientName("");
      setAge("");
      setGender("");
      setStudyDescription("");
      setSelectedModalities([]);
      setImagingLink("");
      setReportUrl("");
      setMriFile(null);
      setPetFile(null);
      setDwiFile(null);
      setOtherModalityFile(null);
      setDocMedicalHistory(null);
      setDocConsent(null);
      setDocCaseReport(null);
      setDocPatientInfo(null);
      setDocOthers(null);
      setEditingStudyId(null);
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <WorklistToolbar onAddCase={() => setShowModal(true)} />

      {/* WORKLIST */}
      <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(15,23,42,0.04)] border border-gray-100 overflow-hidden">

        {/* HEADER */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

            {/* LEFT */}
            <div className="space-y-4 flex-1">
              <h2 className="text-xl font-semibold text-[#071739]">Worklist</h2>

              {/* SEARCH */}
              <div className="relative w-full max-w-md">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3 self-start">
              <div className="bg-[#f7f9fc] px-5 py-3 rounded-xl border border-gray-100 min-w-[95px]">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-base font-semibold text-[#071739]">{studies.length}</p>
              </div>

              <div className="bg-[#f7f9fc] px-5 py-3 rounded-xl border border-gray-100 min-w-[95px]">
                <p className="text-xs text-gray-500">Ready</p>
                <p className="text-base font-semibold text-green-600">
                  {studies.filter((s) => s.status === "READY").length}
                </p>
              </div>

              <div className="bg-[#f7f9fc] px-5 py-3 rounded-xl border border-gray-100 min-w-[95px]">
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-base font-semibold text-yellow-600">
                  {studies.filter((s) => s.status !== "READY").length}
                </p>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 hover:bg-gray-50 px-4 py-3 rounded-xl text-sm transition bg-white"
              >
                <option value="ALL">All</option>
                <option value="UPLOADED">Uploaded</option>
                <option value="PROCESSING">Processing</option>
                <option value="READY">Ready</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f9fbfd] text-left">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Patient ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Patient Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Study Description</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Modality</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date & Time</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudies.map((study) => (
                <tr
                  key={study.id}
                  className="border-t border-gray-100 hover:bg-[#fafcff] transition"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {study.patient?.patientId || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-[#071739]">
                    {study.patient?.patientName || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {study.studyDescription || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {study.modality || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                        study.status === "READY"
                          ? "bg-green-100 text-green-700"
                          : study.status === "PROCESSING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {study.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(study.createdAt).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
  onClick={() => router.push(`/viewer/${study.id}`)}
  className="p-2 rounded-lg hover:bg-blue-50 transition"
>
  <Eye size={17} className="text-blue-600" />
</button>

                      <button
                        onClick={() => handleEdit(study)}
                        className="p-2 rounded-lg hover:bg-yellow-50 transition"
                      >
                        <Pencil size={17} className="text-yellow-600" />
                      </button>

                      <button
                        onClick={() => openComments(study.id)}
                        className="p-2 rounded-lg hover:bg-purple-50 transition"
                      >
                        <MessageSquare size={17} className="text-purple-600" />
                      </button>

                      <button
                        disabled={!study.report}
                        onClick={() => {
                          if (study.report?.reportUrl) {
                            window.open(study.report.reportUrl, "_blank");
                          }
                        }}
                        className={`p-2 rounded-lg transition ${
                          study.report
                            ? "hover:bg-green-50"
                            : "opacity-40 cursor-not-allowed"
                        }`}
                      >
                        <Download size={17} className="text-green-600" />
                      </button>

                      <button
                        onClick={() => handleDelete(study.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 size={17} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      <AddCaseModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingStudyId(null);
        }}
        editingStudyId={editingStudyId}
        onSubmit={handleSubmit}
        patientId={patientId}
        setPatientId={setPatientId}
        patientName={patientName}
        setPatientName={setPatientName}
        age={age}
        setAge={setAge}
        gender={gender}
        setGender={setGender}
        studyDescription={studyDescription}
        setStudyDescription={setStudyDescription}
        reportUrl={reportUrl}
        setReportUrl={setReportUrl}
        mriFile={mriFile}
        setMriFile={setMriFile}
        petFile={petFile}
        setPetFile={setPetFile}
        dwiFile={dwiFile}
        setDwiFile={setDwiFile}
        otherModalityFile={otherModalityFile}
        setOtherModalityFile={setOtherModalityFile}
        docMedicalHistory={docMedicalHistory}
        setDocMedicalHistory={setDocMedicalHistory}
        docConsent={docConsent}
        setDocConsent={setDocConsent}
        docCaseReport={docCaseReport}
        setDocCaseReport={setDocCaseReport}
        docPatientInfo={docPatientInfo}
        setDocPatientInfo={setDocPatientInfo}
        docOthers={docOthers}
        setDocOthers={setDocOthers}
        setModality={setModality}
        loading={loading}
      />

      {/* COMMENTS MODAL */}
      {showCommentsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-[28px] shadow-2xl border border-gray-100 flex flex-col max-h-[85vh]">

            {/* HEADER */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#071739]">Study Notes</h2>
                <p className="text-sm text-gray-500 mt-1">Client ↔ Operator communication</p>
              </div>
              <button
                onClick={() => setShowCommentsModal(false)}
                className="text-gray-400 hover:text-black text-2xl"
              >
                ✕
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fafcff]">
              {comments.length === 0 && (
                <p className="text-sm text-gray-500">No messages yet.</p>
              )}

              {comments.map((comment) => {
                const isOperator = comment.user?.role === "OPERATOR";

                return (
                  <div
                    key={comment.id}
                    className={`flex ${isOperator ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                        isOperator
                          ? "bg-[#071739] text-white rounded-br-md"
                          : "bg-white border border-gray-200 text-black rounded-bl-md"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <p
                          className={`text-xs font-semibold ${
                            isOperator ? "text-blue-200" : "text-gray-500"
                          }`}
                        >
                          {comment.user?.name}
                        </p>
                        <p
                          className={`text-[11px] ${
                            isOperator ? "text-gray-300" : "text-gray-400"
                          }`}
                        >
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed">{comment.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* INPUT */}
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <input
                type="text"
                placeholder="Write a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={commentsLoading}
                className="bg-[#071739] hover:bg-[#0b2559] text-white px-6 rounded-2xl text-sm font-medium transition"
              >
                {commentsLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
