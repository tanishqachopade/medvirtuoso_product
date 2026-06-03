export default function AdminPage() {
  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold text-[#071739]">
        Admin Dashboard
      </h1>

      <p className="text-gray-500 mt-2">
        MedVirtuoso Administration
      </p>

      <div className="grid grid-cols-4 gap-4 mt-8">

        <div className="bg-white border rounded-2xl p-6">
          <h2 className="font-semibold">
            Institutions
          </h2>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <h2 className="font-semibold">
            Sites
          </h2>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <h2 className="font-semibold">
            Doctors
          </h2>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <h2 className="font-semibold">
            Operators
          </h2>
        </div>

      </div>

    </div>
  );
}