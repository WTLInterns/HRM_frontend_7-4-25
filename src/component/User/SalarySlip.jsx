import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import companyLogo from "../../assets/company.jpeg";

const SalaryReport = () => {
  const [empId, setEmpId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [salaryReport, setSalaryReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8282/public/generateReport?empId=${empId}&startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch salary report");
      }

      const data = await response.json();
      setSalaryReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSalarySlipPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("WTL Tourism Pvt.Ltd", 14, 20);

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(150, 10, 50, 20);
    doc.setFontSize(10);
    const imgWidth = 40;
    const imgHeight = 20;
    doc.addImage(companyLogo, "JPEG", 150, 10, imgWidth, imgHeight);
    doc.setFontSize(12);
    doc.text(`Salary Slip From ${startDate} to ${endDate}`, 14, 35);

    const personalInfo = [
      [
        "Name",
        `${salaryReport?.firstName || ""} ${salaryReport?.lastName || ""}`,
      ],
      ["Aadhar No", salaryReport?.aadhar || "N/A"],
      ["Email", salaryReport?.email || "N/A"],
      ["Joining Date", salaryReport?.joiningDatte || "N/A"],
      ["Bank Name", salaryReport?.bankName || "N/A"],
      ["Bank Account No", salaryReport?.bankAccountNo || "N/A"],
      ["Branch Name", salaryReport?.branchName || "N/A"],
      ["IFSC Code", salaryReport?.ifscCode || "N/A"],
    ];

    doc.autoTable({
      head: [["Field", "Details"]],
      body: personalInfo,
      startY: 45,
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 120 },
      },
    });

    const salaryDetails = [
      ["Total Days", salaryReport?.totalDays || 0],
      ["Present Days", salaryReport?.presentDay || 0],
      ["Absent Days", salaryReport?.absentDay || 0],
      ["Holidays", salaryReport?.holiday || 0],
      ["Paid Leaves", salaryReport?.paidleave || 0],
      ["Week Offs", salaryReport?.weekoff || 0],
      ["Half Days", salaryReport?.halfDay || 0],
      ["Per Day Salary", `₹${salaryReport?.perDaySalary || 0}`],
      ["Total Payout", `₹${salaryReport?.totalPayout || 0}`],
      ["Net Payable", `₹${salaryReport?.netPayable || 0}`],
    ];

    doc.autoTable({
      head: [["Description", "Amount"]],
      body: salaryDetails,
      startY: doc.lastAutoTable.finalY + 10,
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 90 },
      },
    });

    const signatureY = doc.lastAutoTable.finalY + 20;
    doc.text("Employee Signature: ___________________", 14, signatureY);
    doc.text("Employer Signature: ___________________", 120, signatureY);

    // Save the PDF
    doc.save(`salary_slip_${empId}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        Generate Salary Report
      </h2>
      <div className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="empId" className="text-sm font-semibold mb-1">
            Employee ID
          </label>
          <input
            type="number"
            id="empId"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
            placeholder="Enter Employee ID"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-sm font-semibold mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-sm font-semibold mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
          >
            Generate Report
          </button>
        </div>
        {loading && <div className="text-center text-gray-500">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {salaryReport && !loading && !error && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Salary Report</h3>
            <div className="text-center mt-4">
              <button
                onClick={generateSalarySlipPDF}
                className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600"
              >
                Download Salary Slip (PDF)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryReport;
