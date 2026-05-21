"use client";

import { useState } from "react";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
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
        notes: "Stroke evaluation",
        datetime:
          "21 May 2026, 10:30 AM",
      },

      {
        id: "P-1002",
        patientName: "Sarah Smith",
        studyDescription: "CT Chest",
        modality: "CT",
        status: "PROCESSING",
        notes: "Pulmonary screening",
        datetime:
          "21 May 2026, 11:15 AM",
      },
    ]);

  return (
    <div className="space-y-6">

        {/* HEADER */}
<div className="space-y-6">
  {/* TITLE */}
  <div>
    <h1 className="text-3xl font-bold text-[#071739]">
      Client Dashboard
    </h1>

    <p className="text-gray-500 mt-2 text-base">
      Manage studies and track reports
    </p>
  </div>

  {/* QUICK ACTIONS */}
  <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(15,23,42,0.04)] p-5 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
    
    {/* LINK INPUT */}
    <div className="flex flex-1 gap-3">
      <input
        type="text"
        placeholder="Paste PACS / Drive / Imaging Link"
        className="flex-1 border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition">
        Submit Link
      </button>
    </div>

    {/* MANUAL ENTRY BUTTON */}
    <button
      onClick={() =>
        setShowModal(true)
      }
      className="flex items-center justify-center gap-2 bg-[#071739] hover:bg-[#0b2559] text-white px-6 py-3 rounded-2xl font-medium transition whitespace-nowrap"
    >
      <Plus size={18} />

      Manual Entry
    </button>
  </div>
</div>
    

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TOTAL */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)] border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">
            Total Cases
          </p>

          <h2 className="text-3xl font-bold mt-4 text-[#071739]">
            {studies.length}
          </h2>
        </div>

        {/* READY */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)] border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">
            Ready Cases
          </p>

          <h2 className="text-3xl font-bold mt-4 text-green-600">
            {
              studies.filter(
                (study) =>
                  study.status === "READY"
              ).length
            }
          </h2>
        </div>

        {/* PENDING */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)] border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">
            Pending Cases
          </p>

          <h2 className="text-3xl font-bold mt-4 text-yellow-500">
            {
              studies.filter(
                (study) =>
                  study.status !== "READY"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* WORKLIST */}
      <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(15,23,42,0.04)] border border-gray-100 overflow-hidden">
        {/* SEARCH + FILTER */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select className="border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500">
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
            <thead className="bg-[#f8fafc] text-left">
              <tr>
                <th className="px-6 py-5 text-sm font-semibold text-gray-600">
                  Patient ID
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-600">
                  Patient Name
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-600">
                  Study Description
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-600">
                  Modality
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-600">
                  Notes
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-600">
                  Date & Time
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {studies.map((study) => (
                <tr
                  key={study.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-5 text-sm font-medium text-gray-700">
                    {study.id}
                  </td>

                  <td className="px-6 py-5 text-sm font-semibold text-[#071739]">
                    {study.patientName}
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-700">
                    {
                      study.studyDescription
                    }
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-700">
                    {study.modality}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-4 py-1.5 rounded-xl text-xs font-semibold ${
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

                  <td className="px-6 py-5 text-sm text-gray-600 max-w-xs">
                    {study.notes}
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">
                    {study.datetime}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <button className="p-2 rounded-xl hover:bg-blue-50 transition">
                        <Eye
                          size={18}
                          className="text-blue-600"
                        />
                      </button>

                      <button className="p-2 rounded-xl hover:bg-yellow-50 transition">
                        <Pencil
                          size={18}
                          className="text-yellow-600"
                        />
                      </button>

                      <button className="p-2 rounded-xl hover:bg-red-50 transition">
                        <Trash2
                          size={18}
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-[32px] p-10 shadow-2xl border border-gray-100">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[#071739]">
                  Add New Case
                </h2>

                <p className="text-gray-500 mt-2">
                  Select upload workflow
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

            {/* OPTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MANUAL */}
              <button className="border border-gray-200 rounded-2xl p-6 text-left hover:border-blue-500 hover:bg-blue-50 transition">
                <h3 className="text-xl font-semibold text-[#071739]">
                  Manual Entry
                </h3>

                <p className="text-gray-500 mt-3 leading-relaxed">
                  Enter patient details
                  manually and upload
                  imaging files.
                </p>
              </button>

              {/* LINK */}
              <button className="border border-gray-200 rounded-2xl p-6 text-left hover:border-blue-500 hover:bg-blue-50 transition">
                <h3 className="text-xl font-semibold text-[#071739]">
                  Imaging Link Upload
                </h3>

                <p className="text-gray-500 mt-3 leading-relaxed">
                  Paste PACS or cloud
                  imaging links without
                  entering patient
                  details.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}