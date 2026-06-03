"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  Eye,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  FileUp,
  Pencil,
  Download,
} from "lucide-react";

export default function OperatorDashboard() {

  const VIEWER_URL =
    process.env.NEXT_PUBLIC_VIEWER_URL ||
    "http://localhost:6080/vnc.html?autoconnect=true&resize=scale";

  const handleOpenViewer = () => {
    window.open(VIEWER_URL, "_blank");
  };

  const [studies, setStudies] =
    useState<any[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  // =========================
  // COMMENTS
  // =========================
  const [
    showCommentsModal,
    setShowCommentsModal,
  ] = useState(false);

  const [
    selectedStudyId,
    setSelectedStudyId,
  ] = useState<string | null>(
    null
  );

  const [comments, setComments] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  const [
    commentsLoading,
    setCommentsLoading,
  ] = useState(false);

  // =========================
  // EDIT METADATA
  // =========================
  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);

  const [
    editingStudy,
    setEditingStudy,
  ] = useState<any>(null);

  const [patientName, setPatientName] =
    useState("");

  const [patientId, setPatientId] =
    useState("");

  const [
    studyDescription,
    setStudyDescription,
  ] = useState("");

  const [modality, setModality] =
    useState("");

  // =========================
  // FETCH STUDIES
  // =========================
  async function fetchStudies() {

    try {

      const response =
        await fetch(
          "/api/studies"
        );

      const data =
        await response.json();

      setStudies(data);

    } catch (error) {

      console.error(error);
    }
  }

  useEffect(() => {
    fetchStudies();
  }, []);

  // =========================
  // FILTER
  // =========================
  const filteredStudies =
    studies.filter((study) => {

      return (

        study.patient?.patientName
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        study.patient?.patientId
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        study.studyDescription
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        study.modality
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
      );
    });

    // =========================
// DOWNLOAD FILES
// =========================
function downloadFiles(
  study: any
) {

  if (
    !study.files ||
    study.files.length === 0
  ) {

    alert(
      "No files uploaded"
    );

    return;
  }

  study.files.forEach(
    (file: any) => {

      window.open(
        file.fileUrl,
        "_blank"
      );

    }
  );
}

  // =========================
  // STATUS UPDATE
  // =========================
  async function updateStatus(
    studyId: string,
    status: string
  ) {

    try {

      await fetch(
        `/api/studies/${studyId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      await fetchStudies();

    } catch (error) {

      console.error(error);
    }
  }

  // =========================
  // COMMENTS
  // =========================
  async function fetchComments(
    studyId: string
  ) {

    try {

      const response =
        await fetch(
          `/api/studies/${studyId}/comments`
        );

      const data =
        await response.json();

      setComments(data);

    } catch (error) {

      console.error(error);
    }
  }

  async function openComments(
    studyId: string
  ) {

    setSelectedStudyId(
      studyId
    );

    setShowCommentsModal(true);

    await fetchComments(
      studyId
    );
  }

  async function handleSendMessage() {

    try {

      if (
        !message ||
        !selectedStudyId
      ) {
        return;
      }

      setCommentsLoading(true);

      const response =
        await fetch(
          `/api/studies/${selectedStudyId}/comments`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message,
              role: "OPERATOR",
            }),
          }
        );

      if (!response.ok) {

        alert(
          "Failed to send message"
        );

        return;
      }

      setMessage("");

      await fetchComments(
        selectedStudyId
      );

    } catch (error) {

      console.error(error);

    } finally {

      setCommentsLoading(false);
    }
  }

  // =========================
  // OPEN EDIT
  // =========================
  function openEditModal(
    study: any
  ) {

    setEditingStudy(study);

    setPatientName(
      study.patient?.patientName ||
      ""
    );

    setPatientId(
      study.patient?.patientId ||
      ""
    );

    setStudyDescription(
      study.studyDescription ||
      ""
    );

    setModality(
      study.modality || ""
    );

    setShowEditModal(true);
  }

  // =========================
  // SAVE METADATA
  // =========================
  async function saveMetadata() {

    try {

      const response =
        await fetch(
          `/api/studies/${editingStudy.id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              patientName,
              patientId,
              studyDescription,
              modality,

              imagingLink:
                editingStudy?.imagingLink,
            }),
          }
        );

      if (!response.ok) {

        alert(
          "Failed to update metadata"
        );

        return;
      }

      alert(
        "Metadata updated successfully"
      );

      setShowEditModal(false);

      await fetchStudies();

    } catch (error) {

      console.error(error);
    }
  }

  return (

    <div className="min-h-screen bg-[#f7f9fc] p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-[#071739]">
            Operator Worklist
          </h1>

          <p className="text-gray-500 mt-1">
            MedVirtuso
          </p>

        </div>

        {/* STATS */}
        <div className="flex items-center gap-3">

          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">

            <p className="text-xs text-gray-500">
              Total
            </p>

            <p className="text-lg font-semibold text-[#071739]">
              {studies.length}
            </p>

          </div>

          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">

            <p className="text-xs text-gray-500">
              Ready
            </p>

            <p className="text-lg font-semibold text-green-600">
              {
                studies.filter(
                  (s) =>
                    s.status ===
                    "READY"
                ).length
              }
            </p>

          </div>

          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">

            <p className="text-xs text-gray-500">
              Pending
            </p>

            <p className="text-lg font-semibold text-yellow-600">
              {
                studies.filter(
                  (s) =>
                    s.status !==
                    "READY"
                ).length
              }
            </p>

          </div>

        </div>

      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search studies..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#f9fbfd]">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Patient
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Study Description
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Modality
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Imaging Link
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Metadata
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Date & Time
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredStudies.map((study) => {

              const missingMetadata =
                !study.patient?.patientName ||
                !study.patient?.patientId ||
                !study.studyDescription ||
                !study.modality;

              return (

                <tr
                  key={study.id}
                  className="border-t border-gray-100 hover:bg-[#fafcff] transition"
                >

                  {/* PATIENT */}
                  <td className="px-6 py-4">

                    <div>

                      <p className="font-medium text-[#071739]">
                        {study.patient?.patientName || "-"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {study.patient?.patientId || "-"}
                      </p>

                    </div>

                  </td>
                  {/* DESCRIPTION */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {study.studyDescription || "-"}
                  </td>

                  {/* MODALITY */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {study.modality || "-"}
                  </td>

                  {/* LINK */}
                  <td className="px-6 py-4">

                    {study.imagingLink ? (

                      <a
                        href={study.imagingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-xl text-xs font-medium transition"
                      >
                        Open Link
                      </a>

                    ) : (

                      <span className="text-gray-400">
                        -
                      </span>

                    )}

                  </td>

                  {/* METADATA */}
                  <td className="px-6 py-4">

                    {missingMetadata ? (

                      <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-xl text-xs font-medium">

                        <AlertTriangle
                          size={14}
                        />

                        Incomplete

                      </div>

                    ) : (

                      <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-xl text-xs font-medium">

                        <CheckCircle2
                          size={14}
                        />

                        Complete

                      </div>

                    )}

                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">

                    <select
                      value={study.status}
                      onChange={(e) =>
                        updateStatus(
                          study.id,
                          e.target.value
                        )
                      }
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
                    >

                      <option value="UPLOADED">
                        Uploaded
                      </option>

                      <option value="PROCESSING">
                        Processing
                      </option>

                      <option value="READY">
                        Ready
                      </option>

                    </select>

                  </td>

                  {/* DATE & TIME */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(
                      study.createdAt
                    ).toLocaleString()}
                  </td>

                  {/* ACTIONS */}

                  
                  <td className="px-6 py-4">

                    <div className="flex items-center gap-2">

                      <button
  onClick={() =>
    downloadFiles(study)
  }
  className="p-2 rounded-xl hover:bg-blue-50 transition"
>
  <Download
    size={17}
    className="text-blue-600"
  />
</button>

                      <button
                        onClick={handleOpenViewer}

                        className="p-2 rounded-xl hover:bg-blue-50 transition">

                        <Eye
                          size={17}
                          className="text-blue-600"
                        />

                      </button>

                      <button
                        onClick={() =>
                          openComments(
                            study.id
                          )
                        }
                        className="p-2 rounded-xl hover:bg-purple-50 transition"
                      >

                        <MessageSquare
                          size={17}
                          className="text-purple-600"
                        />

                      </button>

                      <button
                        onClick={() =>
                          openEditModal(
                            study
                          )
                        }
                        className="p-2 rounded-xl hover:bg-yellow-50 transition"
                      >

                        <Pencil
                          size={17}
                          className="text-yellow-600"
                        />

                      </button>

                      <label className="p-2 rounded-xl hover:bg-green-50 transition cursor-pointer">

                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"

                          onChange={async (
                            e
                          ) => {

                            const file =
                              e.target
                                .files?.[0];

                            if (!file) {
                              return;
                            }

                            try {

                              const formData =
                                new FormData();

                              formData.append(
                                "file",
                                file
                              );

                              const response =
                                await fetch(
                                  `/api/studies/${study.id}/report`,
                                  {
                                    method:
                                      "POST",
                                    body:
                                      formData,
                                  }
                                );

                              if (
                                !response.ok
                              ) {

                                alert(
                                  "Failed to upload report"
                                );

                                return;
                              }

                              alert(
                                "Report uploaded successfully"
                              );

                              await fetchStudies();

                            } catch (
                            error
                            ) {

                              console.error(
                                error
                              );

                              alert(
                                "Failed to upload report"
                              );
                            }

                          }}
                        />

                        <FileUp
                          size={17}
                          className="text-green-600"
                        />

                      </label>

                    </div>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* COMMENTS MODAL */}
      {showCommentsModal && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-2xl rounded-[28px] shadow-2xl border border-gray-100 flex flex-col max-h-[85vh]">

            <div className="p-6 border-b border-gray-100 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-semibold text-[#071739]">
                  Study Notes
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Operator ↔ Client communication
                </p>

              </div>

              <button
                onClick={() =>
                  setShowCommentsModal(
                    false
                  )
                }
                className="text-gray-400 hover:text-black text-2xl"
              >
                ✕
              </button>

            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fafcff]">

              {comments.length ===
                0 && (

                  <p className="text-sm text-gray-500">
                    No messages yet.
                  </p>

                )}

              {comments.map(
                (comment) => {

                  const isOperator =
                    comment.user?.role ===
                    "OPERATOR";

                  return (

                    <div
                      key={comment.id}
                      className={`flex ${isOperator
                        ? "justify-end"
                        : "justify-start"
                        }`}
                    >

                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${isOperator
                          ? "bg-[#071739] text-white"
                          : "bg-white border border-gray-200 text-black"
                          }`}
                      >

                        <div className="flex items-center justify-between gap-4 mb-1">

                          <p
                            className={`text-xs font-semibold ${isOperator
                              ? "text-blue-200"
                              : "text-gray-500"
                              }`}
                          >
                            {comment.user?.name}
                          </p>

                          <p
                            className={`text-[11px] ${isOperator
                              ? "text-gray-300"
                              : "text-gray-400"
                              }`}
                          >
                            {new Date(
                              comment.createdAt
                            ).toLocaleString()}
                          </p>

                        </div>

                        <p className="text-sm">
                          {comment.message}
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

            <div className="p-5 border-t border-gray-100 flex gap-3">

              <input
                type="text"
                placeholder="Write a message..."
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={
                  handleSendMessage
                }
                disabled={
                  commentsLoading
                }
                className="bg-[#071739] hover:bg-[#0b2559] text-white px-6 rounded-2xl text-sm font-medium transition"
              >
                {commentsLoading
                  ? "Sending..."
                  : "Send"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">

          <div className="bg-white w-full max-w-4xl rounded-[32px] p-10 shadow-2xl my-10">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-10">

              <div>

                <h2 className="text-3xl font-bold text-[#071739]">
                  Edit Study Details
                </h2>

                <p className="text-gray-500 mt-2">
                  Complete or correct patient metadata
                </p>

              </div>

              <button
                onClick={() =>
                  setShowEditModal(false)
                }
                className="text-gray-400 hover:text-black text-3xl"
              >
                ✕
              </button>

            </div>

            {/* IMAGING LINK */}
            <div className="mb-8">

              <h3 className="text-xl font-semibold text-[#071739] mb-4">
                PACS / Drive / Imaging Link
              </h3>

              <input
                type="text"
                placeholder="Paste PACS / Google Drive / Imaging URL"
                value={
                  editingStudy?.imagingLink ||
                  ""
                }
                onChange={(e) =>
                  setEditingStudy({
                    ...editingStudy,
                    imagingLink:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#071739]"
              />

            </div>

            {/* MANUAL ENTRY */}
            <div className="mb-8">

              <h3 className="text-xl font-semibold text-[#071739] mb-5">
                Manual Entry Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <input
                  type="text"
                  placeholder="Enter Patient ID"
                  value={patientId}
                  onChange={(e) =>
                    setPatientId(
                      e.target.value
                    )
                  }
                  className="border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#071739]"
                />

                <input
                  type="text"
                  placeholder="Enter Patient Name"
                  value={patientName}
                  onChange={(e) =>
                    setPatientName(
                      e.target.value
                    )
                  }
                  className="border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#071739]"
                />

                <input
                  type="text"
                  placeholder="Enter Study Description"
                  value={
                    studyDescription
                  }
                  onChange={(e) =>
                    setStudyDescription(
                      e.target.value
                    )
                  }
                  className="border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#071739]"
                />

                <select
                  value={modality}
                  onChange={(e) =>
                    setModality(
                      e.target.value
                    )
                  }
                  className="border border-gray-200 rounded-2xl px-5 py-4 text-sm bg-white outline-none focus:ring-2 focus:ring-[#071739]"
                >

                  <option value="">
                    Select Modality
                  </option>

                  <option value="MRI">
                    MRI
                  </option>

                  <option value="CT">
                    CT
                  </option>

                  <option value="PET">
                    PET
                  </option>

                  <option value="XRAY">
                    XRAY
                  </option>

                  <option value="ULTRASOUND">
                    ULTRASOUND
                  </option>

                  <option value="DWI">
                    DWI
                  </option>

                  <option value="OTHER">
                    OTHER
                  </option>

                </select>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex items-center justify-end gap-4 mt-10">

              <button
                onClick={() =>
                  setShowEditModal(false)
                }
                className="px-6 py-3 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={saveMetadata}
                className="bg-[#071739] hover:bg-[#0b2559] text-white px-8 py-3 rounded-2xl font-medium transition"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}