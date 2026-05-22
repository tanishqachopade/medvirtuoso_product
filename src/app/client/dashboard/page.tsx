"use client";

import WorklistToolbar from "@/components/client-dashboard/WorklistToolbar";

import { useState } from "react";

import {
  Search,
  Eye,
  Pencil,
  Trash2,
  MessageSquare,
} from "lucide-react";

export default function ClientDashboard() {
  const [showModal, setShowModal] =
    useState(false);

  const [studies, setStudies] =
    useState([
      {
        id: "P-1001",
        patientName: "John Doe",
        studyDescription: "MRI Brain",
        modality: "MRI",
        status: "READY",
        datetime:
          "21 May 2026, 10:30 AM",
      },

      {
        id: "P-1002",
        patientName: "Sarah Smith",
        studyDescription: "CT Chest",
        modality: "CT",
        status: "PROCESSING",
        datetime:
          "21 May 2026, 11:15 AM",
      },
    ]);

  return (
    <div className="space-y-6">
      <WorklistToolbar
        onAddCase={() =>
          setShowModal(true)
        }
      />

      {/* WORKLIST */}
      <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(15,23,42,0.04)] border border-gray-100 overflow-hidden">
        {/* SEARCH + FILTER */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* SEARCH */}
          <div className="relative w-full md:w-96">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-11 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* FILTER */}
          <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
            <option>
              All Status
            </option>

            <option>
              Uploaded
            </option>

            <option>
              Processing
            </option>

            <option>
              Ready
            </option>
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f9fbfd] text-left">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Patient ID
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Patient Name
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Study Description
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Modality
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Date & Time
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {studies.map((study) => (
                <tr
                  key={study.id}
                  className="border-t border-gray-100 hover:bg-[#fafcff] transition"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {study.id}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-[#071739]">
                    {study.patientName}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {
                      study.studyDescription
                    }
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {study.modality}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                        study.status === "READY"
                          ? "bg-green-100 text-green-700"
                          : study.status ===
                            "PROCESSING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {study.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {study.datetime}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* VIEW */}
                      <button className="p-2 rounded-lg hover:bg-blue-50 transition">
                        <Eye
                          size={17}
                          className="text-blue-600"
                        />
                      </button>

                      {/* EDIT */}
                      <button className="p-2 rounded-lg hover:bg-yellow-50 transition">
                        <Pencil
                          size={17}
                          className="text-yellow-600"
                        />
                      </button>

                      {/* NOTES */}
                      <button className="p-2 rounded-lg hover:bg-purple-50 transition">
                        <MessageSquare
                          size={17}
                          className="text-purple-600"
                        />
                      </button>

                      {/* DELETE */}
                      <button className="p-2 rounded-lg hover:bg-red-50 transition">
                        <Trash2
                          size={17}
                          className="text-red-600"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-[28px] p-8 shadow-2xl border border-gray-100 overflow-y-auto max-h-[90vh]">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-[#071739]">
                  Add New Case
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Upload study details and
                  documents
                </p>
              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="text-gray-400 hover:text-black text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-8">
              {/* DOCUMENTS */}
              <div>
                <h3 className="text-lg font-semibold text-[#071739] mb-3">
                  Upload Documents
                </h3>

                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-[#fafcff]">
                  <p className="text-sm text-gray-600">
                    Upload consent forms,
                    clinical history, CRF,
                    PDFs, images, DOCX,
                    etc.
                  </p>

                  <input
                    type="file"
                    multiple
                    className="mt-4"
                  />
                </div>
              </div>

              {/* IMAGING LINK */}
              <div>
                <h3 className="text-lg font-semibold text-[#071739] mb-3">
                  PACS / Drive / Imaging
                  Link
                </h3>

                <input
                  type="text"
                  placeholder="Paste imaging link (optional)"
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* MANUAL ENTRY */}
              <div>
                <h3 className="text-lg font-semibold text-[#071739] mb-5">
                  Manual Entry Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Patient ID"
                    className="border border-gray-200 rounded-2xl px-5 py-3 text-sm"
                  />

                  <input
                    type="text"
                    placeholder="Patient Name"
                    className="border border-gray-200 rounded-2xl px-5 py-3 text-sm"
                  />

                  <input
                    type="text"
                    placeholder="Study Description"
                    className="border border-gray-200 rounded-2xl px-5 py-3 text-sm"
                  />

                  <input
                    type="text"
                    placeholder="Institution ID"
                    className="border border-gray-200 rounded-2xl px-5 py-3 text-sm"
                  />
                </div>
              </div>

              {/* MODALITY */}
              <div>
                <h3 className="text-lg font-semibold text-[#071739] mb-5">
                  Modalities
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "MRI",
                    "PET",
                    "DWI",
                    "OTHER",
                  ].map((modality) => (
                    <div
                      key={modality}
                      className="border border-gray-200 rounded-2xl p-5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                        />

                        <p className="text-sm font-medium text-[#071739]">
                          {modality}
                        </p>
                      </div>

                      <input
                        type="file"
                        className="text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SUBMIT */}
              <button className="w-full bg-[#071739] hover:bg-[#0b2559] text-white py-3 rounded-2xl font-medium transition">
                Submit Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}