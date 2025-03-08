import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default react-calendar styles

const ViewAttendance = () => {
  const [empId, setEmpId] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [empName, setEmpName] = useState("");

  // Track the currently displayed month & year in the calendar
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handleInputChange = (e) => {
    setEmpId(e.target.value);
  };

  const fetchAttendance = async () => {
    if (!empId) {
      setError("Please enter a valid employee ID or name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1) Use your new endpoint that accepts ID or name:
      const response = await fetch(
        `http://localhost:8282/public/getAttendance/${empId}`
      );
      if (response.ok) {
        const data = await response.json();

        // 2) If data is an array & not empty, set both ID and Name from the first record
        if (Array.isArray(data) && data.length > 0 && data[0].employee) {
          // Dynamically set the input field to the employee's ID,
          // so if the user typed a name, it now shows the actual ID
          setEmpId(String(data[0].employee.empId));

          const firstName = data[0].employee.firstName || "";
          const lastName = data[0].employee.lastName || "";
          setEmpName(`${firstName} ${lastName}`.trim());
        } else {
          setEmpName("");
        }

        setAttendanceData(data);
      } else {
        setError("No attendance records found for this employee.");
        setAttendanceData([]);
      }
    } catch (error) {
      setError("Error fetching attendance data.");
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const clearAttendance = () => {
    setEmpId("");
    setAttendanceData([]);
    setError("");
    setEmpName("");
  };

  /**
   * Called whenever the user navigates to a different month/year in the calendar.
   */
  const handleMonthChange = ({ activeStartDate, view }) => {
    if (view === "month") {
      setCurrentMonth(activeStartDate.getMonth());
      setCurrentYear(activeStartDate.getFullYear());
    }
  };

  /**
   * Return Tailwind classes for each date based on attendance status,
   * using a circle shape (rounded-full).
   */
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const found = attendanceData.find((item) => {
        const itemDate = new Date(item.date).toDateString();
        const currentTileDate = date.toDateString();
        return itemDate === currentTileDate;
      });

      if (found) {
        switch (found.status) {
          case "Present":
            return "bg-green-200 text-green-800 rounded-full";
          case "Absent":
            return "bg-red-200 text-red-800 rounded-full";
          case "Half-Day":
            return "bg-yellow-200 text-yellow-800 rounded-full";
          case "Paid Leave":
            return "bg-blue-200 text-blue-800 rounded-full";
          case "Week Off":
            return "bg-purple-200 text-purple-800 rounded-full";
          case "Holiday":
            return "bg-orange-200 text-orange-800 rounded-full";
          default:
            return null;
        }
      }
    }
    return null;
  };

  // Filter the full attendance data to only the currently displayed month/year
  const monthlyData = attendanceData.filter((record) => {
    const recordDate = new Date(record.date);
    return (
      recordDate.getMonth() === currentMonth &&
      recordDate.getFullYear() === currentYear
    );
  });

  // Count how many times each status appears in that month
  const statusCounts = {
    Present: 0,
    Absent: 0,
    "Half-Day": 0,
    "Paid Leave": 0,
    "Week Off": 0,
    Holiday: 0,
  };

  monthlyData.forEach((record) => {
    if (statusCounts.hasOwnProperty(record.status)) {
      statusCounts[record.status]++;
    }
  });

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 py-10">
      {/* Main Container */}
      <div className="flex flex-row w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg space-x-8 transition-transform transform hover:scale-105">
        {/* LEFT SIDE: Search Form */}
        <div className="w-1/2 border-r border-gray-200 pr-6">
          <h2 className="text-3xl font-bold text-indigo-600 text-center mb-6">
            Search Employee Attendance
          </h2>

          {/* Employee ID or Name Field */}
          <div className="mb-5">
            <label
              htmlFor="empId"
              className="block text-sm font-medium text-gray-700"
            >
              Employee ID or Name
            </label>
            <input
              id="empId"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         transition-colors duration-200"
              value={empId}
              onChange={handleInputChange}
              placeholder="Enter Employee ID or Name"
            />
          </div>

          {/* Employee Name (Read-Only) */}
          <div className="mb-5">
            <label
              htmlFor="empName"
              className="block text-sm font-medium text-gray-700"
            >
              Employee Name
            </label>
            <input
              id="empName"
              type="text"
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         transition-colors duration-200"
              value={empName}
              placeholder="Employee Name"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <div className="text-center space-y-3">
            <button
              onClick={fetchAttendance}
              className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md
                         hover:bg-indigo-700 focus:outline-none focus:ring-2
                         focus:ring-indigo-500 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? "Loading..." : "Search Attendance"}
            </button>
            <button
              onClick={clearAttendance}
              className="w-full py-2 bg-gray-400 text-white font-semibold rounded-md
                         hover:bg-gray-500 focus:outline-none focus:ring-2
                         focus:ring-gray-500 transition-colors duration-200"
            >
              Clear
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: Calendar + Legend + Month-Wise Counts */}
        <div className="w-1/2 flex flex-col items-center pl-6">
          <h3 className="text-2xl font-bold text-indigo-600 mb-4 text-center">
            Attendance Calendar:
          </h3>

          <div className="bg-white p-2 rounded shadow-sm">
            <Calendar
              tileClassName={tileClassName}
              onActiveStartDateChange={handleMonthChange}
              showNeighboringMonth={false}
            />
          </div>

          {/* Legend + Month-Wise Counts */}
          <div className="mt-6 text-sm flex flex-wrap gap-4 justify-center">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-green-200 rounded-full" />
              <span>Present - {statusCounts.Present} Days</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-red-200 rounded-full" />
              <span>Absent - {statusCounts.Absent} Days</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-yellow-200 rounded-full" />
              <span>Half-Day - {statusCounts["Half-Day"]} Days</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-blue-200 rounded-full" />
              <span>Paid Leave - {statusCounts["Paid Leave"]} Days</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-purple-200 rounded-full" />
              <span>Week Off - {statusCounts["Week Off"]} Days</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-orange-200 rounded-full" />
              <span>Holiday - {statusCounts.Holiday} Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendance;
