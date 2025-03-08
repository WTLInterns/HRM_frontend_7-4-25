import React, { useState, useEffect } from "react";

export default function Attendance() {
  // -----------------------------------
  // 1) Component States
  // -----------------------------------
  const [employeeName, setEmployeeName] = useState("");
  const [status, setStatus] = useState("Present");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);

  const [filteredRecords, setFilteredRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const recordsPerPage = 5; // Number of records per page
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
        setEmployeeName("");
        setStatus("Present");
        setSelectedDate(new Date());
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
  // 6) Pagination Logic
  // -----------------------------------
  const paginate = (records, currentPage, recordsPerPage) => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return records.slice(startIndex, endIndex);
  };

  const handleNextPage = () => {
    if (currentPage * recordsPerPage < filteredRecords.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // -----------------------------------
  // 7) Rendering the Component
  // -----------------------------------
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      {error && (
        <div className="bg-red-500 text-white p-3 mb-4 rounded">{error}</div>
      )}

      {/* Mark Attendance Form */}
      <div className="w-full max-w-md mx-auto p-4 bg-gray-100 shadow-md rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Mark Attendance</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Name */}
          <div className="space-y-2">
            <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700">
              Employee Name
            </label>
            <input
              type="text"
              id="employeeName"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              id="date"
              type="date"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
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

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition text-sm"
          >
            Submit Attendance
          </button>
        </form>
      </div>

      {/* Attendance Records */}
      <div className="w-full p-6 bg-gray-100 shadow-md rounded-lg">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Attendance Records</h2>

        {/* Search Box */}
        <div className="mb-4 flex items-center space-x-4">
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-lg w-full text-sm"
            placeholder="Search by employee name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleShowDetails}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg text-sm"
          >
            Show Details
          </button>
          {(filteredRecords.length > 0 || searchQuery) && (
            <button
              onClick={handleReset}
              className="py-2 px-4 bg-gray-600 text-white rounded-lg text-sm"
            >
              Reset
            </button>
          )}
        </div>

        {/* Attendance Records Table */}
        {filteredRecords.length > 0 ? (
          <>
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-lg">
                  <th className="border p-4">Sr. No</th>
                  <th className="border p-4">Employee Name</th>
                  <th className="border p-4">Date</th>
                  <th className="border p-4">Status</th>
                  <th className="border p-4">Change Status</th>
                </tr>
              </thead>
              <tbody>
                {paginate(filteredRecords, currentPage, recordsPerPage).map((record, index) => (
                  <tr key={record.id || index} className="hover:bg-gray-100">
                    <td className="border p-4">{(currentPage - 1) * recordsPerPage + index + 1}</td>
                    <td className="border p-4">{record.employee?.firstName || "N/A"}</td>
                    <td className="border p-4">{record.date}</td>
                    <td className={`border p-4 ${statusColors[record.status] || ""}`}>
                      {record.status}
                    </td>
                    <td className="border p-4">
                      <select
                        value={record.status}
                        onChange={(e) =>
                          updateStatus(record.employee?.empId, record.date, record.id, e.target.value)
                        }
                        className="border p-2 rounded-lg text-sm"
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

            {/* Pagination */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={handlePrevPage}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center p-6 text-lg text-gray-500">
            No attendance records to display. Please use the search above.
          </div>
        )}
      </div>
    </div>
  );
}

