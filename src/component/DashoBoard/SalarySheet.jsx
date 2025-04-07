import React, { useEffect, useState } from "react";

const SalarySheet = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          "http://localhost:8282/public/getAllSalary"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full border-t-transparent border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const viewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">WTL Tourism Pvt.Ltd</h1>
      <p className="italic mb-4">Employee Salary Sheet</p>
      
      {/* Desktop view - Full table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white shadow-md">
          <thead>
            <tr className="bg-yellow-200 text-left">
              <th className="border border-gray-300 px-4 py-2">Employee Email</th>
              <th className="border border-gray-300 px-4 py-2">First Name</th>
              <th className="border border-gray-300 px-4 py-2">Last Name</th>
              <th className="border border-gray-300 px-4 py-2">Bank Acc.No</th>
              <th className="border border-gray-300 px-4 py-2">Branch Name</th>
              <th className="border border-gray-300 px-4 py-2">Bank Name</th>
              <th className="border border-gray-300 px-4 py-2">IFSC Code</th>
              <th className="border border-gray-300 px-4 py-2">Net Salary</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr
                key={employee.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="border border-gray-300 px-4 py-2">{employee.email}</td>
                <td className="border border-gray-300 px-4 py-2">{employee.firstName}</td>
                <td className="border border-gray-300 px-4 py-2">{employee.lastName}</td>
                <td className="border border-gray-300 px-4 py-2">{employee.bankAccountNo}</td>
                <td className="border border-gray-300 px-4 py-2">{employee.branchName}</td>
                <td className="border border-gray-300 px-4 py-2">{employee.bankName}</td>
                <td className="border border-gray-300 px-4 py-2">{employee.bankIfscCode}</td>
                <td className="border border-gray-300 px-4 py-2">{employee.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view - Card-based list */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {employees.map((employee, index) => (
          <div 
            key={employee.id} 
            className="bg-white rounded-lg shadow-md p-4"
            onClick={() => viewEmployeeDetails(employee)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{employee.firstName} {employee.lastName}</h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                ₹{employee.salary}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate">{employee.email}</p>
            <p className="text-xs text-gray-500 mt-2">
              Click to view full details
            </p>
          </div>
        ))}
      </div>

      {/* Mobile detail modal */}
      {selectedEmployee && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Employee Details</h3>
                <button onClick={closeModal} className="text-gray-500">
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p>{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{selectedEmployee.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bank Details</p>
                <p>{selectedEmployee.bankName} ({selectedEmployee.branchName})</p>
                <p>Acc: {selectedEmployee.bankAccountNo}</p>
                <p>IFSC: {selectedEmployee.bankIfscCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="text-lg font-bold">₹{selectedEmployee.salary}</p>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalarySheet;
