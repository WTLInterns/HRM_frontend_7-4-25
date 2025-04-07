import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default react-calendar styles
import axios from "axios";
import "./calendar-custom.css"; // Import custom calendar styles
import { FaCalendarAlt, FaUserCheck, FaSearch, FaTimes } from 'react-icons/fa';

export default function ViewAttendance() {
  // Component States
  const [empId, setEmpId] = useState("");
  const [empName, setEmpName] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState({});

  // Handle input change
  const handleInputChange = (e) => {
    setEmpId(e.target.value);
  };

  // Fetch attendance data
  const fetchAttendance = async () => {
    if (!empId) {
      setError("Please enter an Employee ID or Name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Encode the employee name to handle spaces and special characters
      const encodedName = encodeURIComponent(empId);
      // Use getAttendanceByName endpoint which accepts employee names
      const response = await axios.get(`http://localhost:8282/public/getAttendanceByName/${encodedName}`);
      
      console.log("API Response:", response.data); // Debug log
      
      if (response.data && response.data.length > 0) {
        setAttendanceData(response.data);
        setEmpName(response.data[0].employee?.firstName || "Employee");
      } else {
        setError("No attendance records found for this employee.");
        setAttendanceData([]);
        setEmpName("");
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError(`Error fetching attendance data: ${error.message}`);
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
    setSelectedDate(null);
  };

  // Called whenever the user navigates to a different month/year in the calendar
  const handleMonthChange = ({ activeStartDate, view }) => {
    if (view === "month") {
      setCurrentMonth(activeStartDate.getMonth());
      setCurrentYear(activeStartDate.getFullYear());
    }
  };

  // Handle date click in calendar
  const handleDateClick = (value) => {
    setSelectedDate(value);
    
    // Find attendance record for this date
    const record = attendanceData.find((item) => {
      const itemDate = new Date(item.date).toDateString();
      const clickedDate = value.toDateString();
      return itemDate === clickedDate;
    });
    
    setTooltipContent(record || {});
  };

  // Handle mouse enter on calendar tile
  const handleTileMouseEnter = (e, date) => {
    const record = attendanceData.find((item) => {
      const itemDate = new Date(item.date).toDateString();
      const hoverDate = date.toDateString();
      return itemDate === hoverDate;
    });
    
    if (record) {
      const rect = e.target.getBoundingClientRect();
      setTooltipPosition({ 
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY 
      });
      setTooltipContent(record);
      setShowTooltip(true);
    }
  };

  // Handle mouse leave on calendar tile
  const handleTileMouseLeave = () => {
    setShowTooltip(false);
  };

  // Tile content for calendar days based on attendance status
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const found = attendanceData.find((item) => {
        const itemDate = new Date(item.date).toDateString();
        const currentTileDate = date.toDateString();
        return itemDate === currentTileDate;
      });

      if (found) {
        let statusIcon;
        switch (found.status) {
          case "Present":
            statusIcon = "✓";
            break;
          case "Absent":
            statusIcon = "✗";
            break;
          case "Half-Day":
            statusIcon = "½";
            break;
          case "Paid Leave":
            statusIcon = "P";
            break;
          case "Week Off":
            statusIcon = "W";
            break;
          case "Holiday":
            statusIcon = "H";
            break;
          default:
            statusIcon = "";
        }
        
        return <div className="status-icon">{statusIcon}</div>;
      }
    }
    return null;
  };

  // Tile class for calendar days based on attendance status
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      // Default styling for weekends
      let className = "";
      const dayOfWeek = date.getDay();
      
      // Sunday (0) and Saturday (6)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        className = "weekend-day";
      }
      
      const found = attendanceData.find((item) => {
        const itemDate = new Date(item.date).toDateString();
        const currentTileDate = date.toDateString();
        return itemDate === currentTileDate;
      });

      if (found) {
        switch (found.status) {
          case "Present":
            return `${className} bg-green-200`;
          case "Absent":
            return `${className} bg-red-200`;
          case "Half-Day":
            return `${className} bg-yellow-200`;
          case "Paid Leave":
            return `${className} bg-blue-200`;
          case "Week Off":
            return `${className} bg-purple-200`;
          case "Holiday":
            return `${className} bg-orange-200`;
          default:
            return className || null;
        }
      }
      
      return className || null;
    }
    return null;
  };

  // Filter monthly data and count statuses
  const monthlyData = attendanceData.filter((record) => {
    const recordDate = new Date(record.date);
    return (
      recordDate.getMonth() === currentMonth &&
      recordDate.getFullYear() === currentYear
    );
  });

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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case "Present": return "bg-green-100 text-green-800 border-green-300";
      case "Absent": return "bg-red-100 text-red-800 border-red-300";
      case "Half-Day": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Paid Leave": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Week Off": return "bg-purple-100 text-purple-800 border-purple-300";
      case "Holiday": return "bg-orange-100 text-orange-800 border-orange-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Months array for dropdown
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Years array for dropdown
  const years = [2023, 2024, 2025];

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
      {/* LEFT SIDE: Search Form - increase width */}
      <div className="md:w-1/2 p-5 md:border-r border-gray-200">
        <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center">
          <FaUserCheck className="mr-2" /> Search Employee Attendance
        </h2>
        
        <div className="mb-4">
          <label htmlFor="empId" className="block text-sm font-medium text-gray-700 mb-1">
            Employee ID or Name
          </label>
          <div className="relative">
            <input
              id="empId"
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={empId}
              onChange={handleInputChange}
              placeholder="Enter Employee ID or Name"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
            Month
          </label>
          <select
            id="month"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <select
            id="year"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={fetchAttendance}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm flex items-center justify-center transition-colors duration-200"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              <span className="flex items-center">
                <FaSearch className="mr-2" /> Search
              </span>
            )}
          </button>
          <button
            onClick={clearAttendance}
            className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow-sm flex items-center justify-center transition-colors duration-200"
          >
            <FaTimes className="mr-2" /> Clear
          </button>
        </div>

        {empName && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200 shadow-sm">
            <p className="text-center text-indigo-800 font-medium flex items-center justify-center">
              <FaUserCheck className="mr-2" /> Showing attendance for: {empName}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-center text-red-600">{error}</p>
          </div>
        )}

        {selectedDate && tooltipContent && tooltipContent.status && (
          <div className={`mt-4 p-4 rounded-lg border ${getStatusColorClass(tooltipContent.status)}`}>
            <h3 className="font-bold text-lg mb-2">{formatDate(tooltipContent.date)}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-semibold">Status:</div>
              <div>{tooltipContent.status}</div>
              {tooltipContent.checkInTime && (
                <>
                  <div className="font-semibold">Check In:</div>
                  <div>{tooltipContent.checkInTime}</div>
                </>
              )}
              {tooltipContent.checkOutTime && (
                <>
                  <div className="font-semibold">Check Out:</div>
                  <div>{tooltipContent.checkOutTime}</div>
                </>
              )}
              {tooltipContent.comments && (
                <>
                  <div className="font-semibold">Comments:</div>
                  <div>{tooltipContent.comments}</div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE: Calendar - decrease width */}
      <div className="md:w-1/2 p-5 flex flex-col items-center">
        <h2 className="text-xl font-bold text-indigo-600 mb-4 text-center flex items-center justify-center">
          <FaCalendarAlt className="mr-2" /> Attendance Calendar
        </h2>

        {attendanceData.length > 0 ? (
          <>
            <div className="mb-4 w-full max-w-sm mx-auto">
              <div className="border-2 border-gray-300 rounded-lg p-3 shadow-md hover:shadow-lg transition-shadow duration-300">
                <Calendar
                  className="border-0 rounded-lg w-full text-sm shadow-sm calendar-small"
                  tileClassName={tileClassName}
                  tileContent={tileContent}
                  onActiveStartDateChange={handleMonthChange}
                  showNeighboringMonth={true}
                  activeStartDate={new Date(currentYear, currentMonth, 1)}
                  formatShortWeekday={(locale, date) => 
                    ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()]
                  }
                  navigationLabel={({ date }) => 
                    `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
                  }
                  showFixedNumberOfWeeks={true}
                  onClickDay={handleDateClick}
                  tileProps={({ date, view }) => ({
                    onMouseEnter: (e) => handleTileMouseEnter(e, date),
                    onMouseLeave: handleTileMouseLeave
                  })}
                  nextLabel="›"
                  next2Label="»"
                  prevLabel="‹"
                  prev2Label="«"
                />
              </div>
            </div>

            {/* Tooltip for hover */}
            {showTooltip && tooltipContent && tooltipContent.status && (
              <div 
                className={`absolute p-2 rounded shadow-lg text-xs z-50 ${getStatusColorClass(tooltipContent.status)}`}
                style={{ 
                  left: `${tooltipPosition.x}px`, 
                  top: `${tooltipPosition.y - 40}px`,
                  pointerEvents: 'none'
                }}
              >
                <div className="font-bold">{tooltipContent.status}</div>
                {tooltipContent.checkInTime && <div>In: {tooltipContent.checkInTime}</div>}
                {tooltipContent.checkOutTime && <div>Out: {tooltipContent.checkOutTime}</div>}
              </div>
            )}

            <div className="mt-3 w-full max-w-sm border-t border-gray-200 pt-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">
                Monthly Summary
              </h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {Object.entries(statusCounts).map(([status, count]) => (
                  count > 0 && (
                    <div key={status} className={`flex items-center p-2 rounded-md ${getStatusColorClass(status)}`}>
                      <div className={`w-3 h-3 rounded-full mr-1 ${
                        status === "Present" ? "bg-green-500" :
                        status === "Absent" ? "bg-red-500" :
                        status === "Half-Day" ? "bg-yellow-500" :
                        status === "Paid Leave" ? "bg-blue-500" :
                        status === "Week Off" ? "bg-purple-500" :
                        "bg-orange-500"
                      }`}></div>
                      <span className="font-medium">{status}: {count}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FaCalendarAlt className="text-4xl mb-3 text-gray-300" />
            <p>Search for an employee to view attendance</p>
            <p className="text-xs mt-1 text-gray-400">Calendar will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
