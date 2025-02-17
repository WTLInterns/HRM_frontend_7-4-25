import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Attendance() {
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState("Present");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [email, setEmail] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8282/public/getAllAtt"
        );
        if (Array.isArray(response.data)) {
          setAttendanceRecords(response.data);
        } else {
          throw new Error("Invalid data format received.");
        }
      } catch (error) {
        setError("Failed to fetch attendance records.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRecord = {
      employeeId,
      date: selectedDate.toISOString().split("T")[0],
      status,
    };

    try {
      const response = await axios.post(
        `http://localhost:8282/public/att?email=${email}`,
        newRecord
      );

      if (response.status === 201) {
        setAttendanceRecords([response.data, ...attendanceRecords]);
        alert("Attendance marked successfully!");
      }
    } catch (error) {
      console.error("Error creating attendance:", error.response || error);
      setError(
        error.response?.data?.message ||
          "Failed to create attendance. Employee not found."
      );
    }

    setEmployeeId("");
    setStatus("Present");
    setSelectedDate(new Date());
    setEmail("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>

      {error && (
        <div className="bg-red-500 text-white p-3 mb-4 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium text-gray-700">
            Employee Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full p-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="birthDate"
            className="block text-sm font-medium text-gray-700"
          >
            Birth Date:
          </label>
          <input
            id="birthDate"
            type="date"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

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

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Submit Attendance
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Attendance Records</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Employee ID</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record) => (
                <tr key={record.id || record.employeeId}>
                  <td className="border p-2">
                    {record.id || record.employeeId}
                  </td>
                  <td className="border p-2">{record.date}</td>
                  <td className="border p-2">{record.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="border p-2 text-center">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
