import React, { useState, useEffect } from "react";
import "./animations.css";
import { FaCheckCircle, FaTimes, FaCalendarAlt } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-custom.css";

export default function Attendance() {
  // Component States
  const [employeeName, setEmployeeName] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  // Status options for the dropdown
  const statusOptions = [
    "Present",
    "Absent",
    "Half-Day",
    "Paid Leave",
    "Week Off",
    "Holiday"
  ];

  // Initialize attendance records for selected dates
  useEffect(() => {
    // Only initialize new dates, don't overwrite existing ones
    const existingDates = attendanceRecords.map(r => r.date);
    const newDates = selectedDates.filter(date => !existingDates.includes(date));
    
    if (newDates.length > 0) {
      const newRecords = newDates.map(date => ({
        date,
        status: "Present", // Default status
        employeeName: employeeName || "",
      }));
      
      setAttendanceRecords(prev => [...prev, ...newRecords]);
    }
  }, [selectedDates, employeeName]);

  // Format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Handle calendar tile click
  const handleTileClick = ({ date, view }, event) => {
    if (view === 'month') {
      // Get the exact date that was clicked with no time component
      const clickedDate = new Date(date);
      clickedDate.setHours(12, 0, 0, 0);
      const dateStr = clickedDate.toISOString().split('T')[0];
      
      // Store the clicked date cell's position for reference
      const rect = event.currentTarget.getBoundingClientRect();
      const calendarRect = event.currentTarget.closest('.react-calendar').getBoundingClientRect();
      
      // Calculate position relative to the calendar
      setDropdownPosition({
        x: rect.left - calendarRect.left + (rect.width / 2),
        y: rect.top - calendarRect.top + (rect.height / 2)
      });
      
      setSelectedDate(dateStr);
      setShowStatusDropdown(true);
    }
  };

  // Close the dropdown
  const handleCloseDropdown = () => {
    setShowStatusDropdown(false);
  };

  // Handle status selection
  const handleStatusSelect = (status) => {
    const dateStr = selectedDate;
    console.log("Setting status for date:", dateStr, "Status:", status);
    
    if (!selectedDates.includes(dateStr)) {
      // Add new date with the selected status
      setSelectedDates(prev => [...prev, dateStr]);
      setAttendanceRecords(prev => [
        ...prev,
        {
          date: dateStr,
          status: status, // Use the selected status, not the default
          employeeName: employeeName || "",
        }
      ]);
    } else {
      // Update existing date with new status
      setAttendanceRecords(prev => 
        prev.map(record => 
          record.date === dateStr 
            ? { ...record, status: status }
            : record
        )
      );
    }
    setShowStatusDropdown(false);
  };

  // Remove a date from selection
  const handleRemoveDate = (dateToRemove) => {
    setSelectedDates(selectedDates.filter(date => date !== dateToRemove));
    setAttendanceRecords(attendanceRecords.filter(record => record.date !== dateToRemove));
  };

  // Clear all selected dates and reset form
  const handleCancelAll = () => {
    setSelectedDates([]);
    setAttendanceRecords([]);
  };

  // Validate form before submission
  const validateForm = () => {
    if (!employeeName || employeeName.trim() === "") {
      setError("Please enter employee name");
      return false;
    }
    if (selectedDates.length === 0) {
      setError("Please select at least one date");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Store the count of selected dates before clearing them
      const selectedDatesCount = selectedDates.length;
      
      // Update employee name in all records
      const updatedRecords = attendanceRecords.map(record => ({
        ...record,
        employeeName: employeeName
      }));

      // Submit each attendance record
      const submissionPromises = updatedRecords
        .filter(record => selectedDates.includes(record.date))
        .map(record => 
          fetch("http://localhost:8282/public/att", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              employee: { firstName: employeeName },
              date: record.date,
              status: record.status,
            }),
          })
        );

      await Promise.all(submissionPromises);
      
      // Show success modal with correct count
      setShowSuccessModal(true);
      // Store the count to display in the success modal
      localStorage.setItem('submittedDatesCount', selectedDatesCount.toString());
      
      // Clear form fields
      setEmployeeName("");
      setSelectedDates([]);
      setAttendanceRecords([]);
      setShowCalendar(false);
      
    } catch (error) {
      console.error("Error marking attendance:", error);
      setError("Error marking attendance");
    }
  };

  // Define color classes for each status
  const statusColors = {
    Present: "bg-green-900/30 border-green-700",
    Absent: "bg-red-900/30 border-red-700",
    "Half-Day": "bg-yellow-900/30 border-yellow-700",
    "Paid Leave": "bg-purple-900/30 border-purple-700",
    "Week Off": "bg-blue-900/30 border-blue-700",
    Holiday: "bg-pink-900/30 border-pink-700",
  };

  // Custom tile content with improved visual feedback
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      // Create a date object with year, month, day only (no time)
      const clickedDate = new Date(date);
      clickedDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
      const dateStr = clickedDate.toISOString().split('T')[0];
      const record = attendanceRecords.find(r => r.date === dateStr);
      
      if (record) {
        return (
          <div className={`w-full h-full p-1 ${statusColors[record.status]}`}>
            <div className="text-xs font-bold">{record.status}</div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
      {error && (
        <div className="bg-red-500 text-white p-3 mb-4 rounded animate-shake">{error}</div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)}></div>
          <div className="bg-slate-800 rounded-lg shadow-xl border border-green-800 w-full max-w-md p-6 z-10 animate-scaleIn">
            <div className="flex items-center mb-4 text-green-500">
              <FaCheckCircle className="text-2xl mr-3 animate-pulse" />
              <h3 className="text-xl font-semibold">Attendance Marked Successfully</h3>
            </div>
            <div className="mb-6">
              <p className="text-gray-200">Attendance has been marked for {localStorage.getItem('submittedDatesCount') || 0} day(s)</p>
            </div>
              <button 
                onClick={() => setShowSuccessModal(false)}
              className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-300"
              >
                OK
              </button>
          </div>
        </div>
      )}

      {/* Mark Attendance Form */}
      <div className="w-full bg-slate-800 shadow-lg rounded-lg mb-8 border border-blue-900 animate-slideIn">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-100">Mark Attendance</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Name */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
              Employee Name
            </label>
            <input
              type="text"
                className="w-full p-2 border border-gray-700 rounded-lg bg-slate-700 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              required
            />
          </div>

            {/* Calendar */}
            <div className="relative">
              <Calendar
                onClickDay={(value, event) => handleTileClick({ date: value, view: 'month' }, event)}
                value={null}
                tileContent={tileContent}
                className="bg-slate-800 text-gray-100 border-gray-700 rounded-lg w-full"
                showNeighboringMonth={false}
              />

              {/* Status Dropdown - Now positioned over the date cell */}
              {showStatusDropdown && (
                <div 
                  className="absolute z-50 bg-slate-700 rounded-lg shadow-xl border border-gray-600"
                  style={{
                    top: `${dropdownPosition.y}px`,
                    left: `${dropdownPosition.x}px`,
                    transform: 'translate(-50%, -50%)',
                    width: '180px'
                  }}
                >
                  <div className="p-2 border-b border-gray-600 text-center font-medium text-gray-300">
                    {formatDate(selectedDate)}
          </div>
                  {statusOptions.map(status => (
          <button
                      key={status}
                      type="button"
                      className={`block w-full text-left px-4 py-2 hover:bg-slate-600 text-gray-100 ${
                        attendanceRecords.find(r => r.date === selectedDate)?.status === status
                          ? 'bg-blue-600'
                          : ''
                      }`}
                      onClick={() => handleStatusSelect(status)}
                    >
                      {status}
          </button>
                  ))}
                  <div className="p-2 border-t border-gray-600">
          <button
                      type="button"
                      onClick={handleCloseDropdown}
                      className="w-full py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition flex items-center justify-center gap-1"
          >
                      <FaTimes className="text-xs" /> Cancel
          </button>
                  </div>
                </div>
          )}
        </div>

            {/* Selected Dates Summary */}
            {selectedDates.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-200 mb-2">Selected Dates</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDates.map(date => {
                    const record = attendanceRecords.find(r => r.date === date);
                    return (
                      <div 
                        key={date}
                        className={`px-3 py-1 rounded-full flex items-center gap-2 ${statusColors[record?.status]}`}
                      >
                        <span>{formatDate(date)}</span>
                        <span className="font-medium">{record?.status}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDate(date)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit and Cancel Buttons */}
            {selectedDates.length > 0 && (
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-lg"
                >
                  <FaCheckCircle /> Submit Attendance
                </button>
                <button
                  type="button"
                  onClick={handleCancelAll}
                  className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2 text-lg"
                >
                  <FaTimes /> Cancel All
                </button>
              </div>
            )}
          </form>
          </div>
      </div>
    </div>
  );
}

