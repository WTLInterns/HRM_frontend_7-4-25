import React, { useState, useEffect } from "react";

export default function Attendance() {
  // -----------------------------------
  // 1) Component States
  // -----------------------------------
  const [employeeName, setEmployeeName] = useState("");
  const [status, setStatus] = useState("Present");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);

  // We'll use filteredRecords to store search results.
  const [filteredRecords, setFilteredRecords] = useState([]);

  // Search box input
  const [searchQuery, setSearchQuery] = useState("");

  // Define color classes for each status
  const statusColors = {
    Present: "text-green-600 font-semibold",
    Absent: "text-red-600 font-semibold",
    "Half-Day": "text-yellow-600 font-semibold",
    "Paid Leave": "text-purple-600 font-semibold",
    "Week Off": "text-blue-600 font-semibold",
    Holiday: "text-pink-600 font-semibold",
  };

  // -----------------------------------
  // 2) Form Submission (Mark Attendance)
  // -----------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the payload
    const newRecord = {
      employee: { firstName: employeeName },
      date: selectedDate.toISOString().split("T")[0],
      status: status,
    };

    fetch("http://localhost:8282/public/att", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecord),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to mark attendance");
        }
        return response.json();
      })
      .then((data) => {
        alert("Attendance marked successfully!");
        // Reset the form
        setEmployeeName("");
        setStatus("Present");
        setSelectedDate(new Date());
        // Clear search results or re-fetch if desired
        setFilteredRecords([]);
      })
      .catch((error) => {
        console.error("Error marking attendance:", error);
        setError("Error marking attendance");
      });
  };

  // -----------------------------------
  // 3) "Show Details" (Search by Employee First Name)
  // -----------------------------------
  const handleShowDetails = () => {
    const query = searchQuery.trim();
    if (!query) {
      setFilteredRecords([]);
      return;
    }

    fetch(`http://localhost:8282/public/getAttendanceByName/${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch attendance by name");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Search results:", data);
        setFilteredRecords(data);
      })
      .catch((error) => {
        console.error("Error fetching attendance by name:", error);
        setError("Error fetching attendance by name");
      });
  };

  // -----------------------------------
  // 4) "Reset" button
  // -----------------------------------
  const handleReset = () => {
    setSearchQuery("");
    setFilteredRecords([]);
  };

  // -----------------------------------
  // 5) Update Status Dynamically
  // -----------------------------------
  const updateStatus = (empId, date, recordId, newStatus) => {
    fetch(
      `http://localhost:8282/public/updateAttendanceStatusByEmpAndDate/${empId}/${date}/${encodeURIComponent(newStatus)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update status");
        }
        return response.json();
      })
      .then((updatedRecord) => {
        // Update local state so UI reflects the new status
        setFilteredRecords((prev) =>
          prev.map((rec) =>
            rec.id === recordId ? { ...rec, status: updatedRecord.status } : rec
          )
        );
      })
      .catch((error) => {
        console.error("Error updating attendance:", error);
        setError("Error updating attendance");
      });
  };

  // -----------------------------------
  // 6) Rendering the Component
  // -----------------------------------
  return (
    <div className="max-w-6xl mx-auto p-6">
      {error && (
        <div className="bg-red-500 text-white p-3 mb-4 rounded">{error}</div>
      )}

      {/* Mark Attendance Form */}
      <div className="w-full p-4 border rounded mb-8">
        <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          {/* Employee Name */}
          <div>
            <label htmlFor="employeeName" className="block font-medium text-gray-700">
              Employee Name
            </label>
            <input
              type="text"
              id="employeeName"
              className="mt-1 block w-full p-2 border rounded-md"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date:
            </label>
            <input
              id="date"
              type="date"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              className="mt-1 block w-full p-2 border rounded-md"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half-Day">Half-Day</option>
              <option value="Paid Leave">Paid Leave</option>
              <option value="Week Off">Week Off</option>
              <option value="Holiday">Holiday</option>
            </select>
          </div>

          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
            Submit Attendance
          </button>
        </form>
      </div>

      {/* Attendance Records */}
      <div className="w-full p-4 border rounded">
        <h2 className="text-2xl font-bold mb-4">Attendance Records</h2>
        {/* Search */}
        <div className="mb-4 flex items-center">
          <input
            type="text"
            className="p-2 border rounded w-full"
            placeholder="Search by employee name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleShowDetails}
            className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Show Details
          </button>
          {(filteredRecords.length > 0 || searchQuery) && (
            <button
              onClick={handleReset}
              className="ml-2 bg-gray-500 text-white py-2 px-4 rounded-md"
            >
              Reset
            </button>
          )}
        </div>

        {filteredRecords.length > 0 ? (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Employee Name</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Change Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  {/* Show the firstName or "N/A" if missing */}
                  <td className="border p-2">{record.employee?.firstName || "N/A"}</td>
                  <td className="border p-2">{record.date}</td>
                  <td className={`border p-2 ${statusColors[record.status] || ""}`}>
                    {record.status}
                  </td>
                  <td className="border p-2">
                    {/* Dropdown to update status dynamically */}
                    <select
                      value={record.status}
                      onChange={(e) =>
                        updateStatus(record.employee?.empId, record.date, record.id, e.target.value)
                      }
                      className="border p-2 rounded"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Half-Day">Half-Day</option>
                      <option value="Paid Leave">Paid Leave</option>
                      <option value="Week Off">Week Off</option>
                      <option value="Holiday">Holiday</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center p-4">
            No attendance records to display. Please use the search above.
          </div>
        )}
      </div>
    </div>
  );
}
