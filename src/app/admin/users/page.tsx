"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {

  const [users, setUsers] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("CLIENT");

  const [institutionId, setInstitutionId] =
    useState("");

    const [institutions, setInstitutions] =
     useState<any[]>([]);

  async function fetchUsers() {

    try {

      const response =
        await fetch(
          "/api/admin/users"
        );

      const data =
        await response.json();

      setUsers(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  async function fetchInstitutions() {
  try {
    const response =
      await fetch(
        "/api/admin/institutions"
      );

    const data =
      await response.json();

    setInstitutions(data);

  } catch (error) {
    console.error(error);
  }
}

  async function createUser() {

    try {

      const response =
        await fetch(
          "/api/admin/users",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name,
              email,
              password,
              role,
              institutionId,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.error
        );

      }

      await fetchUsers();

      setShowModal(false);

      setName("");
      setEmail("");
      setPassword("");
      setRole("CLIENT");

      setInstitutionId("");

      alert(
        "User created successfully"
      );

    } catch (error) {

  console.error(error);

  alert(
    error instanceof Error
      ? error.message
      : "Failed to create user"
  );

}
  }

  useEffect(() => {

    fetchUsers();

      fetchInstitutions();

  }, []);

  return (

    <div className="p-8">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            User Management
          </h1>

          <p className="text-gray-500 mt-2">
            Doctors, Operators and Admins
          </p>

        </div>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="bg-[#071739] text-white px-4 py-2 rounded-xl"
        >
          Create User
        </button>

      </div>

      <div className="mt-6 border rounded-2xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Name
              </th>

              <th className="text-left p-4">
                Email
              </th>

              <th className="text-left p-4">
                Role
              </th>

              <th className="text-left p-4">
                Institution
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan={4}
                  className="p-6"
                >
                  Loading...
                </td>

              </tr>

            ) : (

              users.map(
                (user) => (

                  <tr
                    key={user.id}
                    className="border-t"
                  >

                    <td className="p-4">
                      {user.name}
                    </td>

                    <td className="p-4">
                      {user.email}
                    </td>

                    <td className="p-4">
                      {user.role}
                    </td>

                    <td className="p-4">
                      {
                        user.institution
                          ?.name
                      }
                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[450px] rounded-2xl p-6 space-y-4">

            <h2 className="text-xl font-semibold">
              Create User
            </h2>

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3"
            />

            <select
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3"
            >
              <option value="CLIENT">
                Doctor
              </option>

              <option value="OPERATOR">
                Operator
              </option>

              <option value="ADMIN">
                Admin
              </option>

            </select>

           <select
  value={institutionId}
  onChange={(e) =>
    setInstitutionId(
      e.target.value
    )
  }
  className="w-full border rounded-xl p-3"
>
  <option value="">
    Select Institution
  </option>

  {institutions.map(
    (institution) => (
      <option
        key={institution.id}
        value={institution.id}
      >
        {institution.name}
      </option>
    )
  )}
</select>

            <div className="flex gap-3">

              <button
                onClick={createUser}
                className="bg-[#071739] text-white px-4 py-2 rounded-xl"
              >
                Create
              </button>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="border px-4 py-2 rounded-xl"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}