import {
  Search,
  Plus,
  Filter,
} from "lucide-react";

type WorklistToolbarProps = {
  onAddCase: () => void;
};

export default function WorklistToolbar({
  onAddCase,
}: WorklistToolbarProps) {
  return (
    <div className="space-y-4">
      {/* TOP ROW */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#071739]">
            Client Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage studies and track
            reports
          </p>
        </div>

        <button
          onClick={onAddCase}
          className="flex items-center gap-2 bg-[#071739] hover:bg-[#0b2559] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
        >
          <Plus size={17} />

          Add New Case
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(15,23,42,0.04)] p-4 flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
        
        {/* LEFT */}
        <div className="flex flex-1 items-center gap-4">
          {/* SEARCH */}
          <div className="relative w-full max-w-md">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search patients..."
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* STATS */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="bg-[#f7f9fc] px-4 py-2 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500">
                Total
              </p>

              <p className="text-sm font-semibold text-[#071739]">
                24
              </p>
            </div>

            <div className="bg-[#f7f9fc] px-4 py-2 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500">
                Ready
              </p>

              <p className="text-sm font-semibold text-green-600">
                10
              </p>
            </div>

            <div className="bg-[#f7f9fc] px-4 py-2 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500">
                Pending
              </p>

              <p className="text-sm font-semibold text-yellow-600">
                14
              </p>
            </div>
          </div>
        </div>

        {/* FILTER */}
        <button className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm transition">
          <Filter size={16} />

          Filters
        </button>
      </div>
    </div>
  );
}