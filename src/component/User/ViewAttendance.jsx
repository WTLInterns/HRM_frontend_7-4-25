import React, { useState } from "react";

const ViewAttendance = () => {
  const [empId, setEmpId] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setEmpId(e.target.value);
  };

  const fetchAttendance = async () => {
    if (!empId) {
      setError("Please enter a valid employee ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8282/public/getAllAttendace/${empId}`
      );
      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data);
      } else {
        setError("No attendance records found for this employee.");
      }
    } catch (error) {
      setError("Error fetching attendance data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Search Employee Attendance
        </h2>

        <div className="mb-4">
          <label
            htmlFor="empId"
            className="block text-sm font-medium text-gray-700"
          >
            Employee ID
          </label>
          <input
            id="empId"
            type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={empId}
            onChange={handleInputChange}
            placeholder="Enter Employee ID"
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="text-center">
          <button
            onClick={fetchAttendance}
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? "Loading..." : "Search Attendance"}
          </button>
        </div>

        {attendanceData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-medium mb-4">Attendance Records:</h3>
            <ul className="space-y-2">
              {attendanceData.map((attendance, index) => (
                <li
                  key={index}
                  className="bg-gray-100 p-3 rounded-lg shadow-sm"
                >
                  <p>
                    <strong>Date:</strong> {attendance.date}
                  </p>
                  <p>
                    <strong>Status:</strong> {attendance.status}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAttendance;
