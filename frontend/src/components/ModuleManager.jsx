import React, { useEffect, useState } from "react";

const ModuleManager = () => {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetch("https://cms-xjfn.onrender.com/api/modules")
      .then((res) => res.json())
      .then((data) => setModules(data))
      .catch((err) => console.error(err));
  }, []);

  const toggleModule = async (id, status) => {
    try {
      await fetch(`https://cms-xjfn.onrender.com/api/modules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !status }),
      });

      setModules((prev) =>
        prev.map((m) => (m._id === id ? { ...m, active: !status } : m))
      );
    } catch (err) {
      console.error("Error updating module:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Manage Modules
      </h1>
      <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="p-3 text-left text-gray-700 dark:text-gray-200">Module</th>
            <th className="p-3 text-left text-gray-700 dark:text-gray-200">Status</th>
            <th className="p-3 text-left text-gray-700 dark:text-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((mod) => (
            <tr key={mod._id} className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-3 text-gray-800 dark:text-gray-100">{mod.name}</td>
              <td className="p-3">{mod.active ? "✅ Active" : "❌ Inactive"}</td>
              <td className="p-3">
                <button
                  onClick={() => toggleModule(mod._id, mod.active)}
                  className={`px-4 py-1 rounded ${
                    mod.active
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  } transition`}
                >
                  {mod.active ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModuleManager;
