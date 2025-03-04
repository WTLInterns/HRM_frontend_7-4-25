"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import companyLogo from "../../assets/company.jpeg";

// Helper function to format dates from "YYYY-MM-DD" to "DD-MM-YYYY"
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const parts = dateStr.split("-");
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

// Helper functions for converting number to words
const numberToWordsHelper = (num) => {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];
  let str = "";
  if (num > 99) {
    str += a[Math.floor(num / 100)] + " Hundred ";
    num = num % 100;
  }
  if (num > 19) {
    str += b[Math.floor(num / 10)] + " " + a[num % 10];
  } else {
    str += a[num];
  }
  return str.trim();
};

const numberToWords = (num) => {
  if (num == null) return "";
  const numStr = num.toString();
  if (numStr.length > 9) return "Overflow";
  let n = ("000000000" + numStr).substr(-9).match(/.{1,3}/g);
  let str = "";
  str += Number(n[0]) !== 0 ? numberToWordsHelper(Number(n[0])) + " Million " : "";
  str += Number(n[1]) !== 0 ? numberToWordsHelper(Number(n[1])) + " Thousand " : "";
  str += Number(n[2]) !== 0 ? numberToWordsHelper(Number(n[2])) : "";
  return str.trim();
};

const SalaryReport = () => {
  // Now we use employeeName instead of empId.
  const [employeeName, setEmployeeName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [salaryReport, setSalaryReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define color arrays
  const black = [0, 0, 0];
  const white = [255, 255, 255];
  const faintGreen = [220, 230, 195];

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call the backend endpoint using employeeName as a query parameter.
      const response = await fetch(
        `http://localhost:8282/public/generateReport?employeeName=${employeeName}&startDate=${startDate}&endDate=${endDate}`
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
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      let yPos = margin;

      // Helper for drawing cells
      const createCell = (x, y, width, height, text = "", fontSize = 10, align = "center", bold = false, fillColor = white) => {
        doc.setFillColor(...fillColor);
        doc.rect(x, y, width, height, "F");
        doc.setDrawColor(...black);
        doc.setLineWidth(0.1);
        doc.rect(x, y, width, height, "S");
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        if (text) {
          doc.text(text.toString(), align === "center" ? x + width / 2 : x + 2, y + height / 2, {
            align: align === "center" ? "center" : "left",
            baseline: "middle",
          });
        }
      };

      const roundVal = (val) => (val ? Math.round(val) : 0);

      // 1) HEADER
      createCell(margin, yPos, contentWidth, 14, "WTL PVT LTD", 20, "center", true, faintGreen);
      yPos += 14;
      createCell(margin, yPos, contentWidth, 10, "Company Address :- a wing 1st floor city vista office no-016 kharadi pune", 12, "center", true, faintGreen);
      yPos += 10;
      createCell(margin, yPos, contentWidth, 10, `PAY SLIP FOR ${formatDate(startDate)} to ${formatDate(endDate)}`, 14, "center", true, faintGreen);
      yPos += 12;

      // 2) EMPLOYEE INFORMATION HEADER
      createCell(margin, yPos, contentWidth, 10, "Employee Information", 13, "center", true, faintGreen);
      yPos += 10;
      const col1 = contentWidth * 0.15;
      const col2 = contentWidth * 0.35;
      const col3 = contentWidth * 0.15;
      const col4 = contentWidth * 0.35;

      // Row 1: UID & Designation
      createCell(margin, yPos, col1, 10, "UID:", 10, "left", true, white);
      // Use empId as UID instead of employeeName
      createCell(margin + col1, yPos, col2, 10, salaryReport?.uid || "N/A", 10, "left", false, white);
      createCell(margin + col1 + col2, yPos, col3, 10, "Designation:", 10, "left", true, white);
      createCell(margin + col1 + col2 + col3, yPos, col4, 10, salaryReport?.jobRole || "N/A", 10, "left", false, white);
      yPos += 10;

      // Row 2: Name & Department
      createCell(margin, yPos, col1, 10, "Name:", 10, "left", true, white);
      createCell(margin + col1, yPos, col2, 10, `${salaryReport?.firstName || ""} ${salaryReport?.lastName || ""}`, 10, "left", false, white);
      createCell(margin + col1 + col2, yPos, col3, 10, "Department:", 10, "left", true, white);
      createCell(margin + col1 + col2 + col3, yPos, col4, 10, salaryReport?.department || "N/A", 10, "left", false, white);
      yPos += 10;

      // 3) SPLIT SECTION HEADERS
      const halfWidth = contentWidth / 2;
      createCell(margin, yPos, halfWidth, 10, "Employee Attendance", 11, "center", true, faintGreen);
      createCell(margin + halfWidth, yPos, halfWidth, 10, "Salary Transferred To", 11, "center", true, faintGreen);
      yPos += 10;

      // 4) EMPLOYEE ATTENDANCE & BANK DETAILS
      const attendanceCol1 = halfWidth * 0.35;
      const attendanceCol2 = halfWidth * 0.15;
      const attendanceCol3 = halfWidth * 0.50;
      const bankCol1 = halfWidth * 0.4;
      const bankCol2 = halfWidth * 0.6;

      // Row 1: Working Days / Bank Name
      createCell(margin, yPos, attendanceCol1, 10, "Working Days:", 10, "left", true, white);
      createCell(margin + attendanceCol1, yPos, attendanceCol2, 10, String(salaryReport?.workingDays ?? 0), 10, "center", false, white);
      createCell(margin + attendanceCol1 + attendanceCol2, yPos, attendanceCol3, 10, "", 10, "center", false, white);
      createCell(margin + halfWidth, yPos, bankCol1, 10, "Bank Name:", 10, "left", true, white);
      createCell(margin + halfWidth + bankCol1, yPos, bankCol2, 10, salaryReport?.bankName || "N/A", 10, "left", false, white);
      yPos += 10;

      // Row 2: Leave Allowed / Payable Days / Account No
      const payableDaysLabelWidth = attendanceCol3 * 0.7;
      const payableDaysValueWidth = attendanceCol3 * 0.3;
      createCell(margin, yPos, attendanceCol1, 10, "Leave Allowed:", 10, "left", true, white);
      createCell(margin + attendanceCol1, yPos, attendanceCol2, 10, String(salaryReport?.leaveAllowed ?? 0), 10, "center", false, white);
      createCell(margin + attendanceCol1 + attendanceCol2, yPos, payableDaysLabelWidth, 10, "Payable Days:", 10, "left", true, white);
      createCell(margin + attendanceCol1 + attendanceCol2 + payableDaysLabelWidth, yPos, payableDaysValueWidth, 10, String(salaryReport?.payableDays ?? 0), 10, "center", false, white);
      createCell(margin + halfWidth, yPos, bankCol1, 10, "Account No:", 10, "left", true, white);
      createCell(margin + halfWidth + bankCol1, yPos, bankCol2, 10, salaryReport?.bankAccountNo || "N/A", 10, "left", false, white);
      yPos += 10;

      // Row 3: Leave Taken / Branch Name
      createCell(margin, yPos, attendanceCol1, 10, "Leave Taken:", 10, "left", true, white);
      createCell(margin + attendanceCol1, yPos, attendanceCol2, 10, String(salaryReport?.leaveTaken ?? 0), 10, "center", false, white);
      createCell(margin + attendanceCol1 + attendanceCol2, yPos, attendanceCol3, 10, "", 10, "center", false, white);
      createCell(margin + halfWidth, yPos, bankCol1, 10, "Branch Name:", 10, "left", true, white);
      createCell(margin + halfWidth + bankCol1, yPos, bankCol2, 10, salaryReport?.branchName || "N/A", 10, "left", false, white);
      yPos += 10;

      // 5) SALARY CALCULATIONS HEADER
      createCell(margin, yPos, contentWidth, 10, "Salary Calculations", 11, "center", true, faintGreen);
      yPos += 10;

      // 6) SALARY CALCULATIONS GRID
      const salaryCol1 = contentWidth * 0.4;
      const salaryCol2 = contentWidth * 0.2;
      const salaryCol3 = contentWidth * 0.2;
      const salaryCol4 = contentWidth * 0.2;

      // Example: Yearly CTC = 120000
      const ctcVal = 120000;
      const monthlyCtcVal = ctcVal / 12;
      const workingDays = salaryReport?.workingDays || 30;
      const perDaySalary = monthlyCtcVal / workingDays;
      const totalLeaves = workingDays - (salaryReport?.payableDays || 0);
      const deductionVal = Math.round(perDaySalary * totalLeaves);
      const professionalTaxVal = roundVal(salaryReport?.professionalTax || 0);
      const tdsVal = roundVal(salaryReport?.tds || 0);
      const totalDeductions = deductionVal + professionalTaxVal + tdsVal;
      const basicVal = roundVal(salaryReport?.basic);
      const hraVal = roundVal(salaryReport?.hra);
      const daVal = roundVal(salaryReport?.daAllowance);
      const specialVal = roundVal(salaryReport?.specialAllowance);
      const totalAllowanceVal = roundVal(salaryReport?.totalAllowance);
      const grossSalaryVal = roundVal(salaryReport?.grossSalary);

      // Compute net payable salary now (moved before the Gross Salary row)
      const computedNetPayable = grossSalaryVal - totalDeductions;
      const netPayInteger = Math.max(0, roundVal(computedNetPayable));

      // Row: Cost To Company - CTC & Deductions
      createCell(margin, yPos, salaryCol1, 10, "Cost To Company - CTC", 10, "left", true, white);
      createCell(margin + salaryCol1, yPos, salaryCol2, 10, `Rs. ${ctcVal}`, 10, "left", false, white);
      createCell(margin + salaryCol1 + salaryCol2, yPos, salaryCol3, 10, "Deductions", 10, "left", true, white);
      createCell(
        margin + salaryCol1 + salaryCol2 + salaryCol3,
        yPos,
        salaryCol4,
        10,
        `Rs. ${deductionVal}`,
        10,
        "right",
        false,
        white
      );
      yPos += 10;

      // Row: Basic & Professional Tax
      createCell(margin, yPos, salaryCol1, 10, "Basic", 10, "left", true, white);
      createCell(margin + salaryCol1, yPos, salaryCol2, 10, `Rs. ${basicVal}`, 10, "left", false, white);
      createCell(margin + salaryCol1 + salaryCol2, yPos, salaryCol3, 10, "Professional Tax", 10, "left", true, white);
      createCell(
        margin + salaryCol1 + salaryCol2 + salaryCol3,
        yPos,
        salaryCol4,
        10,
        `Rs. ${professionalTaxVal}`,
        10,
        "right",
        false,
        white
      );
      yPos += 10;

      // Row: House Rent Allowance & TDS
      createCell(margin, yPos, salaryCol1, 10, "House Rent Allowance", 10, "left", true, white);
      createCell(margin + salaryCol1, yPos, salaryCol2, 10, `Rs. ${hraVal}`, 10, "left", false, white);
      createCell(margin + salaryCol1 + salaryCol2, yPos, salaryCol3, 10, "TDS", 10, "left", true, white);
      createCell(
        margin + salaryCol1 + salaryCol2 + salaryCol3,
        yPos,
        salaryCol4,
        10,
        `Rs. ${tdsVal}`,
        10,
        "right",
        false,
        white
      );
      yPos += 10;

      // Row: DA Allowance & blank
      createCell(margin, yPos, salaryCol1, 10, "DA Allowance (53% of Basic)", 10, "left", true, white);
      createCell(margin + salaryCol1, yPos, salaryCol2, 10, `Rs. ${daVal}`, 10, "left", false, white);
      createCell(margin + salaryCol1 + salaryCol2, yPos, salaryCol3, 10, "", 10, "left", true, white);
      createCell(margin + salaryCol1 + salaryCol2 + salaryCol3, yPos, salaryCol4, 10, "", 10, "right", false, white);
      yPos += 10;

      // Row: Special Allowance & Total Deductions
      createCell(margin, yPos, salaryCol1, 10, "Special Allowance", 10, "left", true, white);
      createCell(margin + salaryCol1, yPos, salaryCol2, 10, `Rs. ${specialVal}`, 10, "left", false, white);
      createCell(margin + salaryCol1 + salaryCol2, yPos, salaryCol3, 10, "Total Deductions", 10, "left", true, white);
      createCell(
        margin + salaryCol1 + salaryCol2 + salaryCol3,
        yPos,
        salaryCol4,
        10,
        `Rs. ${totalDeductions}`,
        10,
        "right",
        false,
        white
      );
      yPos += 10;

      // Row: Total Allowance & Additional Perks
      createCell(margin, yPos, salaryCol1, 10, "Total Allowance", 10, "right", true, white);
      createCell(margin + salaryCol1, yPos, salaryCol2, 10, `Rs. ${totalAllowanceVal}`, 10, "left", false, white);
      createCell(margin + salaryCol1 + salaryCol2, yPos, salaryCol3, 10, "Additional Perks", 10, "left", true, white);
      createCell(
        margin + salaryCol1 + salaryCol2 + salaryCol3,
        yPos,
        salaryCol4,
        10,
        salaryReport?.additionalPerks || "N/A",
        10,
        "right",
        false,
        white
      );
      yPos += 10;

      // Row: Gross Salary & Bonus
      createCell(margin, yPos, salaryCol1, 10, "Gross Salary", 10, "right", true, white);
      createCell(margin + salaryCol1, yPos, salaryCol2, 10, `Rs. ${grossSalaryVal}`, 10, "left", false, white);
      createCell(margin + salaryCol1 + salaryCol2, yPos, salaryCol3, 10, "Bonus", 10, "left", true, white);
      createCell(
        margin + salaryCol1 + salaryCol2 + salaryCol3,
        yPos,
        salaryCol4,
        10,
        `Rs. ${roundVal(salaryReport?.bonus || 0)}`,
        10,
        "right",
        false,
        white
      );
      yPos += 10;

      // New Row: Net Payable Salary (added below the Bonus row)
      createCell(margin, yPos, salaryCol1 + salaryCol2, 10, "", 10, "left", false, white);
      createCell(margin + salaryCol1 + salaryCol2, yPos, salaryCol3, 10, "Net Payable Salary", 10, "left", true, white);
      createCell(
        margin + salaryCol1 + salaryCol2 + salaryCol3,
        yPos,
        salaryCol4,
        10,
        `Rs. ${netPayInteger}`,
        10,
        "right",
        false,
        white
      );
      yPos += 10;

      // Row: Amount in Words
      const amountWords = numberToWords(netPayInteger) + " Rupees Only";
      createCell(margin, yPos, contentWidth * 0.3, 10, "Amount in Words:", 10, "left", true, white);
      createCell(
        margin + contentWidth * 0.3,
        yPos,
        contentWidth * 0.7,
        10,
        amountWords,
        10,
        "center",
        false,
        white
      );
      yPos += 10;
      createCell(margin, yPos, contentWidth, 10, "", 10, "left", false, white);
      yPos += 10;

      // Signature Section
      const signatureWidth = contentWidth / 3;
      createCell(margin, yPos, signatureWidth, 10, "Prepared By:", 10, "left", true, white);
      createCell(margin + signatureWidth, yPos, signatureWidth, 10, "Approved By:", 10, "left", true, white);
      createCell(margin + 2 * signatureWidth, yPos, signatureWidth, 10, "", 10, "left", false, white);
      yPos += 10;
      createCell(margin, yPos, signatureWidth, 20, "", 10, "left", false, white);
      createCell(margin + signatureWidth, yPos, signatureWidth, 20, "", 10, "left", false, white);
      createCell(margin + 2 * signatureWidth, yPos, signatureWidth, 20, "", 10, "left", false, white);
      yPos += 20;

      if (companyLogo) {
        try {
          doc.addImage(companyLogo, "JPEG", margin + signatureWidth + 20, yPos - 18, 30, 16);
        } catch (error) {
          console.error("Error adding company stamp:", error);
        }
      }

      doc.save(`WTL_salary_slip_${employeeName || "DEC2024"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please check console for details.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Generate Salary Report</h2>
      <div className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="employeeName" className="text-sm font-semibold mb-1">
            Employee Name
          </label>
          <input
            type="text"
            id="employeeName"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
            placeholder="Enter Employee Name"
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
          <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600">
            Generate Report
          </button>
        </div>
        {loading && <div className="text-center text-gray-500">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        <div className="mt-6">
          {salaryReport && (
            <div className="text-center mt-4">
              <button
                onClick={generateSalarySlipPDF}
                className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600"
              >
                Download Salary Slip (PDF)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryReport;
